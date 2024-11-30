import dotenv from "dotenv";
import path from "path";
dotenv.config({
	encoding: "utf-8",
	debug:
		process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test"
			? true
			: true,
	path: path.resolve(__dirname, ".env"),
});

import express from "express";
import helmet from "helmet";
import cors from "cors";
import AccountsController from "./controllers/AccountsController";
import AccountService from "./services/AccountService";
import AccountRepository from "./repositories/AccountRepository";
import http from "http";
import { Server } from "socket.io";
import SocketService from "./services/SocketService";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));
app.use(
	cors({
		origin: ["http://localhost:3001", "https://next-ts-chat-app.vercel.app"],
		methods: ["GET", "HEAD", "PUT", "POST", "PATCH", "DELETE"],
		credentials: true,
	})
);

const httpServer = http.createServer(app);

let io = new Server(httpServer);

new SocketService(io);

new AccountsController(
	"/api/v1/accounts",
	app,
	new AccountService(new AccountRepository())
);

app.all("*", (req, res) => {
	res.status(404).json({ statusCode: 404, data: null, message: "Not Found" });
});

export default httpServer;
