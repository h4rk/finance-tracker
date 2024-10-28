package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Error while deleting the cat.")
public class PutMovException extends RuntimeException {
	public PutMovException(String message, Throwable cause) {
        super(message, cause);
	}
}
