package h4rk.finance.security.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import h4rk.finance.security.dto.User;

@Repository
public class UserRepository {

@Autowired
private JdbcTemplate jdbcTemplate;

	public User findByUsername(String username) {
		String sql = "SELECT * FROM user WHERE username = ?";
		return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), username);
	}

	public void save(String username, String password, String roles) {
		String sql = "INSERT INTO user (username, password, roles) VALUES (?, ?, ?)";
		if(roles == null || roles.isEmpty()) {
			roles = "USER";
		}
		jdbcTemplate.update(sql, username, new BCryptPasswordEncoder().encode(password), roles);
	}
}
