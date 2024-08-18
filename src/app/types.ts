export type UserObject = {
	id: string;
	name: string;
};

export enum LOGIN_ACTIONS {
	LOGIN = 'login',
	LOGOUT = 'logout',
}

export type LoginState = boolean;
