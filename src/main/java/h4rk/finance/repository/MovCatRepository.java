package h4rk.finance.repository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MovCatRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public int postMovCat(Long movId, List<Long> catIds) {
		int[] i = jdbcTemplate.batchUpdate("INSERT INTO mov_cat (mov_id, cat_id) VALUES (?, ?)", catIds.stream().map(catId -> new Object[] {movId, catId}).collect(Collectors.toList()));
		if(Arrays.stream(i).sum()==catIds.size()) {
			return Arrays.stream(i).sum();
		} else {
			throw new RuntimeException("Error inserting mov_cat, number of inserts not equal to number of input catIds");
		}
	}

	public void deleteAllMovCats(long movId) {
		jdbcTemplate.update("DELETE FROM mov_cat WHERE mov_id = ?", movId);
	}
}
