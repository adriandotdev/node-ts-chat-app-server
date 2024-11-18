enum HTTP_STATUS_CODE {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	UNPROCESSABLE_ENTITY = 422,
	INTERNAL_SERVER_ERROR = 500,
}

export class HttpError extends Error {
	private status: HTTP_STATUS_CODE;
	private data: any;

	constructor({
		name,
		status,
		message,
		data,
	}: {
		name: string;
		status: number;
		message: string;
		data: any;
	}) {
		super(message);
		this.status = status;
		this.data = data;
		this.name = name;
		Error.captureStackTrace(this);
	}

	public GetStatus(): HTTP_STATUS_CODE {
		return this.status;
	}

	public GetData(): any {
		return this.data;
	}
}

export class HttpBadRequest extends HttpError {
	constructor(message: string, data: any) {
		super({
			name: "Bad Request",
			status: HTTP_STATUS_CODE.BAD_REQUEST,
			data,
			message,
		});
	}
}

export class HttpNotFound extends HttpError {
	constructor(message: string, data: any) {
		super({
			name: "Not Found",
			status: HTTP_STATUS_CODE.NOT_FOUND,
			data,
			message,
		});
	}
}

export class HttpForbidden extends HttpError {
	constructor(message: string, data: any) {
		super({
			name: "Forbidden",
			status: HTTP_STATUS_CODE.FORBIDDEN,
			data,
			message,
		});
	}
}

export class HttpUnprocessableEntity extends HttpError {
	constructor(message: string, data: any) {
		super({
			name: "",
			status: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY,
			data,
			message,
		});
	}
}

export class HttpUnauthorized extends HttpError {
	constructor(message: string, data: any) {
		super({
			name: "Unauthorized",
			status: HTTP_STATUS_CODE.UNAUTHORIZED,
			data,
			message,
		});
	}
}

export class HttpInternalServerError extends HttpError {
	constructor(message: string, data: any) {
		super({
			name: "Internal Server Error",
			status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
			data,
			message,
		});
	}
}
