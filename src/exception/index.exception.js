class InvalidParamsError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 400;
        this.name = 'InvalidParamsError';
        if (!message) this.message = '요청한 데이터 형식이 올바르지 않습니다.';
    }
}

class ValidationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 400;
        this.name = 'ValidationError';
        if (!message) this.message = '알 수 없는 오류가 발생했습니다.';
    }
}

class AuthenticationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 403;
        this.name = 'AuthenticationError';
        if (!message) this.message = '로그인이 필요한 서비스입니다.';
    }
}

module.exports = { InvalidParamsError, ValidationError, AuthenticationError };
