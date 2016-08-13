package ofl.sandbox.db;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

@Component("DatabaseManager")
public class DatabaseManager implements DatabaseConstants {

//	@Autowired
	protected JdbcTemplate jdbcTemplate;
	
	@Autowired
	protected DataSource dataSource;
	
	@PostConstruct
	protected void postConstruct() {
		jdbcTemplate = new JdbcTemplate(dataSource);
	}
	
	public DataSource getDataSource() {
		return dataSource;
	}
	
	public List<?> query(String sql, RowMapper<?> rowMapper) {
		return jdbcTemplate.query(sql, rowMapper);
	}
	
	public List<?> selectStarFrom(String sql, RowMapper<?> rowMapper) {
		return jdbcTemplate.query(SELECT_STAR_FROM + sql, rowMapper);
	}
	
	public Integer selectCountStarFrom(String sql) {
		return jdbcTemplate.queryForObject(SELECT_COUNT_STAR_FROM + sql, Integer.class);
	}
	
	public void execute(String sql) {
		jdbcTemplate.execute(sql);
	}
	
	public void executeStandardProcedure(String storedProcName) {
		jdbcTemplate.execute("EXEC " + storedProcName);
	}
}
