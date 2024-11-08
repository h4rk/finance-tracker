package h4rk.finance.service;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.repository.CatTypeRepository;
import h4rk.finance.repository.CatsRepository;
import h4rk.finance.security.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CatsServiceTest {

	@Mock
	private CatsRepository catsRepository;

	@Mock
	private CatTypeRepository catTypeRepository;

	@Mock
	private UserService userService;

	@InjectMocks
	private CatsService catsService;

	@BeforeEach
	public void setUp() {
		// Initialize mocks
	}

	@Test
	public void testGetCats() {
		List<Cat> cats = Arrays.asList(new Cat(), new Cat());
		when(userService.getCurrentUserId()).thenReturn(1L);
		when(catsRepository.getCats(anyLong())).thenReturn(cats);

		List<Cat> result = catsService.getCats();

		assertEquals(cats, result);
	}

	@Test
	public void testGetCatById() {
		Cat cat = new Cat();
		when(userService.getCurrentUserId()).thenReturn(1L);
		when(catsRepository.getCatById(anyLong(), anyLong())).thenReturn(cat);

		Cat result = catsService.getCatById(1L);

		assertEquals(cat, result);
	}

	@Test
	public void testPostCat() {
		Cat cat = new Cat();
		when(userService.getCurrentUserId()).thenReturn(1L);
		when(catsRepository.postCat(any(Cat.class), anyLong())).thenReturn(cat);

		Cat result = catsService.postCat(cat);

		assertEquals(cat, result);
	}

	@Test
	public void testPutCat() {
		Cat oldCat = new Cat();
		Cat newCat = new Cat();
		when(userService.getCurrentUserId()).thenReturn(1L);
		when(catsRepository.getCatById(anyLong(), anyLong())).thenReturn(oldCat);

		catsService.putCat(1L, newCat);

		verify(catsRepository, times(1)).putCat(newCat, 1L, 1L);
	}

	@Test
	public void testDeleteCat() {
		when(catsRepository.deleteCat(anyLong(), anyLong())).thenReturn(1);
		when(userService.getCurrentUserId()).thenReturn(1L);

		catsService.deleteCat(1L);

		verify(catsRepository, times(1)).deleteCat(1L, 1L);
	}

	@Test
	public void testGetCatTypes() {
		List<CatType> catTypes = Arrays.asList(new CatType(), new CatType());
		when(catTypeRepository.getCatTypes()).thenReturn(catTypes);

		List<CatType> result = catsService.getCatTypes();

		assertEquals(catTypes, result);
	}
}