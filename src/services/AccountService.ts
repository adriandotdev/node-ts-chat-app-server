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
import JWT from "../utils/JWT";

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

		const accessToken = JWT.Builder()
			.Data({
				id: account[0].id,
				username: payload.username,
			})
			.Expiration(Math.floor(Date.now() / 1000) + 60 * 1)
			.SecretKey(process.env.TOKEN_ACCESS_KEY || "")
			.Type("Bearer")
			.Build();

		const refreshToken = JWT.Builder()
			.Data({
				id: account[0].id,
				username: payload.username,
			})
			.Expiration(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30)
			.SecretKey(process.env.TOKEN_REFRESH_KEY || "")
			.Type("Bearer")
			.Build();

		const access_token = accessToken.Sign();
		const refresh_token = refreshToken.Sign();

		return { access_token, refresh_token };
	}
}

export default AccountService;
