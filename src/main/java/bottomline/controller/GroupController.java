package bottomline.controller;

import bottomline.exceptions.WebApplicationException;
import bottomline.model.Group;
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
@RequestMapping("/group")
@Transactional
public class GroupController {

    private static final Logger LOG = LoggerFactory.getLogger(GroupController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addGroup(@RequestBody Group group) {
        LOG.info("Received request to add group  {}", group);
        if (doesGroupExist(group)) {
            throw new WebApplicationException("Group already exists", HttpStatus.BAD_REQUEST);
        }
        if (!isGroupValid(group)) {
            throw new WebApplicationException("Group not valid", HttpStatus.BAD_REQUEST);
        }
        em.persist(group);
        return new ResponseEntity<String>("Group added", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateGroup(@RequestBody Group group) {
        LOG.info("Received request to update group  {}", group);

        if (!isGroupValid(group)) {
            throw new WebApplicationException("Group not valid", HttpStatus.BAD_REQUEST);
        }

        Group groupOld = em.find(Group.class, group.getId());
        if (groupOld == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        groupOld.setLabel(group.getLabel());
        groupOld.setDesc(group.getDesc());

        em.merge(groupOld);
        return new ResponseEntity<String>("Group updated", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "{owner}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Group>> getGroups(@PathVariable("owner") final String owner) {
        LOG.info("Received request to get groups for owner {}", owner);
        List<Group> groupList = em.createQuery("from Group g where g.owner=:owner")
                .setParameter("owner", owner).getResultList();
        return new ResponseEntity<List<Group>>(groupList, HttpStatus.OK);
    }

    private boolean doesGroupExist(Group group) {
        List<Group> groupList = em.createQuery("from Group g where g.label=:label and g.owner=:owner")
                .setParameter("label", group.getLabel())
                .setParameter("owner", group.getOwner()).getResultList();
        return !groupList.isEmpty();
    }

    private static boolean isGroupValid(Group group) {
        if (group.getLabel() == null || group.getOwner() == null) {
            return false;
        }
        return true;
    }
}
