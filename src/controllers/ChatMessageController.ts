import {
	Application,
	Request as ExpressRequest,
	NextFunction,
	Response,
} from "express";
import { IChatMessageService } from "../interfaces/IChatMessageService";
import { validationResult } from "express-validator";
import { HttpBadRequest, HttpError } from "../utils/HttpError";
import JWT from "../utils/JWT";

class ChatMessageController {
	private basePath: string;
	private app: Application;
	private chatMessageService: IChatMessageService;

	constructor(
		basePath: string,
		app: Application,
		chatMessageService: IChatMessageService
	) {
		this.app = app;
		this.basePath = basePath;
		this.chatMessageService = chatMessageService;

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

		this.app.get(
			this.basePath.concat("/chats/list"),
			[],
			(req: Request, res: Response, next: NextFunction) => {
				(async () => {
					try {
						const token = req.cookies.token.access_token;

						const decoded = JWT.Verify(
							token,
							String(process.env.TOKEN_ACCESS_KEY)
						);

						const result = await this.chatMessageService.GetChatList(
							parseInt(decoded.data.id)
						);

						return res
							.status(200)
							.json({ statusCode: 200, data: result, message: "OK" });
					} catch (err) {
						req.error_name = "GET_CHAT_LIST_ERROR";
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

export default ChatMessageController;
