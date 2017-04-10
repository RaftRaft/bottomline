package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
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
                                                        @RequestBody ServiceUsage serviceUsage) {

        LOG.info("Received request to add service usage {}", serviceUsage, userId);

        User user = ControllerHelper.processUser(em, userId);

        if (!isServiceUsageValid(serviceUsage)) {
            throw new WebApplicationException("Please fill all required fields", HttpStatus.BAD_REQUEST);
        }

        if (isServiceUsageDuplicated(serviceUsage, groupId, serviceId, itemId)) {
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

        ServiceUsage prevServiceUsage = getPreviousServiceUsage(serviceUsage, groupId, serviceId, itemId);
        double currConsumption = 0;
        if (prevServiceUsage != null) {
            currConsumption = serviceUsage.getIndex() - prevServiceUsage.getIndex();
        }

        serviceUsage.setConsumption(currConsumption);
        serviceUsage.setOwner(user);
        serviceUsage.setGroup(group);
        serviceUsage.setService(service);
        serviceUsage.setItem(item);

        em.merge(serviceUsage);
        em.flush();

        return new ResponseEntity<>(serviceUsage, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, path = "{serviceUsageId}/item/{itemId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ServiceUsage> updateServiceUsage(@RequestHeader(AuthFilter.USER_HEADER) String userId,
                                                           @PathVariable("itemId") Integer itemId,
                                                           @PathVariable("serviceUsageId") Integer serviceUsageId,
                                                           @RequestBody ServiceUsage serviceUsage) {

        LOG.info("Received request to update service usage {}", serviceUsage);

        ControllerHelper.processUser(em, userId);

        if (!isServiceUsageValid(serviceUsage)) {
            throw new WebApplicationException("Please fill all required fields", HttpStatus.BAD_REQUEST);
        }

        ServiceUsage oldServiceUsage = em.find(ServiceUsage.class, serviceUsageId);
        if (oldServiceUsage == null) {
            throw new WebApplicationException("Registration does not exist", HttpStatus.BAD_REQUEST);
        }

        MeasurementItem item = em.find(MeasurementItem.class, itemId);
        if (item == null) {
            throw new WebApplicationException("Item does not exist", HttpStatus.BAD_REQUEST);
        }

        if (doesSimillarServiceUsageExists(serviceUsage, oldServiceUsage.getGroup().getId(),
                oldServiceUsage.getService().getId(), itemId, oldServiceUsage.getId())) {
            throw new WebApplicationException("An identical registration already exists", HttpStatus.BAD_REQUEST);
        }

        double currConsumption = 0;
        if (serviceUsage.getConsumption() == null) {
            ServiceUsage prevServiceUsage = getPreviousServiceUsage(serviceUsage, oldServiceUsage.getGroup().getId(),
                    oldServiceUsage.getService().getId(), itemId);
            if (prevServiceUsage != null) {
                currConsumption = serviceUsage.getIndex() - prevServiceUsage.getIndex();
            }
        }

        oldServiceUsage.setConsumption(serviceUsage.getConsumption() != null ? serviceUsage.getConsumption() : currConsumption);
        oldServiceUsage.setIndex(serviceUsage.getIndex());
        oldServiceUsage.setDesc(serviceUsage.getDesc());
        oldServiceUsage.setDate(serviceUsage.getDate());
        oldServiceUsage.setItem(item);

        em.merge(oldServiceUsage);
        em.flush();

        return new ResponseEntity<>(oldServiceUsage, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "group/{groupId}/service/{serviceId}")
    public ResponseEntity<List<ServiceUsage>> getServiceUsageList(@RequestHeader(AuthFilter.USER_HEADER) String userId,
                                                                  @PathVariable("groupId") Integer groupId,
                                                                  @PathVariable("serviceId") Integer serviceId,
                                                                  @RequestParam("offset") Integer offset,
                                                                  @RequestParam("max") Integer maxResults,
                                                                  @RequestParam(value = "itemId", required = false) List<Integer> itemIdList,
                                                                  @RequestParam(value = "date", required = false) Long dateSince) {

        LOG.info("Received request to retrieve service usages for group {} and service {}", groupId, serviceId);

        ControllerHelper.processUser(em, userId);

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }
        Service service = em.find(Service.class, serviceId);
        if (service == null) {
            throw new WebApplicationException("Service does not exist", HttpStatus.BAD_REQUEST);
        }

        if (dateSince == null) {
            dateSince = 0L;
        }

        long count = 0;
        List<ServiceUsage> serviceUsageList;
        if (itemIdList == null) {
            serviceUsageList = em.createQuery("from ServiceUsage su where su.group.id=:groupId " +
                    "and su.service.id=:serviceId and su.date>:dateSince order by su.date desc")
                    .setFirstResult(offset)
                    .setMaxResults(maxResults)
                    .setParameter("groupId", groupId)
                    .setParameter("serviceId", serviceId)
                    .setParameter("dateSince", dateSince)
                    .getResultList();
            count = (long) em.createQuery("select count(*) from ServiceUsage su where su.group.id=:groupId " +
                    "and su.service.id=:serviceId and su.date>:dateSince order by su.date desc")
                    .setParameter("groupId", groupId)
                    .setParameter("serviceId", serviceId)
                    .setParameter("dateSince", dateSince)
                    .getResultList().get(0);

        } else {
            serviceUsageList = em.createQuery("from ServiceUsage su where su.group.id=:groupId " +
                    "and su.service.id=:serviceId and su.item.id in (:itemIdList) and su.date>:dateSince order by su.date desc")
                    .setFirstResult(offset)
                    .setMaxResults(maxResults)
                    .setParameter("groupId", groupId)
                    .setParameter("serviceId", serviceId)
                    .setParameter("dateSince", dateSince)
                    .setParameter("itemIdList", itemIdList)
                    .getResultList();
            count = (long) em.createQuery("select count(*) from ServiceUsage su where su.group.id=:groupId " +
                    "and su.service.id=:serviceId and su.item.id in (:itemIdList) and su.date>:dateSince order by su.date desc")
                    .setParameter("groupId", groupId)
                    .setParameter("serviceId", serviceId)
                    .setParameter("dateSince", dateSince)
                    .setParameter("itemIdList", itemIdList)
                    .getResultList().get(0);
        }

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("count", String.valueOf(count));

        return new ResponseEntity<>(serviceUsageList, responseHeaders, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "{serviceUsageId}")
    public ResponseEntity<String> removeServiceUsage(@RequestHeader(AuthFilter.USER_HEADER) String userId,
                                                     @PathVariable("serviceUsageId") Integer serviceUsageId) {
        LOG.info("Received request to remove service usage with id {}", serviceUsageId);

        User user = ControllerHelper.processUser(em, userId);

        ServiceUsage serviceUsage = em.find(ServiceUsage.class, serviceUsageId);
        if (serviceUsage == null) {
            throw new WebApplicationException("Registration does not exist", HttpStatus.BAD_REQUEST);
        }

        if (!user.getId().equals(serviceUsage.getOwner().getId())) {
            throw new WebApplicationException("Only the owner can remove this registration", HttpStatus.BAD_REQUEST);
        }

        em.remove(serviceUsage);
        return new ResponseEntity<>("Registration removed", HttpStatus.OK);
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
        if (usageList.isEmpty()) {
            return false;
        }
        return true;
    }

    private boolean doesSimillarServiceUsageExists(ServiceUsage usage, Integer groupId, Integer serviceId, Integer itemId, Integer id) {
        List<ServiceUsage> usageList = em.createQuery("from ServiceUsage su where su.group.id=:groupId and su.service.id=:serviceId" +
                " and su.item.id=:itemId and su.date=:date and su.id!=:id")
                .setParameter("groupId", groupId).setParameter("serviceId", serviceId).setParameter("itemId", itemId)
                .setParameter("date", usage.getDate())
                .setParameter("id", id)
                .getResultList();
        if (usageList.isEmpty()) {
            return false;
        }
        return true;
    }

    private ServiceUsage getPreviousServiceUsage(ServiceUsage usage, Integer groupId, Integer serviceId, Integer itemId) {
        List<ServiceUsage> serviceUsageList = em.createQuery("from ServiceUsage su where su.group.id=:groupId and su.service.id=:serviceId" +
                " and su.item.id=:itemId and su.date<:date order by su.date desc").setMaxResults(1)
                .setParameter("groupId", groupId).setParameter("serviceId", serviceId).setParameter("itemId", itemId)
                .setParameter("date", usage.getDate()).getResultList();
        if (serviceUsageList.isEmpty()) {
            return null;
        } else {
            return serviceUsageList.get(0);
        }
    }

    public static void main(String... args) {
        String query = "from ServiceUsage su where su.group.id=:groupId and su.service.id=:serviceId %s order by su.date desc";
        System.out.print(String.format(query, ""));
    }
}
