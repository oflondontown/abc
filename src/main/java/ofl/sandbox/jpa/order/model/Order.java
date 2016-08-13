package ofl.sandbox.jpa.order.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

@Entity
@Table(name ="SingleOrder")
public class Order {

	@Id
	protected int orderId;

	protected String description;
    
	@Column(name = "created", nullable = false)
    private Date created;
    
	@Column(name = "lastUpdated", nullable = false)
	private Date lastUpdated;
    
	public Order() {
	} // default constructor for jpa

	public Order(int orderId, String description) {
		this.orderId = orderId;
		this.description = description;
	}

	public String getDescription() {
		return description;
	}

	public int getOrderId() {
		return orderId;
	}
	
    @PreUpdate
    public void preUpdate() {
    	lastUpdated = new Date();
    }
	
    @PrePersist
    public void prePersist() {
        Date now = new Date();
        created = now;
        lastUpdated = now;
    }

}
