package ofl.sandbox.test.jpa.order;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.envers.repository.support.EnversRevisionRepositoryFactoryBean;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@ComponentScan("ofl.sandbox.jpa.order")
//@ActiveProfiles("TEST")
@PropertySource("classpath:application.properties")
@EnableTransactionManagement
@EnableJpaRepositories(repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class) // enable Spring-Data-Envers
@EnableJpaAuditing 
public class JpaOrderConfig {
	
    @Bean
    public DataSource dataSource() {
        EmbeddedDatabaseBuilder builder = 
                new EmbeddedDatabaseBuilder();
        return builder.setType(EmbeddedDatabaseType.H2).build();
    }
    


    @Bean
    public AuditingEntityListener createAuditingListener() {
        return new AuditingEntityListener();
    }

}
