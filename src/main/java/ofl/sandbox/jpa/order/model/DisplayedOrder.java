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

	protected final long sourceOrderId;
	
	@ManyToOne(optional = true)
//	@JoinColumn(name = "orderId", nullable=true, insertable=true, updatable=true)
	protected Order order;
	

	public DisplayedOrder() {
		sourceOrderId = 0;
	} // default constructor for jpa
	
	public DisplayedOrder(String displayedOrderId, long sourceOrderId) {
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
	
	public long getSourceOrderId() {
		return sourceOrderId;
	}
	
	public Order getOrder() {
		return order;
	}
	
	public String getDisplayedOrderId() {
		return displayedOrderId;
	}
}
