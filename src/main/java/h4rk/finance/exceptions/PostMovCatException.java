package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Error while posting the category types.")
public class PostMovCatException extends RuntimeException {

	public PostMovCatException(String message, Throwable cause) {
		super(message, cause);
	}
	
}
