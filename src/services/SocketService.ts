import { Server, Namespace, Socket } from "socket.io";
import JWT from "../utils/JWT";
import { IChatMessageService } from "../interfaces/IChatMessageService";
import ChatMessageService from "./ChatMessageService";
import ChatMessageRepository from "../repositories/ChatMessageRepository";

type Room = {
	key?: string;
	value?: { user_id?: number; room_id: string | string[] };
};

class SocketService {
	private io: Server;
	private chatNamespace!: Namespace;
	private chatService: IChatMessageService;
	private activeRooms: Room[] = [];

	constructor(io: Server) {
		this.io = io;
		this.chatService = new ChatMessageService(new ChatMessageRepository());

		this.InitializeSocketServer();
	}

	public InitializeSocketServer() {
		this.chatNamespace = this.io.of("/chats");

		interface SocketExtenstion extends Socket {
			userID?: number;
			username?: string;
		}

		this.chatNamespace.use(async (socket: SocketExtenstion, next) => {
			try {
				const token =
					socket.handshake.auth.token ||
					String(socket.handshake.query.token).split(" ")[1];

				const decoded = JWT.Verify(token, String(process.env.TOKEN_ACCESS_KEY));

				socket.userID = decoded.data.id;
				socket.username = decoded.data.username;

				next();
			} catch (error) {
				if (error instanceof Error) next(error);

				next(new Error("Invalid token"));
			}
		});

		this.chatNamespace.on("connection", (clientSocket: SocketExtenstion) => {
			console.log("New Client Connected");

			console.log(clientSocket.userID, clientSocket.username);

			let clientID = clientSocket.id;
			this.activeRooms.push({
				key: clientSocket.username,
				value: { user_id: clientSocket.userID, room_id: clientID },
			});
			clientSocket.join(clientID);

			console.log("Current Active Rooms: ", this.activeRooms);

			clientSocket.on(
				"send_chat",
				async (
					payload: { room: string | string[]; message: string },
					ack: (response: { message: string; error?: string }) => void
				) => {
					console.log(`FROM: ${clientSocket.username}`, payload);

					const receiver = this.activeRooms.find(
						(room) => room.key === payload.room
					);

					await this.chatService.SendMessage({
						message: payload.message,
						receiver: receiver?.value?.user_id,
						sender: clientSocket.userID,
					});

					this.chatNamespace
						.to(String(receiver?.value?.room_id))
						.emit("new_chat", { message: payload.message });

					ack({ message: "Message sent successfully" });
				}
			);

			clientSocket.on("disconnect", () => {
				this.activeRooms = this.activeRooms.filter(
					(room) => room.key !== clientSocket.username
				);

				console.log("Current Active Rooms: ", this.activeRooms);
			});
		});
	}
}

export default SocketService;
