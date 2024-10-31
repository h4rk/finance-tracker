package h4rk.finance.controller;

import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.service.MovsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyLong;

public class MovsControllerTest {

    @Mock
    private MovsService mService;

    @InjectMocks
    private MovsController movsController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetMovs() {
        List<MovWithFullCat> movs = Arrays.asList(new MovWithFullCat(), new MovWithFullCat());
        when(mService.getAllMovsWithFullCat()).thenReturn(movs);

        ResponseEntity<List<MovWithFullCat>> response = movsController.getMovs();

        assertEquals(ResponseEntity.ok(movs), response);
    }

    @Test
    public void testGetMovById() {
        Mov mov = new Mov();
        when(mService.getMovById(anyLong())).thenReturn(mov);

        ResponseEntity<Mov> response = movsController.getMovById(1L);

        assertEquals(ResponseEntity.ok(mov), response);
    }

    @Test
    public void testPostMovs() {
        MovWithCat movWithCat = new MovWithCat();
        ResponseEntity<?> response = movsController.postMovs(movWithCat);

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    public void testPutMovs() {
        MovWithCat movWithCat = new MovWithCat();
        ResponseEntity<?> response = movsController.putMovs(1L, movWithCat);

        assertEquals(ResponseEntity.ok().build(), response);
    }

    @Test
    public void testDeleteMovs() {
        ResponseEntity<?> response = movsController.deleteMovs(1L);

        assertEquals(ResponseEntity.ok().build(), response);
    }
}