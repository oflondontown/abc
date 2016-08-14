package ofl.sandbox.test.jpa.order;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import ofl.sandbox.jpa.order.model.Order;
import ofl.sandbox.jpa.order.repository.DisplayedOrderRepository;
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

        try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        
		Order updatedOrder2 = orderRepository.save(updatedOrder);

       logger.info("Original : {}", order.toString());
       logger.info("Update1  : {}", updatedOrder.toString());
       logger.info("Update2  : {}", updatedOrder2.toString());
	}
}
