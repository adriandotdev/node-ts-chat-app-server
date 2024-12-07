import { ChatMessage } from "./IChatMessageRepository";

export interface IChatMessageService {
	SendMessage(chatMessage: ChatMessage): Promise<void>;
	GetChatList(id: number): Promise<any>;
}
