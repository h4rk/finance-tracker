package h4rk.finance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import h4rk.finance.dto.MonthlyRecap;
import h4rk.finance.repository.AnalyticsRepository;
import h4rk.finance.utils.Utils;


@SpringBootTest
class AnalyticsServiceTest {

    @Mock
    private AnalyticsRepository analyticsRepository;

    @Mock
    private Utils utils;

    @InjectMocks
    private AnalyticsService analyticsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetMonthlyAnalytics() {
        int month = 5;
        int year = 2023;
        MonthlyRecap expectedRecap = new MonthlyRecap();

        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::currentMonth).thenReturn(month);
            mockedUtils.when(Utils::currentYear).thenReturn(year);
            when(analyticsRepository.getMonthlyAnalytics(month, year)).thenReturn(expectedRecap);

            MonthlyRecap actualRecap = analyticsService.getMonthlyAnalytics();

            assertEquals(expectedRecap, actualRecap);
            verify(analyticsRepository, times(1)).getMonthlyAnalytics(month, year);
        }
    }

    @Test
    void testGetYearlyAnalytics() {
        Date currentDate = Date.valueOf("2023-05-15");
        Map<Integer, MonthlyRecap> expectedRecaps = new HashMap<>();
        expectedRecaps.put(1, new MonthlyRecap());
        expectedRecaps.put(2, new MonthlyRecap());

        try (MockedStatic<Utils> mockedUtils = mockStatic(Utils.class)) {
            mockedUtils.when(Utils::currentSqlDate).thenReturn(currentDate);
            when(analyticsRepository.getYearlyAnalytics(currentDate)).thenReturn(expectedRecaps);

            Map<Integer, MonthlyRecap> actualRecaps = analyticsService.getYearlyAnalytics();

            assertEquals(expectedRecaps, actualRecaps);
            verify(analyticsRepository, times(1)).getYearlyAnalytics(currentDate);
        }
    }
}
