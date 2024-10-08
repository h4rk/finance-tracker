package h4rk.finance.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Mov {

	private long id;
	private String description;
	private double amount;
	private Date date;
	private boolean isIncome;

	public Mov(String description, double amount, Date date, boolean isIncome) {
		this.description = description;
		this.amount = amount;
		this.date = date;
		this.isIncome = isIncome;
	}
}
