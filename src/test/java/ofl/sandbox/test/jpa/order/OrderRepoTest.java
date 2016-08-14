package ofl.sandbox.test.jpa.order;

import static org.junit.Assert.assertEquals;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hamcrest.Matchers;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.history.Revision;
import org.springframework.data.history.Revisions;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import ofl.sandbox.jpa.order.model.DisplayedOrder;
import ofl.sandbox.jpa.order.model.Order;
import ofl.sandbox.jpa.order.repository.DisplayedOrderRepository;
import ofl.sandbox.jpa.order.repository.OrderRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = JpaOrderConfig.class)
public class OrderRepoTest {
	public static Logger logger = LogManager.getLogger(OrderRepoTest.class);

    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private DisplayedOrderRepository displayedOrderRepository;

    @Before
    public void clear() {
    	// need to delete DisplayedOrders before Orders due to dependencies
    	//  TODO: figure out how to configure this not to be a constraint
		displayedOrderRepository.deleteAll();
    	orderRepository.deleteAll();
    }
    
    @Test
    public void validateLinkage() throws Exception {
    	Assert.assertNotNull(orderRepository);
    	Assert.assertNotNull(displayedOrderRepository);
    	
    	Assert.assertTrue(orderRepository.count() == 0);
    	Assert.assertTrue(displayedOrderRepository.count() == 0);
   
    	long orderId = 1;
    	String description = "Single Order Item";
    	Order order = new Order(orderId, description);
 	
    	orderRepository.save(order);

    	Assert.assertTrue(orderRepository.count() == 1);
    	
   	
    	DisplayedOrder displayedOrder1 = new DisplayedOrder("A",orderId);
    	DisplayedOrder displayedOrder2 = new DisplayedOrder("B",orderId);
    	DisplayedOrder displayedOrder3 = new DisplayedOrder("C",orderId);
    	DisplayedOrder displayedOrder4 = new DisplayedOrder("D",orderId);
    	
    	String displaySummary1 = "THIS IS THE DISPLAY SUMMARY 1";
    	String displaySummary2 = "THIS IS THE DISPLAY SUMMARY 2";
    	
    	displayedOrder1.setDisplaySummary(displaySummary1);
    	displayedOrder2.setDisplaySummary(displaySummary2);
    	displayedOrder3.setDisplaySummary(displaySummary1);
    	displayedOrder4.setDisplaySummary(displaySummary2);
    	

    	Set<String> displayedOrderIdList1 = new HashSet<String>();
    	displayedOrderIdList1.add("A");
    	displayedOrderIdList1.add("C");
    	

    	Set<String> displayedOrderIdList2 = new HashSet<String>();
    	displayedOrderIdList2.add("B");
    	displayedOrderIdList2.add("D");
    	
    	
    	HashSet<DisplayedOrder> orderList = new HashSet<DisplayedOrder>();
    	orderList.add(displayedOrder1);
    	orderList.add(displayedOrder2);
    	orderList.add(displayedOrder3);
    	orderList.add(displayedOrder4);
    	
    	
    	displayedOrderRepository.save(orderList);
    	logger.info("DisplayedOrderRepository Size = {}", displayedOrderRepository.count());
    	logger.info("DisplayedOrderList Size = {}", orderList.size());
    	Assert.assertEquals(orderList.size(),displayedOrderRepository.count());
    	

    	List<DisplayedOrder> displayedOrderList1 = displayedOrderRepository.findByDisplaySummary(displaySummary1);
    	Assert.assertNotNull(displayedOrderList1);
    	Assert.assertEquals(2, displayedOrderList1.size());

    	
    	for(DisplayedOrder displayedOrder : displayedOrderList1) {
    		Assert.assertNotNull(displayedOrder);
    		Assert.assertEquals(displaySummary1, displayedOrder.getDisplaySummary());
    		Assert.assertTrue(displayedOrderIdList1.contains(displayedOrder.getDisplayedOrderId()));
    	}
    	
    	
    	List<DisplayedOrder> displayedOrderList2 = displayedOrderRepository.findByDisplaySummary(displaySummary2);
    	Assert.assertNotNull(displayedOrderList2);
    	Assert.assertEquals(2, displayedOrderList2.size());
    	

    	for(DisplayedOrder displayedOrder : displayedOrderList2) {
    		Assert.assertNotNull(displayedOrder);
    		Assert.assertEquals(displaySummary2, displayedOrder.getDisplaySummary());
    		Assert.assertTrue(displayedOrderIdList2.contains(displayedOrder.getDisplayedOrderId()));
    	}
    	
    	long currentSize = displayedOrderRepository.count();
    	
        // fetch all orders
    	orderList.clear();
        for (DisplayedOrder displayedOrder : displayedOrderRepository.findAllByOrderByDisplayedOrderIdAsc()) {
        	
        	Order sourceOrder = orderRepository.findOne(displayedOrder.getSourceOrderId());
            logger.info("[{}] Got Displayed Order ::: SourceOrder={}, Description={}", displayedOrder.getDisplayedOrderId(),  displayedOrder.getSourceOrderId(), sourceOrder.getDescription());
            

        	Assert.assertEquals(order.getOrderId(), displayedOrder.getSourceOrderId());
        	Assert.assertEquals(order.getOrderId(), sourceOrder.getOrderId());
        	Assert.assertEquals(order.getDescription(), sourceOrder.getDescription());
        	

        	displayedOrder.setOrder(sourceOrder);
        	Assert.assertNotNull(displayedOrder.getOrder());
        	
        	orderList.add(displayedOrder);
        	
        }
    	displayedOrderRepository.save(orderList);
    	
    	Assert.assertEquals(currentSize, displayedOrderRepository.count());
        
    	
    	Assert.assertEquals(orderList.size(), displayedOrderRepository.count());
        
    	logger.info("SIZE ::: {}",  displayedOrderRepository.findAllByOrderByDisplayedOrderIdAsc().size());
        // fetch all categories
        for (DisplayedOrder displayedOrder : displayedOrderRepository.findAllByOrderByDisplayedOrderIdAsc()) {
        	
            logger.info("[{}] Updated Displayed Order ::: SourceOrder={}", displayedOrder.getDisplayedOrderId(),  displayedOrder.getSourceOrderId());

        	Assert.assertNotNull(displayedOrder.getOrder());
        }
        
        
        
        order.setDescription("UPDATED DESCRIPTION");
        orderRepository.save(order);
        
       
    }
    
    
	@Test
	public void returnsParticularRevisionForAnEntity() {
		long orderId = 2;
    	String description1 = "Single Order Item";
    	Order order = new Order(orderId, description1);
 	
    	orderRepository.save(order);
    	
    	String description2 = "Single Order Item Updated";

    	order.setDescription(description2);
		
		orderRepository.save(order);

		Revisions<Integer, Order> revisions = orderRepository.findRevisions(orderId);


		Iterator<Revision<Integer, Order>> iterator = revisions.iterator();
		Revision<Integer, Order> first = iterator.next();
		Revision<Integer, Order> second = iterator.next();

		Assert.assertEquals(orderRepository.findRevision(orderId, first.getRevisionNumber()).getEntity().getDescription(), description1);
		Assert.assertEquals(orderRepository.findRevision(orderId, second.getRevisionNumber()).getEntity().getDescription(), description2);
	}
	
	

	@Test
	public void returnsLastRevisionForAnEntity() {
		long orderId = 3;
    	String description1 = "Single Order Item";
    	Order order = new Order(orderId, description1);
 	
    	orderRepository.save(order);
    	
    	String description2 = "Single Order Item Updated";

    	order = orderRepository.findOne(orderId);
    	
    	order.setDescription(description2);
		
		orderRepository.save(order);

		Revision<Integer, Order> revision = orderRepository.findLastChangeRevision(orderId);
		Assert.assertNotNull(revision);
		
		
		Order lastOrder = revision.getEntity();

		logger.info("Revised Description = {}. Version={}. Created={}. LastUpdated={}", lastOrder.getDescription(), 
				lastOrder.getVersion(), lastOrder.getCreated(), lastOrder.getLastUpdated());

		Revisions<Integer, Order> revisions = orderRepository.findRevisions(orderId);
//		Revisions<Integer, Order> wrapper = new Revisions<Integer, Order>(revisions.getContent());
		
		int count = 0;
		Iterator<Revision<Integer, Order>> iter = revisions.iterator();
		while(iter.hasNext()) {
			count++;
			iter.next();
		}
		
		Order latestOrder = revisions.getLatestRevision().getEntity();
		
		logger.info("Latest Revised Description = {}. Size={}. Version={}. Created={}. LastUpdated={}", latestOrder.getDescription(), 
				count, latestOrder.getVersion(), latestOrder.getCreated(), latestOrder.getLastUpdated());
		
		// doesn't work!!!
		Assert.assertEquals(revision, revisions.getLatestRevision());
       
	}
}
