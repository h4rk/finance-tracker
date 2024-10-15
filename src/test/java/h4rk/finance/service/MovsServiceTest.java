package h4rk.finance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigInteger;
import java.sql.Date;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.exceptions.DeleteMovException;
import h4rk.finance.exceptions.GetMovByIdException;
import h4rk.finance.exceptions.GetMovsException;
import h4rk.finance.exceptions.PostMovException;
import h4rk.finance.repository.MovsRepository;

class MovsServiceTest {

    @Mock
    private MovsRepository movsRepository;

    @Mock
    private MovCatService movCatService;

    @InjectMocks
    private MovsService movsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMovs() {
        List<Mov> expectedMovs = Arrays.asList(
            new Mov("Test Mov 1", 100.0, new Date(System.currentTimeMillis()), true),
            new Mov("Test Mov 2", 50.0, new Date(System.currentTimeMillis()), false)
        );
        when(movsRepository.getMovs()).thenReturn(expectedMovs);

        List<Mov> actualMovs = movsService.getMovs();

        assertEquals(expectedMovs, actualMovs);
        verify(movsRepository, times(1)).getMovs();
    }

    @Test
    void testGetMovById() {
        long movId = 1L;
        Mov expectedMov = new Mov("Test Mov", 100.0, new Date(System.currentTimeMillis()), true);
        when(movsRepository.getMovById(movId)).thenReturn(expectedMov);

        Mov actualMov = movsService.getMovById(movId);

        assertEquals(expectedMov, actualMov);
        verify(movsRepository, times(1)).getMovById(movId);
    }

    @Test
    void testPostMovs() {
        MovWithCat movWithCat = new MovWithCat();
        movWithCat.setDescription("Test Mov");
        movWithCat.setAmount(100.0);
        movWithCat.setDate(new Date(System.currentTimeMillis()));
        movWithCat.setIncome(true);
        movWithCat.setCatIds(Arrays.asList(1L, 2L));

        BigInteger newId = BigInteger.valueOf(1);
        when(movsRepository.postMovs(any(Mov.class))).thenReturn(newId);

        assertDoesNotThrow(() -> movsService.postMovs(movWithCat));

        verify(movsRepository, times(1)).postMovs(any(Mov.class));
        verify(movCatService, times(1)).postMovCat(newId, movWithCat.getCatIds());
    }

    @Test
    void testDeleteMovs() {
        long movId = 1L;

        assertDoesNotThrow(() -> movsService.deleteMovs(movId));

        verify(movsRepository, times(1)).deleteMovs(movId);
    }

    @Test
    void testGetAllMovsWithFullCat() {
        List<MovWithFullCat> expectedMovs = Arrays.asList(
            new MovWithFullCat(),
            new MovWithFullCat()
        );
        when(movsRepository.getAllMovsWithFullCat()).thenReturn(expectedMovs);

        List<MovWithFullCat> actualMovs = movsService.getAllMovsWithFullCat();

        assertEquals(expectedMovs, actualMovs);
        verify(movsRepository, times(1)).getAllMovsWithFullCat();
    }

    @Test
    void testGetMovsException() {
        when(movsRepository.getMovs()).thenThrow(new RuntimeException("Database error"));

        assertThrows(GetMovsException.class, () -> movsService.getMovs());
    }

    @Test
    void testGetMovByIdException() {
        long movId = 1L;
        when(movsRepository.getMovById(movId)).thenThrow(new RuntimeException("Database error"));

        assertThrows(GetMovByIdException.class, () -> movsService.getMovById(movId));
    }

    @Test
    void testPostMovsException() {
        MovWithCat movWithCat = new MovWithCat();
        when(movsRepository.postMovs(any(Mov.class))).thenThrow(new RuntimeException("Database error"));

        assertThrows(PostMovException.class, () -> movsService.postMovs(movWithCat));
    }

    @Test
    void testDeleteMovsException() {
        long movId = 1L;
        doThrow(new RuntimeException("Database error")).when(movsRepository).deleteMovs(movId);

        assertThrows(DeleteMovException.class, () -> movsService.deleteMovs(movId));
    }
}
