package bottomline.controller;

import bottomline.common.ControllerHelper;
import bottomline.common.MailSenderBuilder;
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

/**
 * Created by raft on 09.03.2017.
 */

@RestController
@RequestMapping("/invitation")
@Transactional
public class InvitationController {

    private static final Logger LOG = LoggerFactory.getLogger(InvitationController.class);
    @PersistenceContext
    private EntityManager em;

    @RequestMapping(method = RequestMethod.POST, path = "send", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> sendInvitation(@RequestHeader(AuthFilter.USER_HEADER) String userId,
                                            @PathVariable("groupId") Integer groupId, @RequestBody Invitation invitation) {

        LOG.info("Received request to send invitation {}", invitation);

        User user = ControllerHelper.processUser(em, userId);

        if (!isInvitationValid(invitation)) {
            throw new WebApplicationException("Please fill all required fields", HttpStatus.BAD_REQUEST);
        }

        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new WebApplicationException("Group does not exist", HttpStatus.BAD_REQUEST);
        }

        invitation.setGroup(group);
        invitation.setFromUser(user);
        invitation.setAccepted(false);

        MailSenderBuilder builder = new MailSenderBuilder();
        builder.recipient(invitation.getEmail());
        builder.from(user.getEmail()).subject("User " + user.getName() + " invited you to group " + group.getLabel());

        if (builder.build().send("Invitation test")) {
            em.merge(invitation);
            em.flush();
            return new ResponseEntity<>(invitation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot send invitation", HttpStatus.BAD_REQUEST);
        }

    }

    private static boolean isInvitationValid(Invitation invitation) {
        if (invitation.getId() == null || invitation.getEmail() == null
                || invitation.getId().isEmpty() || invitation.getEmail().isEmpty()) {
            return false;
        }
        return true;
    }
}