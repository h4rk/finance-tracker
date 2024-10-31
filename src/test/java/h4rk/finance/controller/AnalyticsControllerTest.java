package h4rk.finance.controller;

import h4rk.finance.service.AnalyticsService;
import h4rk.finance.dto.MonthlyRecap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class AnalyticsControllerTest {

    @Mock
    private AnalyticsService analyticsService;

    @InjectMocks
    private AnalyticsController analyticsController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetMonthlyAnalytics() {
        MonthlyRecap monthlyRecap = new MonthlyRecap();
		monthlyRecap.setMonthlyIncome(5.0);
		monthlyRecap.setMonthlyExpense(4.0);
        when(analyticsService.getMonthlyAnalytics()).thenReturn(monthlyRecap);

        ResponseEntity<MonthlyRecap> response = analyticsController.getMonthlyAnalytics();

        assertEquals(ResponseEntity.ok(monthlyRecap), response);
    }

    @Test
    public void testGetYearlyAnalytics() {
        Map<Integer, MonthlyRecap> yearlyRecap = new HashMap<>();
		yearlyRecap.put(1, new MonthlyRecap(5.0, 4.0));
		yearlyRecap.put(2, new MonthlyRecap(6.0, 3.0));

        when(analyticsService.getYearlyAnalytics()).thenReturn(yearlyRecap);

        ResponseEntity<Map<Integer, MonthlyRecap>> response = analyticsController.getYearlyAnalytics();

        assertEquals(ResponseEntity.ok(yearlyRecap), response);
    }
}