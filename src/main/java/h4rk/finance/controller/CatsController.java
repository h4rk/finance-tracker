package h4rk.finance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.service.CatsService;

@RestController
@Tag(name = "Categories", description = "Category management APIs")
public class CatsController {

    @Autowired
    private CatsService cService;
    
    @Operation(summary = "Get all categories", description = "Retrieves a list of all categories")
    @GetMapping("/cats")
    public ResponseEntity<List<Cat>> getCategories() {
        List<Cat> l = cService.getCats();
        return ResponseEntity.ok(l);
    }

    @Operation(summary = "Create a new category", description = "Creates a new category with the provided details")
    @PostMapping("/cats")
    public ResponseEntity<Cat> postCategories(@RequestBody Cat cat) {
        Cat c = cService.postCat(cat);
        return new ResponseEntity<Cat>(c, HttpStatus.CREATED);
    }

	@PutMapping("/cats/{id}")
	public ResponseEntity<?> putCat(@PathVariable Long id, @RequestBody Cat cat) {
		cService.putCat(id, cat);
		return ResponseEntity.ok().build();
	}

    @Operation(summary = "Delete a category", description = "Deletes a category by its ID")
    @DeleteMapping("/cats/{id}")
    public ResponseEntity<?> deleteCategories(@PathVariable("id") long id) {
        cService.deleteCat(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get all category types", description = "Retrieves a list of all category types")
    @GetMapping("/catTypes")
    public ResponseEntity<List<CatType>> getCatTypes() {
        List<CatType> catTypes = cService.getCatTypes();
        return ResponseEntity.ok(catTypes);
    }

	@Operation(summary = "Get a category by ID", description = "Retrieves a category by its ID")
	@GetMapping("/cats/{id}")
	public ResponseEntity<Cat> getCatById(@PathVariable Long id) {
		Cat c = cService.getCatById(id);
		return ResponseEntity.ok(c);
	}
}
