import * as express from "express";

export {};

declare global {
	namespace Express {
		interface Request {
			error_name?: string; // Add your custom property here
		}
	}
}
