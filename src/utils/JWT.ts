import jwt from "jsonwebtoken";
import { HttpInternalServerError, HttpUnauthorized } from "./HttpError";

class JWTBuilder {
	public data!: any;
	private secretKey!: string;
	private type!: string;
	private expiration!: number | string;

	public SecretKey(secretKey: string): JWTBuilder {
		this.secretKey = secretKey;
		return this;
	}

	public Type(type: string): JWTBuilder {
		this.type = type;
		return this;
	}

	public Expiration(expiration: number | string): JWTBuilder {
		this.expiration = expiration;
		return this;
	}

	public Data(data: any): JWTBuilder {
		this.data = data;
		return this;
	}

	public Build(): JWT {
		if (this.secretKey == null || this.type == null || this.expiration == null)
			throw new HttpInternalServerError(
				"JWT must have a secret key or expiration string",
				null
			);

		return new JWT(this.data, this.secretKey, this.type, this.expiration);
	}
}

class JWT {
	private data: any;
	private secretKey: string;
	private type: string;
	private expiration: number | string;

	constructor(
		data: any,
		secretKey: string,
		type: string,
		expiration: number | string
	) {
		this.data = data;
		this.secretKey = secretKey;
		this.type = type;
		this.expiration = expiration;
	}

	public Sign(): string {
		const token = jwt.sign(
			{
				data: this.data,
				type: this.type,
				exp: this.expiration,
			},
			this.secretKey
		);
		return token;
	}

	public static Verify(token: string, secretKey: string): any | object {
		try {
			const decoded = jwt.verify(token, secretKey);
			return decoded;
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError)
				throw new HttpUnauthorized("UNAUTHORIZED", null);

			if (error instanceof jwt.TokenExpiredError)
				throw new HttpUnauthorized("UNAUTHORIZED", null);

			throw new HttpInternalServerError("INTERNAL_SERVER_ERROR", null);
		}
	}
	public static Builder(): JWTBuilder {
		return new JWTBuilder();
	}
}

export default JWT;
