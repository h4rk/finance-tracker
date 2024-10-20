package h4rk.finance.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Error while posting the cat.")
public class PostCatsException extends RuntimeException {

    public PostCatsException(String message, Throwable cause) {
        super(message, cause);
    }
}
