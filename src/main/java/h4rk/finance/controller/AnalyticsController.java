package h4rk.finance.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import h4rk.finance.dto.MonthlyRecap;
import h4rk.finance.service.AnalyticsService;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {
	
	@Autowired
	private AnalyticsService analyticsService;
	
	@GetMapping("/monthly")
	public ResponseEntity<MonthlyRecap> getMonthlyAnalytics() {
		return ResponseEntity.ok(analyticsService.getMonthlyAnalytics());
	}

	@GetMapping("/yearly")
	public ResponseEntity<Map<Integer, MonthlyRecap>> getYearlyAnalytics() {
		return ResponseEntity.ok(analyticsService.getYearlyAnalytics());
	}


}
