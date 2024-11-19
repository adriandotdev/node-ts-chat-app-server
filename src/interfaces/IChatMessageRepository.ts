export interface IChatMessageRepository {
	SendMessage(message: ChatMessage): Promise<any>;
}

export type ChatMessage = {
	message: string;
	sender?: number;
	receiver?: number;
};
