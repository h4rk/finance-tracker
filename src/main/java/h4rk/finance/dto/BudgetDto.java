package h4rk.finance.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class BudgetDto {
	private Long budgetId;
	private String name;
	private BigDecimal budgetAmount;
	private BigDecimal totalSpent;
	private List<Cat> categories;


	public BudgetDto() {
		this.categories = new ArrayList<>();
	}
}

