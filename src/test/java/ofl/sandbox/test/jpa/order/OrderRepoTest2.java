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
import ofl.sandbox.jpa.order.repository.OrderRepository2;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = JpaOrderConfig.class)
public class OrderRepoTest2 {
	public static Logger logger = LogManager.getLogger(OrderRepoTest2.class);

    @Autowired
    private OrderRepository2 orderRepository;


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
	public void returnsLastRevisionForAnEntity() {
		long orderId = 3;
    	String description1 = "Single Order Item";
    	Order order = new Order(orderId, description1);
 	
    	Order updatedOrder = orderRepository.save(order);
    	
    	String description2 = "Single Order Item Updated";

    	updatedOrder.setDescription(description2);
		
		Order updatedOrder2 = orderRepository.save(updatedOrder);

       logger.info("Original : {}", order.toString());
       logger.info("Update1  : {}", updatedOrder.toString());
       logger.info("Update2  : {}", updatedOrder2.toString());
	}
}
