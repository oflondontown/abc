package ofl.sandbox.jpa.order.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

@Entity
public class DeliveryPackage {

	@Id
	protected int packageId;
	

	@ManyToMany
	protected List<Client> clients;
	


	@ManyToMany
	protected List<DisplayedOrder> displayedOrders;
	
	public DeliveryPackage() {
	}
}
