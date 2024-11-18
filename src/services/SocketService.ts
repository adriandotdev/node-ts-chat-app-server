import { Server, Namespace } from "socket.io";

class SocketService {
	private io: Server;
	private chatNamespace!: Namespace;

	constructor(io: Server) {
		this.io = io;

		this.InitializeSocketServer();
	}

	public InitializeSocketServer() {
		this.chatNamespace = this.io.of("/chats");

		this.chatNamespace.on("connection", (clientSocket) => {
			console.log("New Client Connected");

			clientSocket.on(
				"join_chat",
				(
					payload: { room: string | string[] },
					ack: (response: { message: string; error?: string }) => void
				) => {
					clientSocket.join(payload.room);

					ack({ message: "User connected successfully in chat" });
				}
			);

			clientSocket.on(
				"send_chat",
				(
					payload: { room: string | string[]; message: string },
					ack: (response: { message: string; error?: string }) => void
				) => {
					this.chatNamespace
						.to(payload.room)
						.emit("new_chat", { message: payload.message });

					ack({ message: "Message sent successfully" });
				}
			);
		});
	}
}

export default SocketService;
