package bottomline.controller;

import bottomline.App;
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
import java.util.UUID;

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

    @RequestMapping(method = RequestMethod.POST, path = "send/group/{groupId}", consumes = MediaType.APPLICATION_JSON_VALUE)
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

        invitation.setId(UUID.randomUUID().toString());
        invitation.setGroup(group);
        invitation.setFromUser(user);
        invitation.setAccepted(false);

        MailSenderBuilder builder = new MailSenderBuilder();
        builder.recipient(invitation.getEmail());
        builder.from(user.getEmail()).subject("User " + user.getName() + " invited you to group " + group.getLabel());

        String invitationUrl = App.INVITATION_BASE_URL + invitation.getId();

        if (builder.build().send("Click the following link in order to accept the invitation: \n" + invitationUrl)) {
            em.merge(invitation);
            em.flush();
            return new ResponseEntity<>(invitation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Cannot send invitation", HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(method = RequestMethod.POST, path = "{invitationId}")
    public ResponseEntity<?> acceptInvitation(@RequestHeader(AuthFilter.USER_HEADER) String userId,
                                              @PathVariable("invitationId") String invitationId) {

        LOG.info("Received request to accept invitation with id {}", invitationId);

        User user = ControllerHelper.processUser(em, userId);

        Invitation invitation = em.find(Invitation.class, invitationId);
        if (invitation == null) {
            throw new WebApplicationException("Invitation does not exist", HttpStatus.BAD_REQUEST);
        }

        if (!user.getEmail().equals(invitation.getEmail())) {
            throw new WebApplicationException("Invitation is for other email address", HttpStatus.BAD_REQUEST);
        }

        if (invitation.isAccepted()) {
            throw new WebApplicationException("Invitation is already accepted", HttpStatus.BAD_REQUEST);
        }

        Group group = invitation.getGroup();
        group.getMemberList().add(user);
        invitation.setAccepted(true);
        em.merge(invitation);

        return new ResponseEntity<>("Invitation accepted", HttpStatus.OK);
    }

    private static boolean isInvitationValid(Invitation invitation) {
        if (invitation.getEmail() == null || invitation.getEmail().isEmpty()) {
            return false;
        }
        return true;
    }
}