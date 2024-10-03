package h4rk.finance.service;

import java.util.List;
import org.springframework.stereotype.Service;
import h4rk.finance.dto.Mov;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MovsService {

    public List<Mov> getMovs() {
        log.info("Executing getMovs()...");
		return null;
    }

	public Mov getMovById(long id) {
        log.info("Executing getMovById() with id: [{}]...", id);
		return null;
	}

	public void postMovs(Mov mov) {
        log.info("Executing postMovs() with mov: [{}]...", mov);
	}

	public void deleteMovs(long id) {
        log.info("Executing deleteMovs() with id: [{}]...", id);
	}
}
