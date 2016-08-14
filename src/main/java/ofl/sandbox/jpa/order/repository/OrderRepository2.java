package ofl.sandbox.jpa.order.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.stereotype.Repository;

import ofl.sandbox.jpa.order.model.Order;

public interface OrderRepository2 extends JpaRepository<Order, Long>{
	
	/*
	 * if "No property findRevisions found for type x" thrown - ensure @Configuration class is added to the ContextConfiguration with
	 * @EnableJpaRepositories(repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class) // enable Spring-Data-Envers
	 * in the header
	 */
	
}