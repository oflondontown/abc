package ofl.sandbox.test.jpa.order;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
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

    
    @Test
    public void validateLinkage() throws Exception {
    	int orderId = 1;
    	String description = "Single Order Item";
    	Order order = new Order(orderId, description);
    	
    	String displaySummary1 = "THIS IS THE DISPLAY SUMMARY 1";
    	String displaySummary2 = "THIS IS THE DISPLAY SUMMARY 2";
    	
    	DisplayedOrder displayedOrder1 = new DisplayedOrder("A",orderId);
    	DisplayedOrder displayedOrder2 = new DisplayedOrder("B",orderId);
    	DisplayedOrder displayedOrder3 = new DisplayedOrder("C",orderId);
    	DisplayedOrder displayedOrder4 = new DisplayedOrder("D",orderId);
    	
    	Assert.assertNotNull(orderRepository);
    	Assert.assertNotNull(displayedOrderRepository);
    	
    	orderRepository.deleteAll();
    	displayedOrderRepository.deleteAll();
    	Assert.assertTrue(orderRepository.count() == 0);
    	Assert.assertTrue(displayedOrderRepository.count() == 0);
    	
    	orderRepository.save(order);

    	Assert.assertTrue(orderRepository.count() == 1);
    	
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
    	logger.info("OrderList Size = {}", orderList.size());
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
        
    }
}
