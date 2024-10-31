package h4rk.finance.service;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.exceptions.PostMovException;
import h4rk.finance.repository.MovsRepository;
import h4rk.finance.security.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class MovsServiceTest {

    @Mock
    private MovsRepository movRepository;

	@Mock
    private UserService userService;

	@Mock
	private CatsService catsService;

	@Mock
	private MovCatService movCatService;

    @InjectMocks
    private MovsService movsService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllMovsWithFullCat() {
        List<MovWithFullCat> movs = Arrays.asList(new MovWithFullCat(), new MovWithFullCat());
		when(userService.getCurrentUserId()).thenReturn(1L);
        when(movRepository.getAllMovsWithFullCat(anyLong())).thenReturn(movs);

        List<MovWithFullCat> result = movsService.getAllMovsWithFullCat();

        assertEquals(movs, result);
    }

    @Test
    public void testGetMovById() {
        Mov mov = new Mov();
        when(movRepository.getMovById(anyLong(), anyLong())).thenReturn(mov);
		when(userService.getCurrentUserId()).thenReturn(1L);
        Mov result = movsService.getMovById(1L);

        assertEquals(mov, result);
    }

    @Test
    public void testPostMov() {
        MovWithCat movWithCat = new MovWithCat(null, "a", 1.0, null, true, Arrays.asList(1L, 2L));
		List<Cat> catsOk = Arrays.asList(new Cat(1L,"a", "a", (short)1), new Cat(2L,"b", "b", (short)2 ));
		List<Cat> catsKo = Arrays.asList(new Cat(3L,"a", "a", (short)1), new Cat(2L,"b", "b", (short)2 ));
		when(catsService.getCats()).thenReturn(catsOk);
        when(movRepository.postMovs(any(Mov.class), anyLong())).thenReturn(44L);
		when(userService.getCurrentUserId()).thenReturn(1L);
        MovWithCat result = movsService.postMovs(movWithCat);

        assertEquals(movWithCat, result);

		when(catsService.getCats()).thenReturn(catsKo);
		assertThrows(PostMovException.class, () -> movsService.postMovs(movWithCat));
    }

    @Test
    public void testPutMov() {
        MovWithCat old = new MovWithCat(1L, "a", 1.0, null, true, Arrays.asList(1L, 2L));
		MovWithCat movWithCat = new MovWithCat(null, "b", 2.0, null, false, Arrays.asList(1L, 2L));
		MovWithCat expected = new MovWithCat(1L, "b", 2.0, null, false, Arrays.asList(1L, 2L));
		
		List<Cat> catsOk = Arrays.asList(new Cat(1L,"a", "a", (short)1), new Cat(2L,"b", "b", (short)2 ));
		List<Cat> catsKo = Arrays.asList(new Cat(3L,"a", "a", (short)1), new Cat(2L,"b", "b", (short)2 ));
		
		when(catsService.getCats()).thenReturn(catsOk);
		when(userService.getCurrentUserId()).thenReturn(1L);
		when(movRepository.getMovWithCatById(anyLong(), anyLong())).thenReturn(old);
        when(movRepository.putMovs(anyLong(), any(Mov.class), anyLong())).thenReturn(1);
		movWithCat.setId(1L);
		when(movRepository.getMovWithCatById(anyLong(), anyLong())).thenReturn(movWithCat);
        MovWithCat result = movsService.putMovs(1L, movWithCat);

        assertEquals(expected, result);

		when(catsService.getCats()).thenReturn(catsKo);
		assertThrows(PostMovException.class, () -> movsService.putMovs(1L, movWithCat));
    }

    @Test
    public void testDeleteMov() {
        doNothing().when(movRepository.deleteMovs(anyLong(), anyLong()));
		when(userService.getCurrentUserId()).thenReturn(1L);

        movsService.deleteMovs(1L);

        verify(movRepository, times(1)).deleteMovs(1L, 1L);
    }
}