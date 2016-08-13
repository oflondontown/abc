package ofl.sandbox.jpa.order.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class DeliveryPackage {

	@Id
	protected int packageId;
	
	protected List<Client> clients;
	
	protected List<DisplayedOrder> displayedOrders;
	
	public DeliveryPackage() {
	}
}
