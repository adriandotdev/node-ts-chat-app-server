import { AccountRegister } from "./IAccountService";

export interface IAccountRepository {
	Register(accountRegister: AccountRegister): Promise<any>;
	Login(accountLogin: AccountLogin): Promise<any>;
	FindAccountByUsername(username: string): Promise<any>;
}

export type AccountLogin = {
	username: string;
	password: string;
};
