package h4rk.finance.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import h4rk.finance.dto.BudgetDto;
import h4rk.finance.service.BudgetService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
public class BudgetContoller {

    @Autowired
    private BudgetService budgetService;

    @GetMapping("/budgets")
    public ResponseEntity<List<BudgetDto>> getBudgets() {
        return ResponseEntity.ok(null); // TODO: Implement
    }

    @GetMapping("/budgets/{id}")
    public ResponseEntity<?> getBudgetById() {
        return ResponseEntity.ok("Budget");
    }

    @PostMapping("/budgets")
    public ResponseEntity<?> createBudget() {
        return ResponseEntity.ok("Budget created");
    }

    @PutMapping("/budgets/{id}")
    public ResponseEntity<?> updateBudget() {
        return ResponseEntity.ok("Budget updated");
    }

    @DeleteMapping("/budgets/{id}")
    public ResponseEntity<?> deleteBudget() {
        return ResponseEntity.ok("Budget deleted");
    }
}
