package h4rk.finance.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import h4rk.finance.dto.BudgetDto;
import h4rk.finance.exceptions.BusinessException;
import h4rk.finance.repository.BudgetRepository;
import h4rk.finance.security.service.UserService;

@Service
public class BudgetService {

	@Autowired
	private BudgetRepository budgetRepository;

	@Autowired
	private UserService userService;

	public List<BudgetDto> getBudgets() {
		try {
			Map<Long, BudgetDto> budgets = budgetRepository.getBudgets(userService.getCurrentUserId());
			for (BudgetDto budget : budgets.values()) {
				budget.setTotalSpent(budgetRepository.getBudgetCurrentImport(userService.getCurrentUserId(),
									budget.getCategories().stream().map(c -> c.getId()).toList()));
			}
			return budgets.values().stream().toList();
		} catch (Exception e) {
			throw new BusinessException("Error getting budgets", e);
		}
	}

	public BudgetDto getBudgetById(Long budgetId) {
		try {
			return budgetRepository.getBudgetById(budgetId, userService.getCurrentUserId());
		} catch (Exception e) {
			throw new BusinessException("Error getting budget", e);
		}	
	}

	public BudgetDto postBudget(BudgetDto budgetDto) {
		try {
			budgetRepository.postBudget(budgetDto, userService.getCurrentUserId());
			return budgetDto;
		} catch (Exception e) {
			throw new BusinessException("Error creating budget", e);
		}
	}

	public void putBudget(Long budgetId, BudgetDto budgetDto) {
		try {
			budgetRepository.putBudget(budgetId, budgetDto, userService.getCurrentUserId());
		} catch (Exception e) {
			throw new BusinessException("Error updating budget", e);
		}
	}

	public void deleteBudget(Long budgetId) {
		try {
			budgetRepository.deleteBudget(budgetId, userService.getCurrentUserId());
		} catch (Exception e) {
			throw new BusinessException("Error deleting budget", e);
		}
	}
}
