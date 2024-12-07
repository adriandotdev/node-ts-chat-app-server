export interface IChatMessageRepository {
	SendMessage(message: ChatMessage): Promise<any>;
	GetChatList(id: number): Promise<any>;
}

export type ChatMessage = {
	message: string;
	sender?: number;
	receiver?: number;
};
