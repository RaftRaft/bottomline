package bottomline.model;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by raft on 09.03.2017.
 */
@Entity
@Table(name = "measurement_items")
@XmlRootElement
public class MeasurementItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    public Integer id;

    @Column(name = "label", nullable = false)
    @Length(max = 100)
    private String label;

    @Column(name = "measurement_unit")
    @Length(max = 10)
    private String unitOfMeasurement;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

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

    public String getUnitOfMeasurement() {
        return unitOfMeasurement;
    }

    public void setUnitOfMeasurement(String unitOfMeasurement) {
        this.unitOfMeasurement = (unitOfMeasurement != null) ? unitOfMeasurement.trim() : unitOfMeasurement;
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

        MeasurementItem that = (MeasurementItem) o;

        if (label != null ? !label.equals(that.label) : that.label != null) return false;
        if (unitOfMeasurement != null ? !unitOfMeasurement.equals(that.unitOfMeasurement) : that.unitOfMeasurement != null)
            return false;
        return owner != null ? owner.equals(that.owner) : that.owner == null;
    }

    @Override
    public int hashCode() {
        int result = label != null ? label.hashCode() : 0;
        result = 31 * result + (unitOfMeasurement != null ? unitOfMeasurement.hashCode() : 0);
        result = 31 * result + (owner != null ? owner.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "MeasurementItem{" +
                "id=" + id +
                ", label='" + label + '\'' +
                ", unitOfMeasurement='" + unitOfMeasurement + '\'' +
                '}';
    }
}
