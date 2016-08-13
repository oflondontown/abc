package ofl.sandbox.jpa.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ofl.sandbox.jpa.order.model.DisplayedOrder;

@Repository
public interface DisplayedOrderRepository extends JpaRepository<DisplayedOrder, Integer>{
	
}