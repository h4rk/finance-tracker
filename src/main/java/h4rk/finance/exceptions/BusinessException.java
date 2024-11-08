package h4rk.finance.exceptions;

public class BusinessException extends RuntimeException {

	private final int errorCode;
	
	public BusinessException(String message) {
		super(message);
		errorCode = 500;
	}

	public BusinessException(String message, Throwable cause) {
		super(message, cause);
		errorCode = 500;
	}

	public BusinessException(int errorCode, String message, Throwable cause) {
		super(message, cause);
		this.errorCode = errorCode;
	}

	public BusinessException(int errorCode, String message) {
		super(message);
		this.errorCode = errorCode;
	}

	public int getErrorCode() {
		return errorCode;
	}
	
}
