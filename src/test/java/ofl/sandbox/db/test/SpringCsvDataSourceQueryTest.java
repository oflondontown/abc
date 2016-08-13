package ofl.sandbox.db.test;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import ofl.sandbox.db.DatabaseManager;
import ofl.sandbox.test.TestConfig;

/***
 * Test class to verify CSV DataSource configuration works using Spring Framework autowiring
 * @author oflondontown
 *
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = TestConfig.class)

public class SpringCsvDataSourceQueryTest {

	@Autowired
	protected DatabaseManager databaseManager;
	protected JdbcTemplate template;

	@Test
	public void validateCsvDatabase() {	
		
		try {
			Integer numUsers = databaseManager.selectCountStarFrom("Users");
			
			Assert.assertNotNull(numUsers);
			
			Assert.assertTrue(numUsers > 0);
			
			System.out.println("COMPLETED. Got " + numUsers + " Users.");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Assert.fail();
		}
	}
}
