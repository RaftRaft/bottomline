package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.Group;
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
@RequestMapping("/group")
@Transactional
public class GroupController {

    private static final Logger LOG = LoggerFactory.getLogger(GroupController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Group> addGroup(@RequestHeader(AuthFilter.USER_HEADER) String userId, @RequestBody Group group) {
        LOG.info("Received request to add item {} for owner with id {}", group, userId);

        if (!isGroupValid(group)) {
            throw new WebApplicationException("Group not valid", HttpStatus.BAD_REQUEST);
        }

        User user = ControllerHelper.getUser(em, userId);

        if (isGroupDuplicated(group, userId)) {
            throw new WebApplicationException("Group already exists", HttpStatus.BAD_REQUEST);
        }

        group.setOwner(user);
        em.persist(group);
        em.flush();
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateGroup(@RequestBody Group group) {
        LOG.info("Received request to update item  {}", group);

        if (!isGroupValid(group)) {
            throw new WebApplicationException("Group not valid", HttpStatus.BAD_REQUEST);
        }
        if (isGroupDuplicated(group, group.getOwner().getId())) {
            throw new WebApplicationException("Group already exists", HttpStatus.BAD_REQUEST);
        }

        Group groupOld = em.find(Group.class, group.getId());
        if (groupOld == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        groupOld.setLabel(group.getLabel());
        groupOld.setDesc(group.getDesc());

        em.merge(groupOld);
        return new ResponseEntity<>("Group updated", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Group>> getGroups(@RequestHeader(AuthFilter.USER_HEADER) String userId) {
        LOG.info("Received request to get groups for user {}", userId);
        ControllerHelper.getUser(em, userId);
        List<Group> groupList = em.createQuery("from Group g where g.owner.id=:userId")
                .setParameter("userId", userId).getResultList();
        return new ResponseEntity<>(groupList, HttpStatus.OK);
    }

    private boolean isGroupDuplicated(Group group, String userId) {
        List<Group> groupList = em.createQuery("from Group g where g.id!=:id and g.label=:label and g.owner.id=:userId")
                .setParameter("id", group.getId())
                .setParameter("label", group.getLabel())
                .setParameter("userId", userId).getResultList();
        return !groupList.isEmpty();
    }

    private static boolean isGroupValid(Group group) {
        if (group.getLabel() == null || group.getLabel().isEmpty()) {
            return false;
        }
        return true;
    }
}
