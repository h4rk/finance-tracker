package h4rk.finance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigInteger;
import h4rk.finance.repository.MovCatRepository;

@Service
public class MovCatService {
	@Autowired
	private MovCatRepository movCatRepository;

	public void postMovCat(BigInteger movId, List<Long> catIds) {
		movCatRepository.postMovCat(movId, catIds);
	}
}
