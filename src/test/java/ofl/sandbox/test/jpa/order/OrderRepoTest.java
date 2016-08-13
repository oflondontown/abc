package ofl.sandbox.test.jpa.order;

import java.util.HashSet;

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
    	
    	DisplayedOrder displayedOrder1 = new DisplayedOrder("A",orderId);
    	DisplayedOrder displayedOrder2 = new DisplayedOrder("B",orderId);
    	
    	Assert.assertNotNull(orderRepository);
    	Assert.assertNotNull(displayedOrderRepository);
    	
    	orderRepository.deleteAll();
    	displayedOrderRepository.deleteAll();
    	Assert.assertTrue(orderRepository.count() == 0);
    	Assert.assertTrue(displayedOrderRepository.count() == 0);
    	
    	orderRepository.save(order);

    	Assert.assertTrue(orderRepository.count() == 1);
    	
    	HashSet<DisplayedOrder> orderList = new HashSet<DisplayedOrder>();
    	orderList.add(displayedOrder1);
    	orderList.add(displayedOrder2);
    	
    	
    	displayedOrderRepository.save(orderList);
    	

    	Assert.assertTrue(displayedOrderRepository.count() == 2);
    	
        // fetch all orders
    	orderList.clear();
        for (DisplayedOrder displayedOrder : displayedOrderRepository.findAll()) {
        	
        	Order sourceOrder = orderRepository.findOne(displayedOrder.getSourceOrderId());
            logger.info("[{}] DISPLAY Order ::: SourceOrder={}, Ric={}", displayedOrder.getDisplayedOrderId(),  displayedOrder.getSourceOrderId(), sourceOrder.getDescription());
            

        	Assert.assertEquals(order.getOrderId(), displayedOrder.getSourceOrderId());
        	Assert.assertEquals(order.getOrderId(), sourceOrder.getOrderId());
        	Assert.assertEquals(order.getDescription(), sourceOrder.getDescription());
        	

        	displayedOrder.setOrder(sourceOrder);
        	Assert.assertNotNull(displayedOrder.getOrder());
        	
        	orderList.add(displayedOrder);
        	
        }
    	displayedOrderRepository.save(orderList);
    	
    	Assert.assertTrue(displayedOrderRepository.count() == 2);
        
        // fetch all categories
        for (DisplayedOrder displayedOrder : displayedOrderRepository.findAll()) {
        	
            logger.error("[{}] DISPLAY Order ::: SourceOrder={}", displayedOrder.getDisplayedOrderId(),  displayedOrder.getSourceOrderId());

        	Assert.assertNotNull(displayedOrder.getOrder());
        }
        
    }
}
