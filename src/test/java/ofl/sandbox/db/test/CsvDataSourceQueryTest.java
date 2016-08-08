package ofl.sandbox.db.test;

import java.io.IOException;

import javax.sql.DataSource;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import ofl.sandbox.db.DatabaseManager;

/***
 * Test class to verify CSV DataSource configuration works
 * @author oflondontown
 *
 */
public class CsvDataSourceQueryTest {

	protected DatabaseManager databaseManager;
	protected JdbcTemplate template;

	protected static final String CSV_DATA_DIR = "testdb";
	
	@Before
	public void initialise() {
		databaseManager = new DatabaseManager();
	}
	
	@Test
	public void validateCsvDatabase() {	
		
		try {
			DataSource dataSource = CsvDatabaseSource.getDataSource(CSV_DATA_DIR);
			Assert.assertNotNull(dataSource);
			
            ReflectionTestUtils.setField(databaseManager, "jdbcTemplate", new JdbcTemplate(dataSource), JdbcTemplate.class);
			
			
			Integer numUsers = databaseManager.selectCountStarFrom("Users");
			
			Assert.assertNotNull(numUsers);
			
			Assert.assertTrue(numUsers > 0);
			
		} catch (IOException e) {
			e.printStackTrace();
			Assert.fail();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Assert.fail();
		}
	}
}
