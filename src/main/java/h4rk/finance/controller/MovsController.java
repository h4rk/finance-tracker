package h4rk.finance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.service.MovsService;

import java.util.List;

@RestController
@Tag(name = "Movements", description = "Movement management APIs")
public class MovsController {

	@Autowired
	private MovsService mService;

	@Operation(summary = "Get all movements", description = "Retrieves a list of all movements with full category details")
	@GetMapping("/movs")
	public ResponseEntity<List<MovWithFullCat>> getMovs() {
		List<MovWithFullCat> movs = mService.getAllMovsWithFullCat();
		return ResponseEntity.ok(movs);
	}

	@Operation(summary = "Get movement by ID", description = "Retrieves a specific movement by its ID")
	@GetMapping("/movs/{id}")
	public ResponseEntity<Mov> getMovById(@PathVariable("id") long id) {
		Mov mov = mService.getMovById(id);
		if (mov != null) {
			return ResponseEntity.ok(mov);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@Operation(summary = "Create a new movement", description = "Creates a new movement with the provided details")
	@PostMapping("/movs")
	public ResponseEntity<?> postMovs(@RequestBody MovWithCat movWithCat) {
		mService.postMovs(movWithCat);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "Update a movement", description = "Updates a movement by its ID")
	@PutMapping("/movs/{id}")
	public ResponseEntity<?> putMovs(@PathVariable("id") long id, @RequestBody MovWithCat movWithCat) {
		mService.putMovs(id, movWithCat);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "Delete a movement", description = "Deletes a movement by its ID")
	@DeleteMapping("/movs/{id}")
	public ResponseEntity<?> deleteMovs(@PathVariable("id") long id) {
		mService.deleteMovs(id);
		return ResponseEntity.ok().build();
	}

}
