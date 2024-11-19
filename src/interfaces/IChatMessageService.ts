import { ChatMessage } from "./IChatMessageRepository";

export interface IChatMessageService {
	SendMessage(chatMessage: ChatMessage): Promise<void>;
}
