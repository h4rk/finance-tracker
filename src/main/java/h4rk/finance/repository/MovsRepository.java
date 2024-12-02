package h4rk.finance.repository;

import java.math.BigInteger;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import java.sql.Types;
import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.exceptions.BusinessException;

@Repository
public class MovsRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static final Logger log = LoggerFactory.getLogger(MovsRepository.class);

	public int deleteMovs(long id, long userId) {
		return jdbcTemplate.update("DELETE FROM mov WHERE mov_id = ? AND user_id = ?", id, userId);
	}

	public Long postMovs(Mov mov, long userId) {

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

		Long new_id;
		try {
			new_id = keyHolder.getKey().longValue();
		} catch (NullPointerException e) {
			throw new BusinessException("Errore nel recupero dell'id dopo l'operazione");
		}
        return new_id;
    }

	public int putMovs(long id, Mov mov, long userId) {
		log.debug("Updating movement in database - ID: {}, UserID: {}", id, userId);
		log.debug("Movement data: {}", mov);
		
		int result = jdbcTemplate.update(
			"UPDATE mov SET description = ?, amount = ?, date = ?, isIncome = ? WHERE mov_id = ? AND user_id = ?",
			mov.getDescription(),
			mov.getAmount(),
			mov.getDate(),
			mov.isIncome(),
			id,
			userId
		);
		
		log.debug("Update result: {} rows affected", result);
		return result;
	}

	public List<Mov> getMovs(long userId) {
		return jdbcTemplate.query("SELECT * FROM mov WHERE user_id = ?", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")), userId);
	}

	public Mov getMovById(long id, long userId) {
		return jdbcTemplate.queryForObject("SELECT * FROM mov WHERE mov_id = ? AND user_id = ?", (rs, rowNum) -> new Mov(rs.getLong("mov_id"), rs.getString("description"), rs.getDouble("amount"), rs.getDate("date"), rs.getBoolean("isIncome")), id, userId);
	}

	public MovWithCat getMovWithCatById(long id, long userId) {
		String sql = """
		SELECT mov.mov_id, mov.description, mov.amount, mov.date, mov.isIncome, cat.cat_id as cat_id, cat.name as cat_name 
		FROM (SELECT mov_id, description, amount, date, isIncome FROM mov WHERE user_id = ?) mov 
			LEFT JOIN mov_cat 
			ON mov.mov_id = mov_cat.mov_id
			LEFT JOIN cat 
			ON mov_cat.cat_id = cat.cat_id 
		WHERE mov.mov_id = ?
		""";
		List<MovWithFullCat> listMovWithFullCat = jdbcTemplate.query(sql,
			new Object[] { userId, id }, 
			new int[]{Types.NUMERIC, Types.NUMERIC}, 
			(rs, rowNum) -> {
				MovWithFullCat movWithFullCat = new MovWithFullCat();
				movWithFullCat.setId(rs.getLong("mov_id"));
				movWithFullCat.setDescription(rs.getString("description"));
				movWithFullCat.setAmount(rs.getDouble("amount"));
				movWithFullCat.setDate(rs.getDate("date"));
				movWithFullCat.setIncome(rs.getBoolean("isIncome"));
				movWithFullCat.setCatId(rs.getLong("cat_id"));
				movWithFullCat.setCatName(rs.getString("cat_name"));
				return movWithFullCat;
			});

		MovWithCat movWithCat = new MovWithCat();
		movWithCat.setId(listMovWithFullCat.get(0).getId());
		movWithCat.setDescription(listMovWithFullCat.get(0).getDescription());
		movWithCat.setAmount(listMovWithFullCat.get(0).getAmount());
		movWithCat.setDate(listMovWithFullCat.get(0).getDate());
		movWithCat.setIncome(listMovWithFullCat.get(0).isIncome());

		for (MovWithFullCat m : listMovWithFullCat) {
			movWithCat.getCatIds().add(m.getCatId());
		}

		return movWithCat;
	}

	public List<MovWithFullCat> getAllMovsWithFullCat(long userId) {
		String sql = """
		SELECT m.mov_id, m.description, m.amount, m.date, m.isIncome, 
			   GROUP_CONCAT(c.cat_id) as cat_ids,
			   GROUP_CONCAT(c.name) as cat_names
		FROM mov m
		LEFT JOIN mov_cat mc ON m.mov_id = mc.mov_id
		LEFT JOIN cat c ON mc.cat_id = c.cat_id
		WHERE m.user_id = ?
		GROUP BY m.mov_id
		""";

		return jdbcTemplate.query(sql, 
			new Object[] { userId }, 
			new int[] { Types.NUMERIC },
			(rs, rowNum) -> {
				MovWithFullCat mov = new MovWithFullCat();
				mov.setId(rs.getLong("mov_id"));
				mov.setDescription(rs.getString("description"));
				mov.setAmount(rs.getDouble("amount"));
				mov.setDate(rs.getDate("date"));
				mov.setIncome(rs.getBoolean("isIncome"));
				
				// Gestisci le categorie multiple
				String catNames = rs.getString("cat_names");
				if (catNames != null) {
					mov.setCatNames(Arrays.asList(catNames.split(",")));
				}
				
				return mov;
			});
	}
}
