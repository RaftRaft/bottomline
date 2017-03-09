package bottomline.model;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by raft on 09.03.2017.
 */
@Entity
@Table(name = "groups", uniqueConstraints = @UniqueConstraint(columnNames = {"owner", "label"}))
@XmlRootElement
public class Group implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    public int id;

    @Column(name = "label", nullable = false)
    @Length(max = 100)
    private String label;

    @Column(name = "description")
    @Length(max = 512)
    private String desc;

    @Column(name = "owner", nullable = false)
    private String owner;


    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "groups_services", joinColumns = {
            @JoinColumn(name = "groupId", nullable = false, updatable = false)},
            inverseJoinColumns = {@JoinColumn(name = "serviceId",
                    nullable = false, updatable = false)})
    public Set<Service> serviceList = new HashSet<>();

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

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Set<Service> getServiceList() {
        return serviceList;
    }

    public void setServiceList(Set<Service> serviceList) {
        this.serviceList = serviceList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Group group = (Group) o;

        if (label != null ? !label.equals(group.label) : group.label != null) return false;
        return owner != null ? owner.equals(group.owner) : group.owner == null;
    }

    @Override
    public int hashCode() {
        int result = label != null ? label.hashCode() : 0;
        result = 31 * result + (owner != null ? owner.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Group{" +
                "label='" + label + '\'' +
                ", desc='" + desc + '\'' +
                ", owner=" + owner +
                '}';
    }
}
