package h4rk.finance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
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

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.exceptions.DeleteMovException;
import h4rk.finance.exceptions.GetMovByIdException;
import h4rk.finance.exceptions.GetMovsException;
import h4rk.finance.exceptions.PostMovException;
import h4rk.finance.repository.MovsRepository;
import h4rk.finance.security.service.UserService;

class MovsServiceTest {

    @Mock
    private MovsRepository movsRepository;

    @Mock
    private MovCatService movCatService;

	@Mock
    private CatsService catsService;

	@Mock
    private UserService userService;

    @InjectMocks
    private MovsService movsService;

    private static final long MOCK_USER_ID = 1L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(userService.getCurrentUserId()).thenReturn(MOCK_USER_ID);
    }

    @Test
    void testGetMovs() {
        List<Mov> expectedMovs = Arrays.asList(
            new Mov("Test Mov 1", 100.0, new Date(System.currentTimeMillis()), true),
            new Mov("Test Mov 2", 50.0, new Date(System.currentTimeMillis()), false)
        );
        when(movsRepository.getMovs(userService.getCurrentUserId())).thenReturn(expectedMovs);

        List<Mov> actualMovs = movsService.getMovs();

        assertEquals(expectedMovs, actualMovs);
        verify(movsRepository, times(1)).getMovs(userService.getCurrentUserId());
    }

    @Test
    void testGetMovById() {
        long movId = 1L;
        Mov expectedMov = new Mov("Test Mov", 100.0, new Date(System.currentTimeMillis()), true);
        when(movsRepository.getMovById(movId, userService.getCurrentUserId())).thenReturn(expectedMov);

        Mov actualMov = movsService.getMovById(movId);

        assertEquals(expectedMov, actualMov);
        verify(movsRepository, times(1)).getMovById(movId, userService.getCurrentUserId());
    }

     @Test
    void testPostMovs() {
        // Prepare test data
        MovWithCat movWithCat = new MovWithCat();
        movWithCat.setDescription("Test Mov");
        movWithCat.setAmount(100.0);
        movWithCat.setDate(new Date(System.currentTimeMillis()));
        movWithCat.setIncome(true);
        movWithCat.setCatIds(Arrays.asList(1L, 2L));

        // Mock catsService to return categories matching the input
        List<Cat> mockCats = Arrays.asList(
            new Cat(1L, "Category 1", "Description 1", (short) 1),
            new Cat(2L, "Category 2", "Description 2", (short) 2)
        );
        when(catsService.getCats()).thenReturn(mockCats);

        BigInteger newId = BigInteger.valueOf(1);
        
        // Mock the repository method to return newId
        when(movsRepository.postMovs(any(Mov.class), eq(MOCK_USER_ID))).thenReturn(newId);

        // Mock the movCatService to do nothing when postMovCat is called
        doNothing().when(movCatService).postMovCat(any(BigInteger.class), anyList());

        // Execute the method and assert no exception is thrown
        assertDoesNotThrow(() -> movsService.postMovs(movWithCat));

        // Verify interactions
        verify(catsService, times(1)).getCats();
        verify(movsRepository, times(1)).postMovs(any(Mov.class), eq(MOCK_USER_ID));
        verify(movCatService, times(1)).postMovCat(eq(newId), eq(movWithCat.getCatIds()));
    }

    @Test
    void testDeleteMovs() {
        long movId = 1L;

        assertDoesNotThrow(() -> movsService.deleteMovs(movId));

        verify(movsRepository, times(1)).deleteMovs(movId, userService.getCurrentUserId());
    }

    @Test
    void testGetAllMovsWithFullCat() {
        List<MovWithFullCat> expectedMovs = Arrays.asList(
            new MovWithFullCat(),
            new MovWithFullCat()
        );
        when(movsRepository.getAllMovsWithFullCat(userService.getCurrentUserId())).thenReturn(expectedMovs);

        List<MovWithFullCat> actualMovs = movsService.getAllMovsWithFullCat();

        assertEquals(expectedMovs, actualMovs);
        verify(movsRepository, times(1)).getAllMovsWithFullCat(userService.getCurrentUserId());
    }

    @Test
    void testGetMovsException() {
        when(movsRepository.getMovs(userService.getCurrentUserId())).thenThrow(new RuntimeException("Database error"));

        assertThrows(GetMovsException.class, () -> movsService.getMovs());
    }

    @Test
    void testGetMovByIdException() {
        long movId = 1L;
        when(movsRepository.getMovById(movId, userService.getCurrentUserId())).thenThrow(new RuntimeException("Database error"));

        assertThrows(GetMovByIdException.class, () -> movsService.getMovById(movId));
    }

    @Test
    void testPostMovsException() {
        MovWithCat movWithCat = new MovWithCat();
        movWithCat.setDescription("Test Mov");
        movWithCat.setAmount(100.0);
        movWithCat.setDate(new Date(System.currentTimeMillis()));
        movWithCat.setIncome(true);
        movWithCat.setCatIds(Arrays.asList(1L, 2L));

        when(movsRepository.postMovs(any(Mov.class), eq(MOCK_USER_ID)))
            .thenThrow(new RuntimeException("Database error"));

        assertThrows(PostMovException.class, () -> movsService.postMovs(movWithCat));
	}

    @Test
    void testDeleteMovsException() {
        long movId = 1L;
        when(movsRepository.deleteMovs(movId, userService.getCurrentUserId())).thenThrow(new RuntimeException("Database error"));

        assertThrows(DeleteMovException.class, () -> movsService.deleteMovs(movId));
    }
}
