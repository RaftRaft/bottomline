package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.ServiceUsage;
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

/**
 * Created by raft on 09.03.2017.
 */

@RestController
@RequestMapping("/usage")
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

        return new ResponseEntity<>(service, HttpStatus.OK);

    private static boolean isServiceUsageValid(ServiceUsage usage) {
        if (usage.getDate() == null || usage.getIndex() == null) {
            return false;
        }
        return true;
    }
}
