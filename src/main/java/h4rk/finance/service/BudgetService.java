package h4rk.finance.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import h4rk.finance.dto.BudgetDto;
import h4rk.finance.dto.Cat;
import h4rk.finance.exceptions.BusinessException;
import h4rk.finance.repository.BudgetCategoryRepository;
import h4rk.finance.repository.BudgetRepository;
import h4rk.finance.security.service.UserService;

@Service
public class BudgetService {

	@Autowired
	private BudgetRepository budgetRepository;

	@Autowired
	private BudgetCategoryRepository budgetCategoryService;

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
			BudgetDto bDto = budgetRepository.getBudgetById(budgetId, userService.getCurrentUserId());
			bDto.setTotalSpent(budgetRepository.getBudgetCurrentImport(userService.getCurrentUserId(),
								bDto.getCategories().stream().map(c -> c.getId()).toList()));
			return bDto;
		} catch (Exception e) {
			throw new BusinessException("Error getting budget", e);
		}	
	}

	@Transactional(rollbackFor = Exception.class)
	public BudgetDto postBudget(BudgetDto budgetDto) {
		try {
			Long budgetId = budgetRepository.postBudget(budgetDto, userService.getCurrentUserId());
			if(budgetDto.getCategories() != null && !budgetDto.getCategories().isEmpty()) {
				budgetCategoryService.postBudgetCategories(budgetId, 
					budgetDto.getCategories().stream().map(Cat::getId).toList());
			}
			return budgetDto;
		} catch (Exception e) {
			throw new BusinessException("Error creating budget", e);
		}
	}

	@Transactional(rollbackFor = Exception.class)
	public void putBudget(Long budgetId, BudgetDto newBudgetDto) {
		try {
			BudgetDto olBudgetDto = budgetRepository.getBudgetById(budgetId, userService.getCurrentUserId());
			budgetRepository.putBudget(budgetId, newBudgetDto, userService.getCurrentUserId());
			if (olBudgetDto.getCategories() != null && !olBudgetDto.getCategories().isEmpty()) {
				budgetCategoryService.deleteAllBudgetCategories(budgetId);
			}
			if(newBudgetDto.getCategories() != null && !newBudgetDto.getCategories().isEmpty()) {
				budgetCategoryService.postBudgetCategories(budgetId, 
					newBudgetDto.getCategories().stream().map(Cat::getId).toList());
			}
		} catch (Exception e) {
			throw new BusinessException("Error updating budget", e);
		}
	}

	@Transactional(rollbackFor = Exception.class)
	public void deleteBudget(Long budgetId) {
		try {
			budgetCategoryService.deleteAllBudgetCategories(budgetId);
			budgetRepository.deleteBudget(budgetId, userService.getCurrentUserId());
		} catch (Exception e) {
			throw new BusinessException("Error deleting budget", e);
		}
	}
}
