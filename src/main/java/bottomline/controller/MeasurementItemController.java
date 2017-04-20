package bottomline.controller;

import bottomline.App;
import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.MeasurementItem;
import bottomline.model.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.Set;

/**
 * Created by raft on 09.03.2017.
 */

@RestController
@RequestMapping("/measurement-item")
@Transactional
public class MeasurementItemController {

    private static final Logger LOG = LoggerFactory.getLogger(MeasurementItemController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, path = "service/{serviceId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MeasurementItem> addItem(@RequestBody MeasurementItem item, @PathVariable("serviceId") Integer serviceId) {
        LOG.info("Received request to add measurement item for service with id {}", serviceId);

        if (!isMeasurementItemValid(item)) {
            throw new WebApplicationException("Measurement item is not valid.", HttpStatus.BAD_REQUEST);
        }

        Service service = em.find(Service.class, serviceId);
        if (service == null) {
            throw new WebApplicationException("Service does not exist", HttpStatus.BAD_REQUEST);
        }

        if (getSimilarItem(service, item) != null) {
            throw new WebApplicationException("Another identical item exists",
                    HttpStatus.BAD_REQUEST);
        }

        service.getItemList().add(item);
        item.setService(service);
        em.merge(service);
        em.flush();
        item = getSimilarItem(service, item);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "{itemId}")
    public ResponseEntity<String> removeItem(@RequestHeader(App.USER_HEADER) String userId, @PathVariable("itemId") Integer itemId) {
        LOG.info("Received request to remove measurement item with id {}", itemId);

        ControllerHelper.processUser(em, userId);

        MeasurementItem item = em.find(MeasurementItem.class, itemId);
        if (item == null) {
            throw new WebApplicationException("Item does not exist", HttpStatus.BAD_REQUEST);
        }

        Service service = item.getService();
        service.getItemList().remove(item);
        removeServiceUsageFromItem(item);
        em.merge(service);
        return new ResponseEntity<>("Item removed", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<String> updateItem(@RequestHeader(App.USER_HEADER) String userId, @RequestBody MeasurementItem item) {
        LOG.info("Received request to update measurement item {}", item);

        ControllerHelper.processUser(em, userId);

        if (!isMeasurementItemValid(item)) {
            throw new WebApplicationException("Measurement item is not valid.", HttpStatus.BAD_REQUEST);
        }

        MeasurementItem oldItem = em.find(MeasurementItem.class, item.getId());
        if (oldItem == null) {
            throw new WebApplicationException("Item does not exist", HttpStatus.BAD_REQUEST);
        }

        if (getSimilarItem(oldItem.getService(), item) != null) {
            throw new WebApplicationException("Another identical item exists",
                    HttpStatus.BAD_REQUEST);
        }

        oldItem.setLabel(item.getLabel());
        oldItem.setUnitOfMeasurement(item.getUnitOfMeasurement());

        em.merge(oldItem);
        return new ResponseEntity<>("Item removed", HttpStatus.OK);
    }

    private MeasurementItem getSimilarItem(Service service, MeasurementItem item) {
        Set<MeasurementItem> itemList = service.getItemList();
        for (MeasurementItem el : itemList) {
            if (el.getId() != item.id && el.getLabel().toLowerCase().equals(item.getLabel().toLowerCase())
                    && el.getUnitOfMeasurement().toLowerCase().equals(item.getUnitOfMeasurement().toLowerCase())) {
                return el;
            }
        }
        return null;
    }

    private void removeServiceUsageFromItem(MeasurementItem item) {
        em.createQuery("delete from ServiceUsage su where su.item.id=:itemId")
                .setParameter("itemId", item.getId())
                .executeUpdate();
    }

    private static boolean isMeasurementItemValid(MeasurementItem item) {
        if (item.getLabel() == null || item.getUnitOfMeasurement() == null
                || item.getLabel().isEmpty() || item.getUnitOfMeasurement().isEmpty()) {
            return false;
        }
        return true;
    }
}
