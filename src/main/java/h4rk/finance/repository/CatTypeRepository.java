package h4rk.finance.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import h4rk.finance.dto.CatType;

@Repository
public class CatTypeRepository {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public List<CatType> getCatTypes() {
		return jdbcTemplate.query("SELECT * FROM cat_type", (rs, rowNum) -> new CatType(rs.getShort("cat_type_id"), rs.getString("name")));
	}
}
