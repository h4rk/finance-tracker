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
	
	public int deleteMovs(long id, long userId) {
		return jdbcTemplate.update("DELETE FROM mov WHERE mov_id = ? AND user_id = ?", id, userId);
	}

	public BigInteger postMovs(Mov mov, long userId) {

		KeyHolder keyHolder = new GeneratedKeyHolder();

    	jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection
          .prepareStatement("INSERT INTO mov (description, amount, date, isIncome, user_id) VALUES (?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
          ps.setString(1, mov.getDescription());
		  ps.setDouble(2, mov.getAmount());
		  ps.setDate(3, mov.getDate());
		  ps.setBoolean(4, mov.isIncome());
		  ps.setLong(5, userId);
          return ps;
        }, keyHolder);

        return (BigInteger) keyHolder.getKey();
    }

	public List<Mov> getMovs(long userId) {
		return jdbcTemplate.query("SELECT * FROM mov WHERE user_id = ?", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")), userId);
	}

	public Mov getMovById(long id, long userId) {
		return jdbcTemplate.queryForObject("SELECT * FROM mov WHERE mov_id = ? AND user_id = ?", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")), id, userId);
	}

	public List<MovWithFullCat> getAllMovsWithFullCat(long userId) {
		String sql = "SELECT mov.mov_id, mov.description, mov.amount, mov.date, mov.isIncome, " +
                     "GROUP_CONCAT(cat.cat_id) as cat_ids, GROUP_CONCAT(cat.name) as cat_names " +
                     "FROM (SELECT mov_id, description, amount, date, isIncome FROM mov WHERE user_id = ?) mov " +
                     "LEFT JOIN mov_cat ON mov.mov_id = mov_cat.mov_id " +
                     "LEFT JOIN cat ON mov_cat.cat_id = cat.cat_id " +
                     "GROUP BY mov.mov_id";

		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			MovWithFullCat movWithFullCat = new MovWithFullCat();
			movWithFullCat.setId(rs.getLong("mov_id"));
			movWithFullCat.setDescription(rs.getString("description"));
			movWithFullCat.setAmount(rs.getDouble("amount"));
			movWithFullCat.setDate(rs.getDate("date"));
			movWithFullCat.setIncome(rs.getBoolean("isIncome"));

			String catIds = rs.getString("cat_ids");
			String catNames = rs.getString("cat_names");
			if (catIds != null && catNames != null) {
				String[] ids = catIds.split(",");
				String[] names = catNames.split(",");
				for (int i = 0; i < ids.length; i++) {
					movWithFullCat.getCatIds().put(Long.parseLong(ids[i]), names[i]);
				}
			}
			return movWithFullCat;
		});
	}
}
