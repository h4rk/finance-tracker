package h4rk.finance.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import h4rk.finance.security.dto.User;
import h4rk.finance.security.repository.UserRepository;

@Service
public class UserService implements UserDetailsService{

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new UsernameNotFoundException("User not found");
		}
		return user;
	}

	public Long getCurrentUserId() {
		String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
		return userRepository.findByUsername(username).getId();
	}

	public void save(String username, String password) {
		userRepository.save(username, password, null);
	}
}
