package h4rk.finance.dto;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

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
	private Long catId;
	private String catName;
	private List<String> catNames = new ArrayList<>();
}
