package bottomline.common;

import bottomline.exceptions.WebApplicationException;
import bottomline.model.User;
import org.springframework.http.HttpStatus;

import javax.persistence.EntityManager;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Created by raft on 24.03.2017.
 */
public class ControllerHelper {

    public static User getUser(EntityManager em, String userId) {
        User user = em.find(User.class, userId);
        if (user != null) {
            return user;
        }
        throw new WebApplicationException("User does not exist", HttpStatus.BAD_REQUEST);
    }
}
