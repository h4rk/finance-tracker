package h4rk.finance.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import h4rk.finance.dto.Mov;

@Repository
public class MovsRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<String> getAllTables(){
		return jdbcTemplate.queryForList("SELECT table_name FROM information_schema.tables WHERE table_schema = 'finance-tracker';", String.class);
	}
	
	public int deleteMovs(long id) {
		return jdbcTemplate.update("DELETE FROM mov WHERE mov_id = ?", id);
	}

	public long postMovs(Mov mov) {

		KeyHolder keyHolder = new GeneratedKeyHolder();

    	jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection
          .prepareStatement("INSERT INTO mov (description, amount, date, isIncome) VALUES (?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
          ps.setString(1, mov.getDescription());
		  ps.setDouble(2, mov.getAmount());
		  ps.setDate(3, mov.getDate());
		  ps.setBoolean(4, mov.isIncome());
          return ps;
        }, keyHolder);

        return (long) keyHolder.getKey();
    }

	public List<Mov> getMovs() {
		return jdbcTemplate.query("SELECT * FROM mov", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")));
	}

	public Mov getMovById(long id) {
		return jdbcTemplate.queryForObject("SELECT * FROM mov WHERE mov_id = ?", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")), id);
	}
}
