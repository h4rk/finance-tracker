package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Error while getting movs.")
public class GetMovsException extends RuntimeException {

    public GetMovsException(String message, Throwable cause) {
        super(message, cause);
    }
}
