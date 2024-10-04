package h4rk.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import h4rk.finance.dto.Mov;
import h4rk.finance.service.MovsService;

@Controller
public class MovsController {

	@Autowired
	private MovsService mService;

	@GetMapping("/movs")
	public ResponseEntity<List<Mov>> getMovs() {
		List<Mov> movs = mService.getMovs();
		return ResponseEntity.ok(movs);
	}

	@GetMapping("/movs/{id}")
	public ResponseEntity<Mov> getMovById(@PathVariable("id") long id) {
		Mov mov = mService.getMovById(id);
		if (mov != null) {
			return ResponseEntity.ok(mov);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/movs")
	public ResponseEntity<?> postMovs(Mov mov) {
		mService.postMovs(mov);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/movs/{id}")
	public ResponseEntity<Void> deleteMovs(@PathVariable("id") long id) {
		mService.deleteMovs(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/tables")
	public ResponseEntity<List<String>> getAllTables() {
		List<String> tables = mService.getAllTables();
		return ResponseEntity.ok(tables);
	}
}

