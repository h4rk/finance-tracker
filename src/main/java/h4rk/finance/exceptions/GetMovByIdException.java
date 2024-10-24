package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Mov not found.")
public class GetMovByIdException extends RuntimeException {

    public GetMovByIdException(String message, Throwable cause) {
        super(message, cause);
    }
}
