package h4rk.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Controller
@Tag(name = "Index", description = "Main page controller")
public class IndexController {

	@Operation(summary = "Get main page", description = "Retrieves the main page of the application")
	@GetMapping("/")
	public String index() {
		return "index";
	}
	
}
