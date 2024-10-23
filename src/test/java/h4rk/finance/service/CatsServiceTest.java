package h4rk.finance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.exceptions.DeleteCatsException;
import h4rk.finance.exceptions.GetCatTypesException;
import h4rk.finance.exceptions.GetCatsException;
import h4rk.finance.exceptions.PostCatsException;
import h4rk.finance.repository.CatTypeRepository;
import h4rk.finance.repository.CatsRepository;
import h4rk.finance.security.service.UserService;

class CatsServiceTest {

    @Mock
    private CatsRepository catsRepository;

    @Mock
    private CatTypeRepository catTypeRepository;

    @InjectMocks
    private CatsService catsService;

    @Mock
    private UserService userService;

    private static final long MOCK_USER_ID = 1L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(userService.getCurrentUserId()).thenReturn(MOCK_USER_ID);
    }

    @Test
    void testGetCats() {
        List<Cat> expectedCats = Arrays.asList(new Cat(), new Cat());
        when(catsRepository.getCats(userService.getCurrentUserId())).thenReturn(expectedCats);

        List<Cat> actualCats = catsService.getCats();

        assertEquals(expectedCats, actualCats);
        verify(catsRepository, times(1)).getCats(userService.getCurrentUserId());
    }

    @Test
    void testGetCatsException() {
        when(catsRepository.getCats(userService.getCurrentUserId())).thenThrow(new RuntimeException("Database error"));

        assertThrows(GetCatsException.class, () -> catsService.getCats());
    }

    @Test
    void testPostCat() {
        Cat cat = new Cat();
        when(catsRepository.postCat(cat, userService.getCurrentUserId())).thenReturn(cat);

        Cat result = catsService.postCat(cat);

        assertEquals(cat, result);
        verify(catsRepository, times(1)).postCat(cat, userService.getCurrentUserId());
    }

    @Test
    void testPostCatException() {
        Cat cat = new Cat();
        when(catsRepository.postCat(cat, userService.getCurrentUserId())).thenThrow(new RuntimeException("Database error"));

        assertThrows(PostCatsException.class, () -> catsService.postCat(cat));
    }

    @Test
    void testDeleteCat() {
        long id = 1L;
		when(catsRepository.deleteCat(id, userService.getCurrentUserId())).thenReturn(1);

		assertDoesNotThrow(() -> catsService.deleteCat(id));
		verify(catsRepository, times(1)).deleteCat(id, userService.getCurrentUserId());
    }

    @Test
    void testDeleteCatException() {
        long id = 1L;
        when(catsRepository.deleteCat(id, userService.getCurrentUserId()))
            .thenThrow(new RuntimeException("Database error"));

        assertThrows(DeleteCatsException.class, () -> catsService.deleteCat(id));
    }

    @Test
    void testGetCatTypes() {
        List<CatType> expectedCatTypes = Arrays.asList(new CatType(), new CatType());
        when(catTypeRepository.getCatTypes()).thenReturn(expectedCatTypes);

        List<CatType> actualCatTypes = catsService.getCatTypes();

        assertEquals(expectedCatTypes, actualCatTypes);
        verify(catTypeRepository, times(1)).getCatTypes();
    }

    @Test
    void testGetCatTypesException() {
        when(catTypeRepository.getCatTypes()).thenThrow(new RuntimeException("Database error"));

        assertThrows(GetCatTypesException.class, () -> catsService.getCatTypes());
    }
}
