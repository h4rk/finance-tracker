package h4rk.finance.controller.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import h4rk.finance.exceptions.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class ExceptionHandlerController {
	
	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<String> handleBusinessException(HttpServletRequest req, HttpServletResponse res, BusinessException e) {
		log.error("BusinessException: [{}]", e.getMessage());
		while (e.getCause() != null) {
			e = (BusinessException) e.getCause();
			log.error("Caused by: [{}]", e.getMessage());
		}
		return new ResponseEntity<>(e.getMessage(), mapErrorMessage(e));
	}

	private HttpStatus mapErrorMessage(BusinessException e) {
		switch (e.getErrorCode()) {
		case 400:
			return HttpStatus.BAD_REQUEST;
		case 404:
			return HttpStatus.NOT_FOUND;
		default:
			return HttpStatus.INTERNAL_SERVER_ERROR;
		}
	}

}
