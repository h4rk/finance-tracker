package h4rk.finance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Analytics", description = "Analytics management APIs")
public class AnalyticsController {
	
	@Autowired
	private AnalyticsService analyticsService;
	
	@Operation(summary = "Get monthly analytics", description = "Retrieves the monthly analytics data")
	@GetMapping("/monthly")
	public ResponseEntity<MonthlyRecap> getMonthlyAnalytics() {
		return ResponseEntity.ok(analyticsService.getMonthlyAnalytics());
	}

	@Operation(summary = "Get yearly analytics", description = "Retrieves the yearly analytics data")
	@GetMapping("/yearly")
	public ResponseEntity<Map<Integer, MonthlyRecap>> getYearlyAnalytics() {
		return ResponseEntity.ok(analyticsService.getYearlyAnalytics());
	}


}
