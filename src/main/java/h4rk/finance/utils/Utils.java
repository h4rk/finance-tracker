package h4rk.finance.utils;

import java.sql.Date;
import java.util.Calendar;

public class Utils {
	public static int currentMonth() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.MONTH)+1;
	}

	public static int currentYear() {
		Calendar calendar = Calendar.getInstance();
		return calendar.get(Calendar.YEAR);
	}

	public static Date currentSqlDate() {
		return new Date(Calendar.getInstance().getTimeInMillis());
	}
	
}
