package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Error while deleting the mov.")
public class DeleteMovException extends RuntimeException {

    public DeleteMovException(String message, Throwable cause) {
        super(message, cause);
    }
}
