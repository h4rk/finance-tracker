package h4rk.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import h4rk.finance.dto.Cat;
import h4rk.finance.dto.CatType;
import h4rk.finance.exceptions.DeleteCatsException;
import h4rk.finance.exceptions.GetCatTypesException;
import h4rk.finance.exceptions.GetCatsException;
import h4rk.finance.exceptions.PostCatsException;
import h4rk.finance.repository.CatTypeRepository;
import h4rk.finance.repository.CatsRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CatsService {

    @Autowired
    private CatsRepository catsRepository;

	@Autowired
	private CatTypeRepository catTypeRepository;

    public List<Cat> getCats() {
        log.info("Executing getCats()...");
        try {
            List<Cat> cats = catsRepository.getCats();
            log.debug("getCats() returned: [{}]", cats);
            return cats;
        } catch (Exception e) {
            log.error("Error executing getCats(): [{}]", e.getMessage());
            throw new GetCatsException("Error while getting the category", e);
        }
    }

    public Cat postCat(Cat cat) {
        log.info("Executing postCat() with cat: [{}]...", cat);
        try {
            return catsRepository.postCat(cat);
        } catch (Exception e) {
            log.error("Error executing postCat(): [{}]", e.getMessage());
            throw new PostCatsException("Error while posting the category.", e);
        }
    }

    public void deleteCat(long id) {
        log.info("Executing deleteCat() with id: [{}]...", id);
        try {
            catsRepository.deleteCat(id);
        } catch (Exception e) {
            log.error("Error executing deleteCat(): [{}]", e.getMessage());
            throw new DeleteCatsException("Error while deleting the category.", e);
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
			throw new GetCatTypesException("Error while getting the category types", e);
		}
	}
}
