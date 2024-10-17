package h4rk.finance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import h4rk.finance.security.service.UserService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class SecurityController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	@ResponseBody
	public ResponseEntity<String> register(@RequestParam String username, @RequestParam String password) {
		userService.save(username, password);
		return ResponseEntity.ok("User registered successfully");
	}

	@GetMapping("/login")
	public String login() {
		log.info("Login page requested");
		return "login";
	}

	@GetMapping("/register")
	public String register() {
		log.info("Register page requested");
		return "register";
	}
}
