package h4rk.finance.repository;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import h4rk.finance.exceptions.BusinessException;

@Repository
public class BudgetCategoryRepository {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int postBudgetCategories(Long budgetId, List<Long> catIds) {
        String sql = "INSERT INTO budget_category (budget_id, cat_id) VALUES (?, ?)";
        int[] i = jdbcTemplate.batchUpdate(sql, catIds.stream().map(c -> new Object[] {budgetId, c}).toList());
        if(Arrays.stream(i).sum()==catIds.size()) {
			return Arrays.stream(i).sum();
		} else {
			throw new BusinessException(500, "Error inserting budget_category, number of inserts not equal to number of input catIds");
		}
    }

    public int deleteAllBudgetCategories(Long budgetId) {
        String sql = "DELETE FROM budget_category WHERE budget_id = ?";
        return jdbcTemplate.update(sql, budgetId);
    }
}
