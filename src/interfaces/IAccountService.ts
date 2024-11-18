import { AccountLogin } from "./IAccountRepository";

export interface IAccountService {
	Register(payload: AccountRegister): Promise<any>;
	Login(payload: AccountLogin): Promise<any>;
}

export type AccountRegister = {
	givenName: string;
	middleName: string;
	lastName: string;
	username: string;
	password: string;
};
