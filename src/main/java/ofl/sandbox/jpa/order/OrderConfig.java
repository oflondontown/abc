package ofl.sandbox.jpa.order;

import java.sql.SQLException;
import java.util.Collections;
import java.util.Map;

import javax.sql.DataSource;

import org.hibernate.envers.strategy.ValidityAuditStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.envers.repository.support.EnversRevisionRepositoryFactoryBean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.AbstractEntityManagerFactoryBean;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Spring JavaConfig configuration for general infrastructure.
 * 
 * @author oflondontown
 *
 */
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class) // enable Spring-Data-Envers
@EnableJpaAuditing 
public class OrderConfig {

	@Autowired
	DataSource dataSource;
	
	@Bean
	public PlatformTransactionManager transactionManager() throws SQLException {
		return new JpaTransactionManager();
	}
	


	@Bean
	public AbstractEntityManagerFactoryBean entityManagerFactory() throws SQLException {

		HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
		jpaVendorAdapter.setDatabase(Database.H2);
		jpaVendorAdapter.setGenerateDdl(true);

		LocalContainerEntityManagerFactoryBean bean = new LocalContainerEntityManagerFactoryBean();
		bean.setJpaVendorAdapter(jpaVendorAdapter);
		bean.setPackagesToScan(OrderConfig.class.getPackage().getName());
		bean.setDataSource(dataSource);
		bean.setJpaPropertyMap(jpaProperties());

		return bean;
	}

	private Map<String, String> jpaProperties() {
		return Collections.singletonMap("org.hibernate.envers.audit_strategy", ValidityAuditStrategy.class.getName());
	}
}
