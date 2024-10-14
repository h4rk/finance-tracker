package h4rk.finance.repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import h4rk.finance.dto.MonthlyRecap;
import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class AnalyticsRepository {
	
	@Autowired
	JdbcTemplate jdbcTemplate;

	public MonthlyRecap getMonthlyAnalytics(int month, int year) {
		log.debug("Current Month: " + month + " Current Year: " + year);
		String queryEntrate = "SELECT COALESCE(SUM(amount),0) FROM mov WHERE MONTH(date) = ? AND YEAR(date) = ? AND isIncome = 1;";
		String queryUscite = "SELECT COALESCE(SUM(amount),0) FROM mov WHERE MONTH(date) = ? AND YEAR(date) = ? AND isIncome = 0";
		Double entrate = jdbcTemplate.queryForObject(queryEntrate,Double.class, new Object[]{month, year});
		Double uscite = jdbcTemplate.queryForObject(queryUscite,Double.class, new Object[]{month, year});
		log.debug("Entrate: " + entrate + " Uscite: " + uscite);
		return new MonthlyRecap(entrate, uscite);
	}

	public Map<Integer, MonthlyRecap> getYearlyAnalytics(Date date) {
		log.debug("Extracting yearly analytics for date: " + date);
		//Parametric query to get the sum of the amount for each month of the past year
		String sql = "SELECT COALESCE(SUM(m.amount),0) as somma, MONTH(m.date) as mese, YEAR(m.date) as anno FROM mov m WHERE date > LAST_DAY(DATE_SUB(?, INTERVAL 1 YEAR)) AND m.isIncome = ? GROUP BY mese, anno ORDER BY anno, mese;";
		
		//Extract the incomes for each month of the past year
		Map<Integer, Double> yearlyIncomeMap = new HashMap<>();
		//Default values for each month
		for (int i = 1; i <= 12; i++) {
			yearlyIncomeMap.put(i, 0.0);
		}
		jdbcTemplate.query(sql,
			new Object[]{date, true},
			new int[]{Types.DATE, Types.BOOLEAN},
			(rs, rowNum) -> {
				log.debug("ResultSet: {}", rs);
				yearlyIncomeMap.put(rs.getInt("mese"), rs.getDouble("somma"));
				return null;
			}
		);

		log.debug("Yearly Income Map: " + yearlyIncomeMap);

		//Extract the expenses for each month of the past year
		Map<Integer, Double> yearlyExpenseMap = new HashMap<>();
		for (int i = 1; i <= 12; i++) {
			yearlyExpenseMap.put(i, 0.0);
		}
		jdbcTemplate.query(sql,
			new Object[]{date, false},
			new int[]{Types.DATE, Types.BOOLEAN},
			(rs, rowNum) -> {
				log.debug("ResultSet: {}", rs);
				yearlyExpenseMap.put(rs.getInt("mese"), rs.getDouble("somma"));
				return null;
			}
		);

		log.debug("Yearly Expense Map: " + yearlyExpenseMap);

		//For each month, create a MonthlyRecap object and put it in the map
		Map<Integer, MonthlyRecap> yearlyRecapMap = new HashMap<>();
		for(Integer mese : yearlyIncomeMap.keySet()) {
			yearlyRecapMap.put(mese, new MonthlyRecap(yearlyIncomeMap.get(mese), yearlyExpenseMap.get(mese)));
		}

		log.debug("Yearly Recap Map: " + yearlyRecapMap);

		return yearlyRecapMap;
	}
}
