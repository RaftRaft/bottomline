package bottomline.common;

import bottomline.exceptions.WebApplicationException;
import bottomline.model.User;
import org.springframework.http.HttpStatus;

import javax.persistence.EntityManager;

/**
 * Created by raft on 24.03.2017.
 */
public class ControllerHelper {

    public static User processUser(EntityManager em, String userId) {
        User user = em.find(User.class, userId);
        if (user != null) {
            return user;
        }
        throw new WebApplicationException("User does not exist", HttpStatus.BAD_REQUEST);
    }
}
