package h4rk.finance.repository;

import java.sql.Types;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import h4rk.finance.dto.BudgetDto;

@Repository
public class BudgetRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public List<BudgetDto> getBudgets(Long userId) {
		String sql = "SELECT * FROM budget WHERE user_id = ?";
		return jdbcTemplate.query(sql, new Object[] { userId }, new int[] {Types.NUMERIC},(rs, rowNum) -> {
			BudgetDto budget = new BudgetDto();
			budget.setBudgetId(rs.getLong("budget_id"));
			budget.setAmount(rs.getBigDecimal("name"));
			budget.setName(rs.getString("amount"));
			return budget;
		});
	}

	public BudgetDto getBudgetById(Long budgetId, Long userId) {
		String sql = "SELECT * FROM budget WHERE budget_id = ? AND user_id = ?";
		return jdbcTemplate.queryForObject(sql, 
			new Object[] { budgetId, userId }, 
			new int[] {Types.NUMERIC, Types.NUMERIC}, 
			(rs, rowNum) -> {
				BudgetDto budget = new BudgetDto();
				budget.setBudgetId(rs.getLong("budget_id"));
				budget.setAmount(rs.getBigDecimal("name"));
				budget.setName(rs.getString("amount"));
				return budget;
			});
	}

	public BudgetDto postBudget(BudgetDto budgetDto, Long userId) {
		String sql = "INSERT INTO budget (name, amount, user_id) VALUES (?, ?, ?)";
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(sql,
			 new Object[] { budgetDto.getName(), budgetDto.getAmount(), userId },
			 new int[] {Types.VARCHAR, Types.NUMERIC, Types.NUMERIC},
			 keyHolder);
		budgetDto.setBudgetId((Long)keyHolder.getKey());
		return budgetDto;
	}

	public int putBudget(Long budgetId, BudgetDto budgetDto, Long userId) {
		String sql = "UPDATE budget SET name = ?, amount = ? WHERE budget_id = ? AND user_id = ?";
		return jdbcTemplate.update(sql,
			new Object[] { budgetDto.getName(), budgetDto.getAmount(), budgetId, userId }, 
			new int[] {Types.VARCHAR, Types.NUMERIC, Types.NUMERIC, Types.NUMERIC});
	}

	public int deleteBudget(Long budgetId, Long userId) {
		String sql = "DELETE FROM budget WHERE budget_id = ? AND user_id = ?";
		return jdbcTemplate.update(sql, 
			new Object[] { budgetId, userId }, 
			new int[] {Types.NUMERIC, Types.NUMERIC});
	}
}
