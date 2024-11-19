import {
	ChatMessage,
	IChatMessageRepository,
} from "../interfaces/IChatMessageRepository";
import { IChatMessageService } from "../interfaces/IChatMessageService";

class ChatMessageService implements IChatMessageService {
	private repository: IChatMessageRepository;

	constructor(repository: IChatMessageRepository) {
		this.repository = repository;
	}

	async SendMessage(chatMessage: ChatMessage): Promise<void> {
		const result = await this.repository.SendMessage(chatMessage);

		return result;
	}
}

export default ChatMessageService;
