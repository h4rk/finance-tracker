package h4rk.finance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.service.CatsService;

@RestController
public class CatsController {

    @Autowired
    private CatsService cService;
    
    @GetMapping("/cats")
    public ResponseEntity<List<Cat>> getCategories() {
        List<Cat> l = cService.getCats();
        return ResponseEntity.ok(l);
    }

    @PostMapping("/cats")
    public ResponseEntity<?> postCategories(@RequestBody Cat cat) {
        cService.postCat(cat);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cats/{id}")
    public ResponseEntity<?> deleteCategories(@PathVariable("id") long id) {
        cService.deleteCat(id);
        return ResponseEntity.ok().build();
    }

	@GetMapping("/catTypes")
	public ResponseEntity<List<CatType>> getCatTypes() {
		List<CatType> catTypes = cService.getCatTypes();
		return ResponseEntity.ok(catTypes);
	}
}
