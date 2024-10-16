package h4rk.finance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import h4rk.finance.exceptions.PostMovCatException;
import h4rk.finance.repository.MovCatRepository;

class MovCatServiceTest {

    @Mock
    private MovCatRepository movCatRepository;

    @InjectMocks
    private MovCatService movCatService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
	void testPostMovCat() {
		BigInteger movId = BigInteger.valueOf(1);
		List<Long> catIds = Arrays.asList(1L, 2L, 3L);

		// Assuming postMovCat returns an int (e.g., number of affected rows)
		when(movCatRepository.postMovCat(movId, catIds)).thenReturn(catIds.size());

		assertDoesNotThrow(() -> movCatService.postMovCat(movId, catIds));
		verify(movCatRepository, times(1)).postMovCat(movId, catIds);
	}

    @Test
    void testPostMovCatException() {
        BigInteger movId = BigInteger.valueOf(1);
        List<Long> catIds = Arrays.asList(1L, 2L, 3L);

        doThrow(new RuntimeException("Database error")).when(movCatRepository).postMovCat(movId, catIds);

        assertThrows(PostMovCatException.class, () -> movCatService.postMovCat(movId, catIds));
    }
}
