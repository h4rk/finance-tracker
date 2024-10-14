package h4rk.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class MonthlyRecap {
	private double monthlyIncome;
	private double monthlyExpense;
}
