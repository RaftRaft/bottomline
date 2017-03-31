package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.*;
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

/**
 * Created by raft on 09.03.2017.
 */

@RestController
@RequestMapping("/service-usage")
@Transactional
public class ServiceUsageController {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceUsageController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, path = "group/{groupId}/service/{serviceId}/item/{itemId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ServiceUsage> addServiceUsage(@RequestHeader(AuthFilter.USER_HEADER) String userId,
                                                        @PathVariable("groupId") Integer groupId,
                                                        @PathVariable("serviceId") Integer serviceId,
                                                        @PathVariable("itemId") Integer itemId,
                                                        @RequestBody ServiceUsage usage) {

        LOG.info("Received request to add service usage {}", usage, userId);

        User user = ControllerHelper.processUser(em, userId);

        if (!isServiceUsageValid(usage)) {
            throw new WebApplicationException("Please fill all required fields", HttpStatus.BAD_REQUEST);
        }

        if (isServiceUsageDuplicated(usage, groupId, serviceId, itemId)) {
            throw new WebApplicationException("An identical registration already exists", HttpStatus.BAD_REQUEST);
        }

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }
        Service service = em.find(Service.class, serviceId);
        if (service == null) {
            throw new WebApplicationException("Service does not exist", HttpStatus.BAD_REQUEST);
        }
        MeasurementItem item = em.find(MeasurementItem.class, itemId);
        if (item == null) {
            throw new WebApplicationException("Item does not exist", HttpStatus.BAD_REQUEST);
        }

        usage.setOwner(user);
        usage.setGroup(group);
        usage.setService(service);
        usage.setItem(item);

        em.merge(usage);
        em.flush();

        return new ResponseEntity<>(usage, HttpStatus.OK);
    }

    private static boolean isServiceUsageValid(ServiceUsage usage) {
        if (usage.getDate() == null || usage.getIndex() == null) {
            return false;
        }
        return true;
    }

    private boolean isServiceUsageDuplicated(ServiceUsage usage, Integer groupId, Integer serviceId, Integer itemId) {
        List<ServiceUsage> usageList = em.createQuery("from ServiceUsage su where su.group.id=:groupId and su.service.id=:serviceId" +
                " and su.item.id=:itemId and su.date=:date")
                .setParameter("groupId", groupId).setParameter("serviceId", serviceId).setParameter("itemId", itemId)
                .setParameter("date", usage.getDate()).getResultList();
        if (!usageList.isEmpty()) {
            return false;
        }
        return true;
    }
}
