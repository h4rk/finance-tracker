package h4rk.finance.repository;

import java.math.BigDecimal;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import h4rk.finance.dto.BudgetDto;
import h4rk.finance.dto.Cat;
import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class BudgetRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public Map<Long, BudgetDto> getBudgets(Long userId) {
		String sql = """
					SELECT b.budget_id, b.amount, b.name, c.cat_id, c.name as cat_name, c.description, c.cat_type 
					FROM budget b
					JOIN budget_category bc ON b.budget_id = bc.budget_id 
					JOIN cat c ON bc.cat_id = c.cat_id
					WHERE b.user_id = ?
					""";

		Map<Long, BudgetDto> budgets = new HashMap<>();

		jdbcTemplate.query(sql, new Object[] { userId }, new int[] {Types.NUMERIC},(rs, rowNum) -> {
			if (!budgets.containsKey(rs.getLong("budget_id"))) {
				log.info("Creating new budget");
				BudgetDto budget = new BudgetDto();
				budget.setBudgetId(rs.getLong("budget_id"));
				budget.setBudgetAmount(rs.getBigDecimal("amount"));
				budget.setName(rs.getString("name"));
				budget.getCategories().add(new Cat(
					rs.getLong("cat_id"),
					rs.getString("cat_name"),
					rs.getString("description"),
					rs.getShort("cat_type")
				));
				budgets.put(rs.getLong("budget_id"), budget);
			} else {
				log.info("Adding category to existing budget");
				BudgetDto budget = budgets.get(rs.getLong("budget_id"));
				budget.getCategories().add(new Cat(
					rs.getLong("cat_id"),
					rs.getString("cat_name"),
					rs.getString("description"),
					rs.getShort("cat_type")
				));
			}
			return null;
		});

		return budgets;
	}

	public BigDecimal getBudgetCurrentImport(Long userId, List<Long> catIds) {
		StringBuilder sql = new StringBuilder("SELECT SUM(m2.amount) FROM mov m2 WHERE m2.mov_id IN (");
		sql.append("SELECT m.mov_id FROM mov m JOIN mov_cat mc ON m.mov_id = mc.mov_id");
		sql.append(" WHERE mc.cat_id IN (?");
		List<Object> params = new ArrayList<>();
		List<Integer> paramTypes = new ArrayList<>();
		params.add(catIds.get(0));
		paramTypes.add(Types.NUMERIC);
		for (int i=1; i<catIds.size(); i++) {
			params.add(catIds.get(i));
			paramTypes.add(Types.NUMERIC);
			sql.append(", ?");
		}
		sql.append(") AND m.user_id = ? GROUP BY m.mov_id)");
		params.add(userId);
		paramTypes.add(Types.NUMERIC);
		return jdbcTemplate.queryForObject(sql.toString(), 
			params.toArray(),
			paramTypes.stream().mapToInt(Integer::intValue).toArray(), 
			BigDecimal.class);
	}

	public BudgetDto getBudgetById(Long budgetId, Long userId) {
		String sql = "SELECT * FROM budget WHERE budget_id = ? AND user_id = ?";
		return jdbcTemplate.queryForObject(sql, 
			new Object[] { budgetId, userId }, 
			new int[] {Types.NUMERIC, Types.NUMERIC}, 
			(rs, rowNum) -> {
				BudgetDto budget = new BudgetDto();
				budget.setBudgetId(rs.getLong("budget_id"));
				budget.setBudgetAmount(rs.getBigDecimal("name"));
				budget.setName(rs.getString("amount"));
				return budget;
			});
	}

	public BudgetDto postBudget(BudgetDto budgetDto, Long userId) {
		String sql = "INSERT INTO budget (name, amount, user_id) VALUES (?, ?, ?)";
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(sql,
			 new Object[] { budgetDto.getName(), budgetDto.getBudgetAmount(), userId },
			 new int[] {Types.VARCHAR, Types.NUMERIC, Types.NUMERIC},
			 keyHolder);
		budgetDto.setBudgetId((Long)keyHolder.getKey());
		return budgetDto;
	}

	public int putBudget(Long budgetId, BudgetDto budgetDto, Long userId) {
		String sql = "UPDATE budget SET name = ?, amount = ? WHERE budget_id = ? AND user_id = ?";
		return jdbcTemplate.update(sql,
			new Object[] { budgetDto.getName(), budgetDto.getBudgetAmount(), budgetId, userId }, 
			new int[] {Types.VARCHAR, Types.NUMERIC, Types.NUMERIC, Types.NUMERIC});
	}

	public int deleteBudget(Long budgetId, Long userId) {
		String sql = "DELETE FROM budget WHERE budget_id = ? AND user_id = ?";
		return jdbcTemplate.update(sql, 
			new Object[] { budgetId, userId }, 
			new int[] {Types.NUMERIC, Types.NUMERIC});
	}
}
