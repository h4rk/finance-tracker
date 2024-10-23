package h4rk.finance.security.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.Collection;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User implements UserDetails {

	private Long id;
	private String username;
	private String password;
	private String roles;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return Arrays.asList(roles.split(",")).stream()
			.map(SimpleGrantedAuthority::new)
			.collect(Collectors.toList());
	}
	
}
