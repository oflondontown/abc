package ofl.sandbox.jpa.order;

import java.util.HashSet;

import javax.transaction.Transactional;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import ofl.sandbox.jpa.order.model.DisplayedOrder;
import ofl.sandbox.jpa.order.model.Order;
import ofl.sandbox.jpa.order.repository.DisplayedOrderRepository;
import ofl.sandbox.jpa.order.repository.OrderRepository;


@SpringBootApplication
public class OrderApp implements CommandLineRunner {
	public static Logger logger = LogManager.getLogger(OrderApp.class);

	/*
	 * if you see "Access to DialectResolutionInfo cannot be null when 'hibernate.dialect' "
	 *  it usually means there's another instance running / it could not start up the database
	 * 
	 */
	
	
    @Autowired
    private OrderRepository orderRepository;


    @Autowired
    private DisplayedOrderRepository displayedOrderRepository;
    
    public static void main(String[] args) {
        SpringApplication.run(OrderApp.class, args);
    }
    
    @Override
    @Transactional
    public void run(String... strings) throws Exception {
    	int orderId = 1;
    	String description = "Single Order Item";
    	Order Order = new Order(orderId, description);
    	
    	DisplayedOrder DisplayedOrder1 = new DisplayedOrder("A",orderId);
    	DisplayedOrder DisplayedOrder2 = new DisplayedOrder("B",orderId);
    	
    	orderRepository.save(Order);
    	
//    	DisplayedOrder1.setOrder(Order);
//    	DisplayedOrder2.setOrder(Order);
    	
    	displayedOrderRepository.save(new HashSet<DisplayedOrder>() {
			private static final long serialVersionUID = 1L;

		{
    		add(DisplayedOrder1);
    		add(DisplayedOrder2);
    	}});
    	
    	
        // fetch all categories
        for (DisplayedOrder DisplayedOrder : displayedOrderRepository.findAll()) {
        	
        	Order sourceOrder = orderRepository.findOne(DisplayedOrder.getSourceOrderId());
            logger.info("[{}] DISPLAY Order ::: SourceOrder={}, Ric={}", DisplayedOrder.getDisplayedOrderId(),  DisplayedOrder.getSourceOrderId(), sourceOrder.getDescription());
        }
        
        System.exit(0);
    }
}
