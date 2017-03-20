package bottomline.model;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by raft on 09.03.2017.
 */
@Entity
@Table(name = "services", uniqueConstraints = @UniqueConstraint(columnNames = {"owner_id", "label"}))
@XmlRootElement
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    public int id;

    @Column(name = "label", nullable = false)
    @Length(max = 100)
    private String label;

    @Column(name = "description", nullable = false)
    @Length(max = 512)
    private String desc;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Service service = (Service) o;

        if (label != null ? !label.equals(service.label) : service.label != null) return false;
        return owner != null ? owner.equals(service.owner) : service.owner == null;
    }

    @Override
    public int hashCode() {
        int result = label != null ? label.hashCode() : 0;
        result = 31 * result + (owner != null ? owner.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Service{" +
                "id=" + id +
                ", label='" + label + '\'' +
                ", desc='" + desc + '\'' +
                ", owner=" + owner +
                '}';
    }
}
