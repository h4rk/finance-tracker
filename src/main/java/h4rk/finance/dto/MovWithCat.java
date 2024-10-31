package h4rk.finance.dto;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovWithCat {

	private Long id;
	private String description;
	private double amount;
	private Date date;
	private boolean isIncome;
	List<Long> catIds;
	
}
