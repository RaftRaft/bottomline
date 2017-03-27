package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.Group;
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
@RequestMapping("/service")
@Transactional
public class ServiceController {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, path = "/group/{groupId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Service> addServiceToGroup(@RequestHeader(AuthFilter.USER_HEADER) String userId, @RequestBody Service service,
                                                     @PathVariable("groupId") Integer groupId
    ) {
        LOG.info("Received request to add service {} for group id {} and owner with id {}", service, groupId, userId);

        if (!isServiceValid(service)) {
            throw new WebApplicationException("Service is not valid.", HttpStatus.BAD_REQUEST);
        }

        User user = ControllerHelper.processUser(em, userId);

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        if (service.getId() == null) {
            if (getOwnerService(user, service) != null) {
                throw new WebApplicationException("You already have a service with same label", HttpStatus.BAD_REQUEST);
            }
            service.setOwner(user);
        } else {
            service = em.find(Service.class, service.getId());
        }

        if (groupHasService(group, service)) {
            throw new WebApplicationException("A service with same name already exists for this group", HttpStatus.BAD_REQUEST);
        }

        service.getGroupList().add(group);
        group.getServiceList().add(service);
        em.merge(group);
        em.flush();
        service = getOwnerService(user, service);
        return new ResponseEntity<>(service, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateService(@RequestBody Service service) {
        LOG.info("Received request to update service  {}", service);

        if (!isServiceValid(service)) {
            throw new WebApplicationException("Service not valid", HttpStatus.BAD_REQUEST);
        }
        if (isServiceDuplicated(service, service.getOwner().getId())) {
            throw new WebApplicationException("Service already exists", HttpStatus.BAD_REQUEST);
        }

        Service oldService = em.find(Service.class, service.getId());
        if (oldService == null) {
            throw new WebApplicationException("Service does not exist", HttpStatus.BAD_REQUEST);
        }

        oldService.setLabel(service.getLabel());
        oldService.setDesc(service.getDesc());

        em.merge(oldService);
        return new ResponseEntity<>("Service updated", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<List<Service>> getServicesFromOwner(@RequestHeader(AuthFilter.USER_HEADER) String userId) {
        LOG.info("Received request to get services from owner with id {}", userId);
        User user = ControllerHelper.processUser(em, userId);
        List<Service> serviceList = em.createQuery("from Service s where s.owner.id=:userId")
                .setParameter("userId", user.getId()).getResultList();
        return new ResponseEntity<>(serviceList, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "{serviceId}")
    public ResponseEntity<String> removeService(@RequestHeader(AuthFilter.USER_HEADER) String userId, @PathVariable("serviceId") Integer serviceId) {
        LOG.info("Received request to remove service with id", serviceId);

        ControllerHelper.processUser(em, userId);

        Service service = em.find(Service.class, serviceId);
        if (service == null) {
            throw new WebApplicationException("Service does not exist", HttpStatus.BAD_REQUEST);
        }

        for (Group group : service.getGroupList()) {
            group.getServiceList().remove(service);
        }

        em.remove(service);
        return new ResponseEntity<>("Service removed", HttpStatus.OK);
    }

    private boolean groupHasService(Group group, Service service) {
        Set<Service> serviceList = group.getServiceList();
        for (Service el : serviceList) {
            if (el.getLabel().toLowerCase().equals(service.getLabel().toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    private Service getOwnerService(User user, Service service) {
        List<Service> serviceList = em.createQuery("from Service s where s.owner.id=:userId and s.label=:label")
                .setParameter("userId", user.getId()).setParameter("label", service.getLabel()).getResultList();
        for (Service oldService : serviceList) {
            if (oldService.getLabel().toLowerCase().equals(service.getLabel().toLowerCase())) {
                return oldService;
            }
        }
        return null;
    }

    private boolean isServiceDuplicated(Service service, String userId) {
        List<Service> serviceList = em.createQuery("from Service s where s.id!=:id and s.label=:label and s.owner.id=:userId")
                .setParameter("id", service.getId())
                .setParameter("label", service.getLabel())
                .setParameter("userId", userId).getResultList();
        return !serviceList.isEmpty();
    }

    private static boolean isServiceValid(Service service) {
        if (service.getLabel() == null || service.getLabel().isEmpty()) {
            return false;
        }
        return true;
    }
}
