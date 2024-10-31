package h4rk.finance.service;

import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.dto.MovWithFullCat;
import h4rk.finance.exceptions.DeleteMovException;
import h4rk.finance.exceptions.GetMovByIdException;
import h4rk.finance.exceptions.GetMovsException;
import h4rk.finance.exceptions.PostMovException;
import h4rk.finance.exceptions.PutMovException;
import h4rk.finance.repository.MovsRepository;
import h4rk.finance.security.service.UserService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MovsService {

	@Autowired
	private MovsRepository movsRepository;

	@Autowired
	private MovCatService movCatService;

	@Autowired
	private CatsService catsService;

	@Autowired
	private UserService userService;

	public Mov getMovById(long id) {
        log.info("Executing getMovById() with id: [{}]...", id);
		try {
			return movsRepository.getMovById(id, userService.getCurrentUserId());
		} catch (Exception e) {
			log.error("Error executing getMovById(): [{}]", e.getMessage());
			throw new GetMovByIdException("Error while getting the movement by id.", e);
		}
	}

	@Transactional(rollbackFor = Exception.class)
	public MovWithCat postMovs(MovWithCat movWithCat) {
        log.info("Executing postMovs() with mov: [{}]...", movWithCat);
		try {
			//Prevent using category ids that don't exist/belong to the current user
			Set<Long> valid_cats_ids = new HashSet<>(catsService.getCats().stream().map(Cat::getId).collect(Collectors.toList()));
			log.debug("Valid categories ids: [{}]", valid_cats_ids);
			log.debug("Mov categories ids: [{}]", movWithCat.getCatIds());
			for (Long cat_id : movWithCat.getCatIds()) {
				if (!valid_cats_ids.contains(cat_id)) {
					throw new PostMovException("Invalid category id: ["+cat_id+"]", 
						new RuntimeException("Category not found for the current user."));
				}
			}
			//Post the movement
			Long new_id = movsRepository.postMovs(new Mov(movWithCat.getDescription(),
																 movWithCat.getAmount(), movWithCat.getDate(),
																 movWithCat.isIncome()), userService.getCurrentUserId());
			//Post the categories for the movement
			movCatService.postMovCat(new_id, movWithCat.getCatIds());
			//Set the new id
			movWithCat.setId(new_id);

			return movWithCat;
		} catch (Exception e) {
			log.error("Error executing postMovs(): [{}]", e.getMessage());
			throw new PostMovException("Error while posting the movement.", e);
		}
	}

	public void deleteMovs(long id) {
        log.info("Executing deleteMovs() with id: [{}]...", id);
		try {
			movsRepository.deleteMovs(id, userService.getCurrentUserId());
		} catch (Exception e) {
			log.error("Error executing deleteMovs(): [{}]", e.getMessage());
			throw new DeleteMovException("Error while deleting the movement.", e);
		}
	}

	public List<MovWithFullCat> getAllMovsWithFullCat() {
		log.info("Executing getAllMovsWithFullCat()...");
		try {
			return movsRepository.getAllMovsWithFullCat(userService.getCurrentUserId());
		} catch (Exception e) {
			log.error("Error executing getAllMovsWithFullCat(): [{}]", e.getMessage());
			throw new GetMovsException("Error while getting the movements with full category.", e);
		}
	}

	@Transactional(rollbackFor = Exception.class)
	public MovWithCat putMovs(long id, MovWithCat curr) {
		log.info("Executing putMovs() with id: [{}] and mov: [{}]...", id, curr);
		//Check if the movement exists for the user
		MovWithCat old = movsRepository.getMovWithCatById(id, userService.getCurrentUserId());
		if (old == null) {
			throw new PutMovException("Movement not found.", new RuntimeException("Movement not found."));
		}
		
		//Prevent using category ids that don't exist/belong to the current user
		Set<Long> valid_cats_ids = new HashSet<>(catsService.getCats().stream().map(Cat::getId).collect(Collectors.toList()));
		for (Long cat_id : curr.getCatIds()) {
			if (!valid_cats_ids.contains(cat_id)) {
				throw new PostMovException("Invalid category id: ["+cat_id+"]", 
					new RuntimeException("Category not found for the current user."));
			}
		}
		//If there are differences in the categories, delete old and post new
		if(!new HashSet<>(curr.getCatIds()).equals(new HashSet<>(old.getCatIds()))) {
			movCatService.deleteAllMovCats(id);
			movCatService.postMovCat(id, curr.getCatIds());
		}
		//Update the movement
		movsRepository.putMovs(id, new Mov(curr.getDescription(),
			curr.getAmount(), curr.getDate(),
			curr.isIncome()), userService.getCurrentUserId());

		return movsRepository.getMovWithCatById(id, userService.getCurrentUserId());
	}
}
