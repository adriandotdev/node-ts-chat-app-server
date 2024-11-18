import pool from "../config/mysql";
import {
	IAccountRepository,
	AccountLogin,
} from "../interfaces/IAccountRepository";

import { AccountRegister } from "../interfaces/IAccountService";

import { ResultSetHeader } from "mysql2";

class AccountRepository implements IAccountRepository {
	FindAccountByUsername(username: string): Promise<ResultSetHeader> {
		return new Promise<ResultSetHeader>((resolve, reject) => {
			const QUERY = `
                SELECT * FROM accounts WHERE username =?;
            `;

			pool.query<ResultSetHeader>(QUERY, [username], (err, result) => {
				if (err) reject(err);

				resolve(result);
			});
		});
	}

	Register(accountRegister: AccountRegister): Promise<ResultSetHeader> {
		return new Promise<ResultSetHeader>((resolve, reject) => {
			const QUERY = `
                INSERT INTO 
                    accounts (given_name, middle_name, last_name, username, password) 
                VALUES 
                    (?,?,?,?,?)
            `;
			pool.query<ResultSetHeader>(
				QUERY,
				[
					accountRegister.givenName,
					accountRegister.middleName,
					accountRegister.lastName,
					accountRegister.username,
					accountRegister.password,
				],
				(err, result) => {
					if (err) reject(err);

					resolve(result);
				}
			);
		});
	}

	async Login(accountLogin: AccountLogin): Promise<void> {}
}

export default AccountRepository;
