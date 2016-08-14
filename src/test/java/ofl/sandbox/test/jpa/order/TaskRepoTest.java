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
import ofl.sandbox.jpa.order.model.Task;
import ofl.sandbox.jpa.order.repository.DisplayedOrderRepository;
import ofl.sandbox.jpa.order.repository.OrderRepository;
import ofl.sandbox.jpa.order.repository.TaskRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = JpaOrderConfig.class)
public class TaskRepoTest {
	public static Logger logger = LogManager.getLogger(TaskRepoTest.class);

    @Autowired
    private TaskRepository taskRepository;

    @Before
    public void clear() {
		taskRepository.deleteAll();
    }
    
    @Test
    public void validateLinkage() throws Exception {
    	Assert.assertNotNull(taskRepository);
    	
    	 // Generate a new record.
        Task task = new Task();
        task.setTaskName("task1");
        Task savedTask = taskRepository.save(task);
        System.out.println(savedTask);

        Thread.sleep(1000);

        // Update the record after 1sec.
        savedTask.setTaskName("task2");
        Task savedTask2 = taskRepository.save(savedTask);
        System.out.println(savedTask2);
       
	}
}
