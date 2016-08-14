package ofl.sandbox.jpa.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ofl.sandbox.jpa.order.model.Task;


public interface TaskRepository extends JpaRepository<Task, Long> {
}