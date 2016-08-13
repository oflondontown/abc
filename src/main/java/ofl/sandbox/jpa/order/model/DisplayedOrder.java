package ofl.sandbox.jpa.order.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class DisplayedOrder {

	@Id
	protected String displayedOrderId;
	
	protected String displaySummary;

	protected final int sourceOrderId;
	
	@ManyToOne
	@JoinColumn(name = "orderId")
	protected Order order;
	

	public DisplayedOrder() {
		sourceOrderId = 0;
	} // default constructor for jpa
	
	public DisplayedOrder(String displayedOrderId, int sourceOrderId) {
		this.displayedOrderId = displayedOrderId;
		this.sourceOrderId = sourceOrderId;
	}
	
	public void setDisplaySummary(String displaySummary) {
		this.displaySummary = displaySummary;
	}
	
	public String getDisplaySummary() {
		return this.displaySummary;
	}
	
	public void setOrder(Order order) {
		this.order = order;
	}
	
	public int getSourceOrderId() {
		return sourceOrderId;
	}
	
	public Order getOrder() {
		return order;
	}
	
	public String getDisplayedOrderId() {
		return displayedOrderId;
	}
}
