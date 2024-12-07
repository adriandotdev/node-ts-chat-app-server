import {
	ChatMessage,
	IChatMessageRepository,
} from "../interfaces/IChatMessageRepository";
import pool from "../config/mysql";

class ChatMessageRepository implements IChatMessageRepository {
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

	GetChatList(id: number) {
		return new Promise<any>((resolve, reject) => {
			const QUERY = `
			
				SELECT
					messages.from_user_id AS id,
					accounts.given_name AS name,
					messages.message
				FROM
					accounts
				INNER JOIN messages ON accounts.id = messages.from_user_id
				WHERE 
					messages.to_user_id = ?
				ORDER BY 
					messages.date_created DESC
				LIMIT 1;
			`;

			pool.query(QUERY, [id], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}
}

export default ChatMessageRepository;
