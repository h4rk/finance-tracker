package h4rk.finance.repository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MovCatRepository {

	private static final Logger log = LoggerFactory.getLogger(MovCatRepository.class);

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

	public void updateMovCat(Long movId, List<Long> catIds) {
		log.debug("Updating movement-category associations for movId: {}", movId);
		log.debug("New category IDs: {}", catIds);
		
		// Prima elimina tutte le associazioni esistenti
		deleteAllMovCats(movId);
		log.debug("Deleted existing movement-category associations");
		
		// Poi inserisce le nuove associazioni
		if (catIds != null && !catIds.isEmpty()) {
			int inserted = postMovCat(movId, catIds);
			log.debug("Inserted {} new movement-category associations", inserted);
		}
	}
}
