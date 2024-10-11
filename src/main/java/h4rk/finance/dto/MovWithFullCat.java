package h4rk.finance.dto;

import java.sql.Date;
import java.util.Map;

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
public class MovWithFullCat {
	private long id;
	private String description;
	private double amount;
	private Date date;
	private boolean isIncome;
	Map<Long, String> catIds;
}
