package h4rk.finance.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import h4rk.finance.dto.Mov;

@Controller
public class MovsController {
	@GetMapping("/movs")
    public List<Mov> getMovs() {
        System.out.println("getMovs() called");
		return null;//TODO fix
    }

	@GetMapping("/movs/{id}")
	public Mov getMovById(@PathVariable("id") long id) {
		System.out.println("getMovById() called with: " + id);
		return null;//TODO fix
	}

	@PostMapping("/movs")
	public void postMovs(Mov mov) {
		System.out.println("postMovs() called with: " + mov);
	}

	@DeleteMapping("/movs/{id}")
	public void deleteMovs() {
		System.out.println("deleteMovs() called");
	}

}
