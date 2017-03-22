package bottomline.controller;

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

    @RequestMapping(method = RequestMethod.POST, path = "/group/{groupId}/user/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Service> addService(@RequestBody Service service, @PathVariable("groupId") Integer groupId,
                                              @PathVariable("userId") String userId) {
        LOG.info("Received request to add service {} for group id {} and owner with id {}", service, groupId, userId);

        if (!isServiceValid(service)) {
            throw new WebApplicationException("Service is not valid.", HttpStatus.BAD_REQUEST);
        }

        User user = em.find(User.class, userId);
        if (user == null) {
            throw new WebApplicationException("User does not exist", HttpStatus.BAD_REQUEST);
        }

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        if (groupHasService(group, service)) {
            throw new WebApplicationException("A service with same name already exists for this group", HttpStatus.BAD_REQUEST);
        }

        service.setOwner(user);
        group.getServiceList().add(service);
        em.merge(group);
        em.flush();
        return new ResponseEntity<>(group.getServiceList().get(group.getServiceList().size() - 1), HttpStatus.OK);
    }

    private boolean groupHasService(Group group, Service service) {
        List<Service> serviceList = group.getServiceList();
        for (Service el : serviceList) {
            if (el.getLabel().equals(service.getLabel())) {
                return true;
            }
        }
        return false;
    }

    private static boolean isServiceValid(Service service) {
        if (service.getLabel() == null) {
            return false;
        }
        return true;
    }
}
