package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.MeasurementItem;
import bottomline.model.Service;
import bottomline.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;
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
    public ResponseEntity<MeasurementItem> addItem(@RequestHeader(AuthFilter.USER_HEADER) String userId, @RequestBody MeasurementItem item, @PathVariable("serviceId") Integer serviceId) {
        LOG.info("Received request to add measurement item for service with id {}", serviceId);

        if (!isMeasurementItemValid(item)) {
            throw new WebApplicationException("Measurement item is not valid.", HttpStatus.BAD_REQUEST);
        }

        User user = ControllerHelper.getUser(em, userId);

        Service service = em.find(Service.class, serviceId);
        if (service == null) {
            throw new WebApplicationException("Service does not exist", HttpStatus.BAD_REQUEST);
        }

        if (serviceHasItem(service, item)) {
            throw new WebApplicationException("A measurement item with same name and unit of measurement already exists for this service",
                    HttpStatus.BAD_REQUEST);
        }

        MeasurementItem oldItem = getOwnerMeasurementItem(user, item);
        if (oldItem != null) {
            item = oldItem;
        } else {
            item.setOwner(user);
        }

        System.out.print("zzzz: " + service.getItemList());
        service.getItemList().add(item);
        em.merge(service);
        em.flush();
        item = getOwnerMeasurementItem(user, item);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    private boolean serviceHasItem(Service service, MeasurementItem item) {
        Set<MeasurementItem> itemList = service.getItemList();
        for (MeasurementItem el : itemList) {
            if (el.getLabel().toLowerCase().equals(item.getLabel().toLowerCase())
                    && el.getUnitOfMeasurement().toLowerCase().equals(item.getUnitOfMeasurement().toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    private MeasurementItem getOwnerMeasurementItem(User user, MeasurementItem item) {
        List<MeasurementItem> itemList = em.createQuery("from MeasurementItem mu where mu.owner.id=:userId and mu.label=:label")
                .setParameter("userId", user.getId()).setParameter("label", item.getLabel()).getResultList();
        for (MeasurementItem oldItem : itemList) {
            if (oldItem.getLabel().toLowerCase().equals(item.getLabel().toLowerCase())) {
                return oldItem;
            }
        }
        return null;
    }

    private static boolean isMeasurementItemValid(MeasurementItem item) {
        if (item.getLabel() == null || item.getUnitOfMeasurement() == null
                || item.getLabel().isEmpty() || item.getUnitOfMeasurement().isEmpty()) {
            return false;
        }
        return true;
    }
}
