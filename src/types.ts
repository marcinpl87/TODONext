export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
};

export type UserObject = {
	id: string;
	name: string;
};

export enum LOGIN_ACTIONS {
	LOGIN = 'login',
	LOGOUT = 'logout',
}

export type LoginDispatch = {
	action: LOGIN_ACTIONS;
	userId: string;
	userName: string;
	users: UserObject[];
};

export type LoginState = {
	isLoggedIn: boolean;
	userId: string;
	userName: string;
	users: UserObject[];
};

export type Project = {
	id: string;
	userId: string;
	title: string;
	description: string;
	creationTimestamp: number;
};

export type Subtasks = { data: { task: string; isDone: boolean }[] };

export type Todo = {
	id: string;
	date: Date | null | undefined;
	title: string;
	isDone: boolean;
	userId: string;
	projectId: string;
	description: string;
	subtasks: Subtasks;
	estimatedTime: number;
	doneTimestamp: number;
	creationTimestamp: number;
};

export type Property = {
	id: string;
	creationTimestamp: number;
	name: string;
	address: string;
	floor: number;
	code: string;
	wifiSsid: string;
	wifiPass: string;
	rooms: number;
	lockIn: string;
	lockOut: string;
	safe: string;
	insuranceName: string;
	insuranceDate: string;
	insuranceNumber: string;
	notes: string;
};

export type Tenant = {
	id: string;
	creationTimestamp: number;
	name: string;
	senderName: string;
	idNumber: string;
	nationalInsuranceNumber: string;
	birthDate: string;
	email: string;
	phone: string;
	address: string;
	roomId: string;
	apartmentId: string;
	rent: number;
	rentFirstMonth: string;
	rentFirstRent: number;
	deposit: number;
	account: string;
	accountDeposit: string;
	iceName: string;
	iceLastname: string;
	iceIdNumber: string;
	iceNationalInsuranceNumber: string;
	iceEmail: string;
	icePhone: string;
	iceAddress: string;
	insuranceName: string;
	insuranceNumber: string;
	insuranceDate: string;
	contractDate: string;
	contractDateStart: string;
	contractDateEnd: string;
	contractDateHandoff: string;
	notes: string;
	isContract: boolean;
	isDeposit: boolean;
	is1stRent: boolean;
	isInsurance: boolean;
	isWarranty: boolean;
	isKey: boolean;
	isProtocol: boolean;
	status: number;
};

export type AspspTransaction = {
	date: string;
	amount: string;
	receiver: string;
	description: string;
};

export type AspspResponse =
	| AspspTransaction[]
	| { result: string; response: any };

export type ApiTransaction = {
	date: Date | null | undefined;
	amount: number | null;
	categoryId: string | null;
};

export type Transaction = Pick<AspspTransaction, 'description' | 'receiver'> &
	Pick<ApiTransaction, 'date' | 'amount' | 'categoryId'> & {
		id: string;
		userId: string;
		creationTimestamp: number;
		isManual: boolean;
	};
