package h4rk.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigInteger;

import h4rk.finance.dto.Mov;
import h4rk.finance.dto.MovWithCat;
import h4rk.finance.repository.MovsRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MovsService {

	@Autowired
	private MovsRepository movsRepository;

	@Autowired
	private MovCatService movCatService;

    public List<Mov> getMovs() {
        log.info("Executing getMovs()...");
		try {
			return movsRepository.getMovs();
		} catch (Exception e) {
			log.error("Error executing getMovs(): [{}]", e.getMessage());
			throw e;
		}
    }

	public Mov getMovById(long id) {
        log.info("Executing getMovById() with id: [{}]...", id);
		try {
			return movsRepository.getMovById(id);
		} catch (Exception e) {
			log.error("Error executing getMovById(): [{}]", e.getMessage());
			throw e;
		}
	}

	@Transactional(rollbackFor = Exception.class)
	public void postMovs(MovWithCat movWithCat) {
        log.info("Executing postMovs() with mov: [{}]...", movWithCat);
		try {
			BigInteger new_id = movsRepository.postMovs(new Mov(movWithCat.getDescription(), movWithCat.getAmount(), movWithCat.getDate(), movWithCat.isIncome()));
			movCatService.postMovCat(new_id, movWithCat.getCatIds());
		} catch (Exception e) {
			log.error("Error executing postMovs(): [{}]", e.getMessage());
			throw e;
		}
	}

	public void deleteMovs(long id) {
        log.info("Executing deleteMovs() with id: [{}]...", id);
		try {
			movsRepository.deleteMovs(id);
		} catch (Exception e) {
			log.error("Error executing deleteMovs(): [{}]", e.getMessage());
			throw e;
		}
	}

	//TODO remove this method
	public List<String> getAllTables() {
		log.info("Executing getAllTables()...");
		List<String> tables = movsRepository.getAllTables();
		log.info("Tables: [{}]", tables);
		return tables;
	}
}
