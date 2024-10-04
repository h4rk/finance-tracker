package h4rk.finance.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MovsRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<String> getAllTables(){
		return jdbcTemplate.queryForList("SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance-tracker';", String.class);
	}
	
}
