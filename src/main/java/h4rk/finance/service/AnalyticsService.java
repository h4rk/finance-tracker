package h4rk.finance.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import h4rk.finance.dto.MonthlyRecap;
import h4rk.finance.repository.AnalyticsRepository;
import h4rk.finance.utils.Utils;

@Service
public class AnalyticsService {

	@Autowired
	private AnalyticsRepository analyticsRepository;

	public MonthlyRecap getMonthlyAnalytics() {
		int month = Utils.currentMonth();
		int year = Utils.currentYear();
		return analyticsRepository.getMonthlyAnalytics(month, year);
	}

	public Map<Integer, MonthlyRecap> getYearlyAnalytics() {
		return analyticsRepository.getYearlyAnalytics(Utils.currentSqlDate());
	}
}
