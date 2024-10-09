package h4rk.finance.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import h4rk.finance.dto.Cat;

@Repository
public class CatsRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Cat> getCats() {
        return jdbcTemplate.query("SELECT * FROM cat", (rs, rowNum) -> new Cat(rs.getLong("cat_id"), rs.getString("name"), rs.getString("description"), rs.getShort("cat_type")));
    }

    public int postCat(Cat cat) {
        return jdbcTemplate.update("INSERT INTO cat (name, description, cat_type) VALUES (?, ?, ?)", cat.getName(), cat.getDescription(), cat.getType());
    }

    public int deleteCat(long id) {
        return jdbcTemplate.update("DELETE FROM cat WHERE cat_id = ?", id);
    }
    
}
