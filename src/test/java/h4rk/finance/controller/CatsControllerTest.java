package h4rk.finance.controller;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.service.CatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;

public class CatsControllerTest {

    @Mock
    private CatsService cService;

    @InjectMocks
    private CatsController catsController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetCategories() {
        List<Cat> cats = Arrays.asList(new Cat(), new Cat());
        when(cService.getCats()).thenReturn(cats);

        ResponseEntity<List<Cat>> response = catsController.getCategories();

        assertEquals(ResponseEntity.ok(cats), response);
    }

    @Test
    public void testPostCategories() {
        Cat cat = new Cat();
        when(cService.postCat(any(Cat.class))).thenReturn(cat);

        ResponseEntity<Cat> response = catsController.postCategories(cat);

        assertEquals(new ResponseEntity<>(cat, HttpStatus.CREATED), response);
    }

    @Test
    public void testPutCat() {
        ResponseEntity<?> response = catsController.putCat(1L, new Cat());

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    public void testDeleteCategories() {
        ResponseEntity<?> response = catsController.deleteCategories(1L);

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    public void testGetCatTypes() {
        List<CatType> catTypes = Arrays.asList(new CatType(), new CatType());
        when(cService.getCatTypes()).thenReturn(catTypes);

        ResponseEntity<List<CatType>> response = catsController.getCatTypes();

        assertEquals(ResponseEntity.ok(catTypes), response);
    }

    @Test
    public void testGetCatById() {
        Cat cat = new Cat();
        when(cService.getCatById(anyLong())).thenReturn(cat);

        ResponseEntity<Cat> response = catsController.getCatById(1L);

        assertEquals(ResponseEntity.ok(cat), response);
    }
}