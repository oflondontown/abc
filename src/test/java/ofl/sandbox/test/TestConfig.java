package ofl.sandbox.test;

import javax.sql.DataSource;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ActiveProfiles;

import ofl.sandbox.db.csv.CsvDatabaseSource;

@Configuration
@SpringBootApplication
@ComponentScan("ofl.sandbox")
@ActiveProfiles("TEST")
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
}
