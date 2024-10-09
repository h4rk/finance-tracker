package h4rk.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import h4rk.finance.dto.Cat;
import h4rk.finance.repository.CatsRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CatsService {

    @Autowired
    private CatsRepository catsRepository;
    public List<Cat> getCats() {
        log.info("Executing getCats()...");
        try {
            List<Cat> cats = catsRepository.getCats();
            log.debug("getCats() returned: [{}]", cats);
            return cats;
        } catch (Exception e) {
            log.error("Error executing getCats(): [{}]", e.getMessage());
            throw e;
        }
    }

    public void postCat(Cat cat) {
        log.info("Executing postCat() with cat: [{}]...", cat);
        try {
            catsRepository.postCat(cat);
        } catch (Exception e) {
            log.error("Error executing postCat(): [{}]", e.getMessage());
            throw e;
        }
    }

    public void deleteCat(long id) {
        log.info("Executing deleteCat() with id: [{}]...", id);
        try {
            catsRepository.deleteCat(id);
        } catch (Exception e) {
            log.error("Error executing deleteCat(): [{}]", e.getMessage());
            throw e;
        }
    }
}
