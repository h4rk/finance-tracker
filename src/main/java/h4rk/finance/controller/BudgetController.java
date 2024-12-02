package h4rk.finance.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import h4rk.finance.dto.BudgetDto;
import h4rk.finance.service.BudgetService;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping("/budgets")
    public ResponseEntity<List<BudgetDto>> getBudgets() {
        return ResponseEntity.ok(budgetService.getBudgets());
    }

    @GetMapping("/budgets/{budgetId}")
    public ResponseEntity<?> getBudgetById(@PathVariable Long budgetId) {
        return ResponseEntity.ok(budgetService.getBudgetById(budgetId));
    }

    @PostMapping("/budgets")
    public ResponseEntity<?> createBudget(@RequestBody BudgetDto budgetDto) {
        return ResponseEntity.ok(budgetService.postBudget(budgetDto));
    }

    @PutMapping("/budgets/{budgetId}")
    public ResponseEntity<?> updateBudget(@PathVariable Long budgetId, @RequestBody BudgetDto budgetDto) {
		budgetService.putBudget(budgetId, budgetDto);
        return ResponseEntity.ok(null);
    }

    @DeleteMapping("/budgets/{budgetId}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long budgetId) {
		budgetService.deleteBudget(budgetId);
		return ResponseEntity.ok(null);
    }
}
