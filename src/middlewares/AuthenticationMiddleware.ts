import { Request, Response, NextFunction } from "express";

class AuthenticationMiddleware {
	AccessTokenVerifier() {
		return async (req: Request, res: Response, next: NextFunction) => {};
	}
}

export default AuthenticationMiddleware;
