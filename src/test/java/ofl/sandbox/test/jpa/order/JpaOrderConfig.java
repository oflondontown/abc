package ofl.sandbox.test.jpa.order;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

@Configuration
@ComponentScan("ofl.sandbox.jpa.order")
//@ActiveProfiles("TEST")
@PropertySource("classpath:application.properties")
@EnableJpaRepositories(basePackages = "ofl.sandbox.jpa.order.repository")
public class JpaOrderConfig {
	
    @Bean
    public DataSource dataSource() {
        EmbeddedDatabaseBuilder builder = 
                new EmbeddedDatabaseBuilder();
        return builder.setType(EmbeddedDatabaseType.H2).build();
    }
}
