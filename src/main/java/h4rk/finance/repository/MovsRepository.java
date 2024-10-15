package h4rk.finance.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import java.math.BigInteger;
import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithFullCat;

@Repository
public class MovsRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public int deleteMovs(long id) {
		return jdbcTemplate.update("DELETE FROM mov WHERE mov_id = ?", id);
	}

	public BigInteger postMovs(Mov mov) {

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

        return (BigInteger) keyHolder.getKey();
    }

	public List<Mov> getMovs() {
		return jdbcTemplate.query("SELECT * FROM mov", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")));
	}

	public Mov getMovById(long id) {
		return jdbcTemplate.queryForObject("SELECT * FROM mov WHERE mov_id = ?", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")), id);
	}

	public List<MovWithFullCat> getAllMovsWithFullCat() {
		return jdbcTemplate.query("SELECT mov.mov_id, mov.description, mov.amount, mov.date, mov.isIncome, cat.cat_id, cat.name FROM mov LEFT JOIN mov_cat ON mov.mov_id = mov_cat.mov_id JOIN cat ON mov_cat.cat_id = cat.cat_id", 
		(rs, rowNum) -> {
			MovWithFullCat movWithFullCat = new MovWithFullCat();
			movWithFullCat.setId(rs.getLong("mov_id"));
			movWithFullCat.setDescription(rs.getString("description"));
			movWithFullCat.setAmount(rs.getDouble("amount"));
			movWithFullCat.setDate(rs.getDate("date"));
			movWithFullCat.setIncome(rs.getBoolean("isIncome"));
			movWithFullCat.getCatIds().put(rs.getLong("cat_id"), rs.getString("name"));
			return movWithFullCat;
		});
	}
}
