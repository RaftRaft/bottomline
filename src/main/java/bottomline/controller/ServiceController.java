package bottomline.controller;

import bottomline.model.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("/service")
@Transactional
public class ServiceController {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, path = "{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> addService(@RequestBody Service service, @PathVariable("userId") String userId) {
        return null;
    }
}
