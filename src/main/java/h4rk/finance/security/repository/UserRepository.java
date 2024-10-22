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
			roles = "ROLE_USER";
		} else {
			StringBuilder rolesBuilder = new StringBuilder();
			for (String role : roles.split(",")) {
				rolesBuilder.append("ROLE_"+role.trim()).append(",");
			}
			roles = rolesBuilder.substring(0, rolesBuilder.length() - 1);
		}
		jdbcTemplate.update(sql, username, new BCryptPasswordEncoder().encode(password), roles);
	}
}
