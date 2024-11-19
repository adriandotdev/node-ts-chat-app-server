import { ChatMessage } from "../interfaces/IChatMessageRepository";
import pool from "../config/mysql";

class ChatMessageRepository {
	SendMessage(message: ChatMessage): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const QUERY = `
            
                INSERT INTO
                    messages (message, to_user_id, from_user_id)
                VALUES
                    (?,?,?)
            `;

			pool.query(
				QUERY,
				[message.message, message.receiver, message.sender],
				(err, result) => {
					if (err) reject(err);

					resolve(result);
				}
			);
		});
	}
}

export default ChatMessageRepository;
