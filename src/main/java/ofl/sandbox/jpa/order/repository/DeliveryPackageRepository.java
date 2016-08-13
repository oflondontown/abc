package ofl.sandbox.jpa.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ofl.sandbox.jpa.order.model.DeliveryPackage;

@Repository
public interface DeliveryPackageRepository extends JpaRepository<DeliveryPackage, Integer>{
}