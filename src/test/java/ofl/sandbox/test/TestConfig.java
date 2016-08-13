package ofl.sandbox.test;

import javax.sql.DataSource;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import ofl.sandbox.db.csv.CsvDatabaseSource;

@Configuration
@SpringBootApplication
@ComponentScan("ofl.sandbox")
//@ActiveProfiles("TEST")
@PropertySource("classpath:application.properties")
public class TestConfig {
	
	public static String databaseDriver;
	
	
	/***
	 * Override default Database DataSource for Profile=TEST
	 * @return
	 */
    @Profile("TEST")
    public DataSource devDataSource() {
    	try {
    		CsvDatabaseSource csvDatabaseSource = new CsvDatabaseSource();
			DataSource dataSource = csvDatabaseSource.dataSource();
			
			databaseDriver = csvDatabaseSource.getDatabaseDriverClassName();
			return dataSource;
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return null;
    }
    
    @Bean
    public DataSource dataSource() {
        EmbeddedDatabaseBuilder builder = 
                new EmbeddedDatabaseBuilder();
        return builder.setType(EmbeddedDatabaseType.H2).build();
    }
}
