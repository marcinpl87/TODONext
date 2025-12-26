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
		isHidden: boolean;
		amountCustom: number | null;
		descriptionCustom: string | null;
	};

export type TransactionEdit = (
	id: string,
	name: string,
	value: string | boolean,
) => void;

export type TransactionDelete = (id: string) => void;

export type Category = {
	id: string;
	name: string;
};

export type Budget = {
	category: string;
	total: number;
	[key: string]: string | number; // for dynamic month fields
};
