package bottomline.controller;

import bottomline.App;
import bottomline.common.ControllerHelper;
import bottomline.exceptions.WebApplicationException;
import bottomline.model.Group;
import bottomline.model.Invitation;
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
@RequestMapping("/group")
@Transactional
public class GroupController {

    private static final Logger LOG = LoggerFactory.getLogger(GroupController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Group> addGroup(@RequestHeader(App.USER_HEADER) String userId, @RequestBody Group group) {
        LOG.info("Received request to add item {} for owner with id {}", group, userId);

        if (!isGroupValid(group)) {
            throw new WebApplicationException("Group not valid", HttpStatus.BAD_REQUEST);
        }

        User user = ControllerHelper.processUser(em, userId);

        if (getSimilarGroup(user, group) != null) {
            throw new WebApplicationException("Group already exists", HttpStatus.BAD_REQUEST);
        }

        group.setOwner(user);
        group.getMemberList().add(user);

        em.persist(group);
        em.flush();
        return new ResponseEntity<>(group, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.TEXT_PLAIN_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateGroup(@RequestHeader(App.USER_HEADER) String userId, @RequestBody Group group) {
        LOG.info("Received request to update item  {}", group);

        User user = ControllerHelper.processUser(em, userId);

        if (!isGroupValid(group)) {
            throw new WebApplicationException("Group not valid", HttpStatus.BAD_REQUEST);
        }
        if (getSimilarGroup(user, group) != null) {
            throw new WebApplicationException("Group already exists", HttpStatus.BAD_REQUEST);
        }

        Group groupOld = em.find(Group.class, group.getId());
        if (groupOld == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        if (!user.getId().equals(groupOld.getOwner().getId())) {
            throw new WebApplicationException("Only the owner can update this group", HttpStatus.BAD_REQUEST);
        }

        groupOld.setLabel(group.getLabel());
        groupOld.setDesc(group.getDesc());

        em.merge(groupOld);
        return new ResponseEntity<>("Group updated", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Set<Group>> getGroups(@RequestHeader(App.USER_HEADER) String userId) {
        LOG.info("Received request to get groups for user {}", userId);
        User user = ControllerHelper.processUser(em, userId);
        System.out.println(user);
        System.out.println(user.getGroupList());
        return new ResponseEntity<>(user.getGroupList(), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "{groupId}/member/{memberId}")
    public ResponseEntity<String> removeMemberFromGroup(@RequestHeader(App.USER_HEADER) String userId,
                                                        @PathVariable("groupId") Integer groupId,
                                                        @PathVariable("memberId") String memberId) {
        LOG.info("Received request to remove member {} from  group {}", memberId, groupId);

        User user = ControllerHelper.processUser(em, userId);

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        User member = em.find(User.class, memberId);
        if (member == null) {
            throw new WebApplicationException("Member does not exist", HttpStatus.BAD_REQUEST);
        }

        if (!user.getId().equals(group.getOwner().getId())) {
            throw new WebApplicationException("Only the owner can remove members from this group", HttpStatus.BAD_REQUEST);
        }

        if (user.getId().equals(memberId)) {
            throw new WebApplicationException("Owner cannot remove himself from group", HttpStatus.BAD_REQUEST);
        }

        group.getMemberList().remove(member);

        em.merge(group);
        return new ResponseEntity<>("Member removed from group", HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "{groupId}")
    public ResponseEntity<String> removeGroup(@RequestHeader(App.USER_HEADER) String userId, @PathVariable("groupId") Integer groupId) {
        LOG.info("Received request to remove group with id", groupId);

        User user = ControllerHelper.processUser(em, userId);

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        if (!user.getId().equals(group.getOwner().getId())) {
            throw new WebApplicationException("Only the owner can remove this group", HttpStatus.BAD_REQUEST);
        }

        group.getServiceList().clear();
        group.getMemberList().clear();
        List<Invitation> invitationList = em.createQuery("from Invitation i where i.group.id=:groupId")
                .setParameter("groupId", groupId)
                .getResultList();
        for (Invitation invitation : invitationList) {
            em.remove(invitation);
        }

        removeServiceUsageFromGroup(group);

        em.remove(group);
        return new ResponseEntity<>("Group removed", HttpStatus.OK);
    }

    private Group getSimilarGroup(User user, Group group) {
        List<Group> groupList = em.createQuery("from Group g where g.owner.id=:userId and g.label=:label")
                .setParameter("userId", user.getId()).setParameter("label", group.getLabel()).getResultList();
        for (Group el : groupList) {
            if (el.getId() != group.getId() && el.getLabel().toLowerCase().equals(el.getLabel().toLowerCase())) {
                return el;
            }
        }
        return null;
    }

    private void removeServiceUsageFromGroup(Group group) {
        em.createQuery("delete from ServiceUsage su where su.group.id=:groupId")
                .setParameter("groupId", group.getId())
                .executeUpdate();
    }

    private static boolean isGroupValid(Group group) {
        if (group.getLabel() == null || group.getLabel().isEmpty()) {
            return false;
        }
        return true;
    }
}
