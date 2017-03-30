package bottomline.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by raft on 09.03.2017.
 */
@Entity
@Table(name = "service_usage", uniqueConstraints = @UniqueConstraint(columnNames = {"owner_id", "group_id", "service_id", "item_id", "date"}))
@XmlRootElement
public class ServiceUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    public Integer id;

    @Column(name = "date", nullable = false)
    protected Long date;

    @Column(name = "index_val", nullable = false)
    protected Double index;

    @Column(name = "consumption")
    protected Double consumption;

    @Column(name = "description")
    @Length(max = 512)
    private String desc;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "item_id", nullable = false)
    private MeasurementItem item;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    public Double getIndex() {
        return index;
    }

    public void setIndex(Double index) {
        this.index = index;
    }

    public Double getConsumption() {
        return consumption;
    }

    public void setConsumption(Double consumption) {
        this.consumption = consumption;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = (desc != null) ? desc.trim() : desc;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public MeasurementItem getItem() {
        return item;
    }

    public void setItem(MeasurementItem item) {
        this.item = item;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ServiceUsage that = (ServiceUsage) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (date != null ? !date.equals(that.date) : that.date != null) return false;
        if (group != null ? !group.equals(that.group) : that.group != null) return false;
        if (owner != null ? !owner.equals(that.owner) : that.owner != null) return false;
        if (service != null ? !service.equals(that.service) : that.service != null) return false;
        return item != null ? item.equals(that.item) : that.item == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (group != null ? group.hashCode() : 0);
        result = 31 * result + (owner != null ? owner.hashCode() : 0);
        result = 31 * result + (service != null ? service.hashCode() : 0);
        result = 31 * result + (item != null ? item.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "ServiceUsage{" +
                "id=" + id +
                ", date=" + date +
                ", index=" + index +
                ", consumption=" + consumption +
                ", desc='" + desc + '\'' +
                '}';
    }
}
