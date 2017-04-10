package bottomline.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by raft on 09.03.2017.
 */
@Entity
@Table(name = "invitation", uniqueConstraints = @UniqueConstraint(columnNames = {"id", "email", "group_id", "from_user_id"}))
@XmlRootElement
public class Invitation {

    @Id
    @Column(name = "id")
    public String id;

    @Column(name = "email", nullable = false)
    private String email;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @OneToOne
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @Column(name = "accepted", nullable = false)
    private boolean accepted;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = (email != null) ? email.trim() : email;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getFromUser() {
        return fromUser;
    }

    public void setFromUser(User fromUser) {
        this.fromUser = fromUser;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Invitation that = (Invitation) o;

        if (accepted != that.accepted) return false;
        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (email != null ? !email.equals(that.email) : that.email != null) return false;
        if (group != null ? !group.equals(that.group) : that.group != null) return false;
        return fromUser != null ? fromUser.equals(that.fromUser) : that.fromUser == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (group != null ? group.hashCode() : 0);
        result = 31 * result + (fromUser != null ? fromUser.hashCode() : 0);
        result = 31 * result + (accepted ? 1 : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Invitation{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", group=" + group +
                ", fromUser=" + fromUser +
                ", accepted=" + accepted +
                '}';
    }
}
