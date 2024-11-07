package h4rk.finance.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class BudgetDto {
	private Long budgetId;
	private String name;
	private BigDecimal amount;
}
