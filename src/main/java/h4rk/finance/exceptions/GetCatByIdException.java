package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Cat not found.")
public class GetCatByIdException extends RuntimeException {

    public GetCatByIdException(String message, Throwable cause) {
        super(message, cause);
    }
}
