package h4rk.finance.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import h4rk.finance.security.service.UserService;
import lombok.extern.slf4j.Slf4j;

@Controller
@Tag(name = "Security", description = "Security management APIs")
@Slf4j
public class SecurityController {
	
	@Autowired
	private UserService userService;
	
	@Operation(summary = "Register a new user", description = "Registers a new user with the provided username and password")
	@PostMapping("/register")
	public String register(@RequestParam String username, @RequestParam String password) {
		userService.save(username, password);
		return "login";
	}

	@Operation(summary = "Get login page", description = "Retrieves the login page")
	@GetMapping("/login")
	public String login() {
		log.info("Login page requested");
		return "login";
	}

	@Operation(summary = "Get registration page", description = "Retrieves the registration page")
	@GetMapping("/register")
	public String register() {
		log.info("Register page requested");
		return "register";
	}
}
