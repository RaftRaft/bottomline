package bottomline.controller;

import bottomline.exceptions.WebApplicationException;
import bottomline.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

/**
 * Created by raft on 09.03.2017.
 */

@RestController
@RequestMapping("/user")
@Transactional
public class UserController {

    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addUser(@RequestBody User user) {
        LOG.info("Received request to add user  {}", user);
        if (!isUserValid(user)) {
            throw new WebApplicationException("Invalid user", HttpStatus.BAD_REQUEST);
        }
        em.merge(user);
        return new ResponseEntity<>("User added", HttpStatus.OK);
    }

    private boolean isUserValid(User user) {
        if (user.getId() == null || user.getEmail() == null || user.getName() == null || user.getProfileImageUrl() == null) {
            return false;
        }
        return true;
    }
}
