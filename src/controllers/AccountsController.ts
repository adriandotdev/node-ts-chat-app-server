import {
	Application,
	NextFunction,
	Request as ExpressRequest,
	Response,
} from "express";
import { IAccountService } from "../interfaces/IAccountService";
import { HttpBadRequest, HttpError } from "../utils/HttpError";
import { body, validationResult } from "express-validator";

class AccountsController {
	private app: Application;
	private basePath: string;
	private service: IAccountService;

	constructor(basePath: string, app: Application, service: IAccountService) {
		this.app = app;
		this.basePath = basePath;
		this.service = service;

		this.Initialize();
	}

	Initialize() {
		interface Request extends ExpressRequest {
			user?: string;
			error_name?: string;
		}

		const validate = (req: Request, res: Response) => {
			const ERRORS = validationResult(req);

			if (!ERRORS.isEmpty()) {
				throw new HttpBadRequest("Bad Request", ERRORS.mapped());
			}
		};

		this.app.post(
			this.basePath.concat("/register"),
			[
				body("given_name")
					.notEmpty()
					.withMessage("Property: given_name must be provided"),
				body("middle_name")
					.notEmpty()
					.withMessage("Property: middle_name must be provided"),
				body("last_name")
					.notEmpty()
					.withMessage("Property: last_name must be provided"),
				body("username")
					.notEmpty()
					.withMessage("Property: username must be provided")
					.isLength({ min: 8 })
					.withMessage("Property: username must be at least 8 characters long"),
				body("password")
					.notEmpty()
					.withMessage("Property: password must be provided")
					.isLength({ min: 8 })
					.withMessage("Property: password must be at least 8 characters long"),
			],
			(req: Request, res: Response, next: NextFunction) => {
				(async () => {
					try {
						validate(req, res);

						const { given_name, middle_name, last_name, username, password } =
							req.body;

						const result = await this.service.Register({
							givenName: given_name,
							middleName: middle_name,
							lastName: last_name,
							username: username,
							password: password,
						});

						return res
							.status(201)
							.json({ statusCode: 201, data: result, message: "Created" });
					} catch (err) {
						req.error_name = "REGISTER_ERROR";
						next(err);
					}
				})().catch(next); // Catch any unhandled promise rejection and pass it to next
			}
		);

		this.app.post(
			this.basePath.concat("/login"),
			[
				body("username")
					.notEmpty()
					.withMessage("Property: username must be provided"),
				body("password")
					.notEmpty()
					.withMessage("Property: password must be provided"),
			],
			(req: Request, res: Response, next: NextFunction) => {
				(async () => {
					try {
						validate(req, res);

						const { username, password } = req.body;

						const result = await this.service.Login({ username, password });

						return res
							.status(200)
							.json({ statusCode: 200, data: result, message: "OK" });
					} catch (err) {
						req.error_name = "LOGIN_ERROR";
						next(err);
					}
				})().catch(next);
			}
		);

		this.app.use(
			(err: HttpError, req: Request, res: Response, next: NextFunction) => {
				console.error({
					API_REQUEST_ERROR: {
						error_name: req.error_name || "UNKNOWN_ERROR",
						message: err.message,
						stack: err.stack?.replace(/\\/g, "/"), // Include stack trace for debugging
						request: {
							method: req.method,
							url: req.url,
							code: err instanceof HttpError ? err?.GetStatus() : 500,
						},
						data: err instanceof HttpError ? err?.GetData() : [],
					},
				});

				const status = err instanceof HttpError ? err?.GetStatus() : 500;
				const message = err.message || "Internal Server Error";

				res.status(status).json({
					status,
					data: err instanceof HttpError ? err?.GetData() : [],
					message,
				});
			}
		);
	}
}

export default AccountsController;
