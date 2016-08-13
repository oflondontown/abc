package ofl.sandbox.jpa.order.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

@Entity
public class Client {

	@Id
	protected int clientId;
	
	protected String shortName;
	protected String longName;
	
	@ManyToMany
	protected List<DeliveryChannel> deliveryChannels;
	
	public Client(String shortName, String longName) {
		this.shortName 	= shortName;
		this.longName 	= longName;
	}
}
