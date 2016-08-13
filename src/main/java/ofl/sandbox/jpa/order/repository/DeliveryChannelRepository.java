package ofl.sandbox.jpa.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ofl.sandbox.jpa.order.model.DeliveryChannel;

@Repository
public interface DeliveryChannelRepository extends JpaRepository<DeliveryChannel, Integer>{
}