package h4rk.finance.dto;

import lombok.Data;

@Data
public class BudgetDto {
	private Long budget_id;
	private String name;
	private double amount;
}
