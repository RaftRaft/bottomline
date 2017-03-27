package bottomline.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.HashSet;
import java.util.Set;

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
    public Integer id;

    @Column(name = "label", nullable = false)
    @Length(max = 100)
    private String label;

    @Column(name = "description")
    @Length(max = 512)
    private String desc;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    @ManyToMany(mappedBy = "serviceList")
    @JsonIgnore
    private Set<Group> groupList = new HashSet<>();

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    public Set<MeasurementItem> itemList = new HashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = (label != null) ? label.trim() : label;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = (desc != null) ? desc.trim() : desc;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Set<MeasurementItem> getItemList() {
        return itemList;
    }

    public void setItemList(Set<MeasurementItem> itemList) {
        this.itemList = itemList;
    }

    public Set<Group> getGroupList() {
        return groupList;
    }

    public void setGroupList(Set<Group> groupList) {
        this.groupList = groupList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Service service = (Service) o;

        if (id != null ? !id.equals(service.id) : service.id != null) return false;
        if (label != null ? !label.equals(service.label) : service.label != null) return false;
        return desc != null ? desc.equals(service.desc) : service.desc == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (label != null ? label.hashCode() : 0);
        result = 31 * result + (desc != null ? desc.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Service{" +
                "id=" + id +
                ", label='" + label + '\'' +
                ", desc='" + desc + '\'' +
                ", owner=" + owner +
                ", groupList=" + groupList +
                ", itemList=" + itemList +
                '}';
    }
}
