package h4rk.finance.repository;

import java.util.List;

import java.sql.PreparedStatement;
import java.sql.Statement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;


import h4rk.finance.dto.Cat;

@Repository
public class CatsRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Cat> getCats() {
        return jdbcTemplate.query("SELECT * FROM cat", (rs, rowNum) -> new Cat(rs.getLong("cat_id"), rs.getString("name"), rs.getString("description"), rs.getShort("cat_type")));
    }

    public Cat postCat(Cat cat) {
		KeyHolder keyHolder = new GeneratedKeyHolder();

    	jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection
          .prepareStatement("INSERT INTO cat (name, description, cat_type) VALUES (?, ?, ?)", Statement.RETURN_GENERATED_KEYS);
          ps.setString(1, cat.getName());
		  ps.setString(2, cat.getDescription());
		  ps.setShort(3, cat.getType());
          return ps;
        }, keyHolder);
		cat.setId(keyHolder.getKey().longValue());
		return cat;
	}

    public int deleteCat(long id) {
        return jdbcTemplate.update("DELETE FROM cat WHERE cat_id = ?", id);
    }
    
}
