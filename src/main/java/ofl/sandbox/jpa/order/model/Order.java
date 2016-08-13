package ofl.sandbox.jpa.order.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name ="SingleOrder")
public class Order {

	@Id
	protected int orderId;

	protected String description;

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

}
