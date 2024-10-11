package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Error while getting the category types.")
public class GetCatTypesException extends RuntimeException {

	public GetCatTypesException(String message, Throwable cause) {
		super(message, cause);
	}	
}
