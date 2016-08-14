package ofl.sandbox.jpa.order.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.envers.AuditTable;
import org.hibernate.envers.Audited;

@Entity
@Audited
@AuditTable("SingleOrderAudit")
@Table(name ="SingleOrder")
public class Order extends BaseEntity {

	@Id
	protected long orderId;
	
	protected String description;
    
	
	public Order() {
	} // default constructor for jpa
	

	public Order(long orderId, String description) {
		this.orderId = orderId;
		this.description = description;
		version = 1;
	}

	public String getDescription() {
		return description;
	}

	public long getOrderId() {
		return orderId;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}

	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		
		sb.append("[").append(orderId).append("] '")
			.append(description).append("'. ")
			.append(super.toString());
		
		return sb.toString();
	}
}
