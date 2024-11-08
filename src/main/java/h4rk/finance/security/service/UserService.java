package h4rk.finance.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import h4rk.finance.exceptions.BusinessException;
import h4rk.finance.security.dto.User;
import h4rk.finance.security.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService implements UserDetailsService{

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws BusinessException {
		User user = userRepository.findByUsername(username);
		if (user == null) {
			throw new BusinessException(404, "User not found");
		}
		return user;
	}

	public Long getCurrentUserId() {
		User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		log.debug("Retrieving current user id for username: [{}]", user.getUsername());
		Long id = userRepository.findByUsername(user.getUsername()).getUserId();
		log.debug("Current user: [{}]", user.getUsername());
		log.debug("Current user id: [{}]", id);
		return id;
	}

	public void save(String username, String password) {
		userRepository.save(username, password, null);
	}
}
