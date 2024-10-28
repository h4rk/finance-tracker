package h4rk.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigInteger;

import h4rk.finance.exceptions.PostMovCatException;
import h4rk.finance.repository.MovCatRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MovCatService {
	@Autowired
	private MovCatRepository movCatRepository;

	public void postMovCat(Long movId, List<Long> catIds) {
		try {
			movCatRepository.postMovCat(movId, catIds);
		} catch (Exception e) {
			log.error("Error executing postMovCat(): movId=["+movId+"], catIds=["+catIds+"]");
			throw new PostMovCatException("Error while posting categories for movement.", e);
		}
	}

	public void deleteAllMovCats(long movId) {
		movCatRepository.deleteAllMovCats(movId);
	}
}
