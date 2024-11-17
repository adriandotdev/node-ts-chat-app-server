import { Application, NextFunction, Request, Response } from "express";

class AccountsController {
	private app: Application;
	private basePath: string;

	constructor(basePath: string, app: Application) {
		this.app = app;
		this.basePath = basePath;

		this.Initialize();
	}

	Initialize() {
		this.app.get(
			this.basePath + "/accounts/register",
			[],
			async (req: Request, res: Response, next: NextFunction) => {
				try {
				} catch (err) {
					req.error_name = "REGISTER_ERROR";
					next(err);
				}
			}
		);
	}
}

export default AccountsController;
