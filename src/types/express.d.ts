import * as express from "express";
import { Socket } from "socket.io";

export {};

declare global {
	namespace Express {
		interface Request {
			error_name?: string; // Add your custom property here
		}
	}
}
declare module "socket.io" {
	interface Socket {
		user_id?: string; // Extend with user_id or any other custom property
	}
}
