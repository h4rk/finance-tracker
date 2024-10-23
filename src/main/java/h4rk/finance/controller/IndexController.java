package h4rk.finance.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import h4rk.finance.security.dto.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@Tag(name = "Index", description = "Main page controller")
public class IndexController {

	@Operation(summary = "Get main page", description = "Retrieves the main page of the application")
	@GetMapping("/")
	public String index() {
		User u = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		log.info("User: " + u.toString());
		return "index";
	}
	
}
