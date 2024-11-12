package h4rk.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.exceptions.BusinessException;
import h4rk.finance.repository.CatTypeRepository;
import h4rk.finance.repository.CatsRepository;
import h4rk.finance.security.service.UserService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CatsService {

    @Autowired
    private CatsRepository catsRepository;

	@Autowired
	private CatTypeRepository catTypeRepository;

	@Autowired
	private UserService userService;

    public List<Cat> getCats() {
        log.info("Executing getCats()...");
        try {
            List<Cat> cats = catsRepository.getCats(userService.getCurrentUserId());
            log.debug("getCats() returned: [{}]", cats);
            return cats;
        } catch (Exception e) {
            log.error("Error executing getCats(): [{}]", e.getMessage());
            throw new BusinessException("Error while getting the category", e);
        }
    }

	public Cat getCatById(Long id) {
		log.info("Executing getCatById() with id: [{}]...", id);
		try {
			Cat c = catsRepository.getCatById(id, userService.getCurrentUserId());
			if (c == null) {
				throw new BusinessException(404, "Category not found");
			}
			return c;
		} catch (Exception e) {
			log.error("Error executing getCatById(): [{}]", e.getMessage());
			throw new BusinessException("Error while getting the category by id.", e);
		}
	}

    public Cat postCat(Cat cat) {
        log.info("Executing postCat() with cat: [{}]...", cat);
        try {
            return catsRepository.postCat(cat, userService.getCurrentUserId());
        } catch (Exception e) {
            log.error("Error executing postCat(): [{}]", e.getMessage());
            throw new BusinessException("Error while posting the category.", e);
        }
    }

	public void putCat(long id, Cat cat) {
		log.info("Executing putCat() with id: [{}]...", id);
		try {
			Cat old = catsRepository.getCatById(id, userService.getCurrentUserId());
			if(old == null){
				throw new IllegalArgumentException("Category not found");
			}
			catsRepository.putCat(cat, id, userService.getCurrentUserId());
		} catch (Exception e) {
			log.error("Error executing putCat(): [{}]", e.getMessage());
			throw new BusinessException("Error while updating the category.", e);
		}
		
	}

    public void deleteCat(long id) {
        log.info("Executing deleteCat() with id: [{}]...", id);
        try {
            catsRepository.deleteCat(id, userService.getCurrentUserId());
        } catch (Exception e) {
            log.error("Error executing deleteCat(): [{}]", e.getMessage());
            throw new BusinessException("Error while deleting the category.", e);
        }
    }

	public List<CatType> getCatTypes() {
		log.info("Executing getCatTypes()...");
		try {
			List<CatType> catTypes = catTypeRepository.getCatTypes();
			log.debug("getCatTypes() returned: [{}]", catTypes);
			return catTypes;
		} catch (Exception e) {
			log.error("Error executing getCatTypes(): [{}]", e.getMessage());
			throw new BusinessException("Error while getting the category types", e);
		}
	}
}
