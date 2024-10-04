package h4rk.finance.dto;

import java.sql.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Mov {

	private long id;
	private String description;
	private double amount;
	private Date date;
	private boolean isIncome;
}
