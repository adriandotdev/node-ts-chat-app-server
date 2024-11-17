import { Request } from "express";

declare global {
	namespace Express {
		interface Request {
			error_name?: string; // Add your custom property here
		}
	}
}
