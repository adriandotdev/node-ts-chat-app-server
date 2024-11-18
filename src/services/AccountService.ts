import {
	IAccountService,
	AccountRegister,
} from "../interfaces/IAccountService";

import {
	IAccountRepository,
	AccountLogin,
} from "../interfaces/IAccountRepository";

import bcrypt from "bcryptjs";
import { HttpBadRequest } from "../utils/HttpError";

class AccountService implements IAccountService {
	private repository: IAccountRepository;

	constructor(repository: IAccountRepository) {
		this.repository = repository;
	}

	async Register(payload: AccountRegister): Promise<any> {
		const account = await this.repository.FindAccountByUsername(
			payload.username
		);

		if (account.length) throw new HttpBadRequest("USERNAME_EXISTS", null);

		const hashedPassword = await bcrypt.hash(payload.password, 10);

		await this.repository.Register({
			...payload,
			password: hashedPassword,
		});

		return {
			given_name: payload.givenName,
			middle_name: payload.middleName,
			last_name: payload.lastName,
		};
	}

	async Login(payload: AccountLogin): Promise<any> {
		const account = await this.repository.FindAccountByUsername(
			payload.username
		);

		if (!account.length) throw new HttpBadRequest("INVALID_CREDENTIALS", null);

		const isMatch = await bcrypt.compare(payload.password, account[0].password);

		if (!isMatch) throw new HttpBadRequest("INVALID__CREDENTIALS", null);

		return "SUCCESS";
	}
}

export default AccountService;
