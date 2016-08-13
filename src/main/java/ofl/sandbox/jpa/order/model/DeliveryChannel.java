package ofl.sandbox.jpa.order.model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class DeliveryChannel {

	@Id
	protected String channelId;
	
	protected String channelName;
	
	public DeliveryChannel(String channelName) {
		this.channelName = channelName;
	}
	
}
