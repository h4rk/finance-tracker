package h4rk.finance.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import h4rk.finance.dto.MonthlyRecap;
import h4rk.finance.exceptions.BusinessException;
import h4rk.finance.repository.AnalyticsRepository;
import h4rk.finance.utils.Utils;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AnalyticsService {

	@Autowired
	private AnalyticsRepository analyticsRepository;

	public MonthlyRecap getMonthlyAnalytics() {
		try {
			int month = Utils.currentMonth();
			int year = Utils.currentYear();
			return analyticsRepository.getMonthlyAnalytics(month, year);
		} catch (Exception e) {
			log.error("Error while fetching monthly analytics", e);
			throw new BusinessException("Error while fetching monthly analytics");
		}
		
	}

	public Map<Integer, MonthlyRecap> getYearlyAnalytics() {
		try {
			return analyticsRepository.getYearlyAnalytics(Utils.currentSqlDate());
		} catch (Exception e) {
			log.error("Error while fetching yearly analytics", e);
			throw new BusinessException("Error while fetching yearly analytics");
		}
	}
}
