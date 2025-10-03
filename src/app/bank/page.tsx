'use client';

import React, { useCallback, useEffect, useState } from 'react';
import TransactionCreate from '../../components/TransactionCreate';
import TransactionImport from '../../components/TransactionImport';
import TransactionTable from '../../components/TransactionTable';
import { useLogin } from '../../hooks';
import type { Transaction } from '../../types';

const Bank: React.FC = () => {
	const login = useLogin();
	const [errors, setErrors] = useState<string>('');
	const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
	const [transactionsState, setTransactionsState] = useState<Transaction[]>(
		[],
	);

	const importBankData = useCallback(async () => {
		setIsImportLoading(true);
		const url = '/api/aspsp/toshl?mode=importIncremental';
		fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(async data => {
				if (data?.importedTransactions) {
					setTransactionsState(prev => [
						...data.importedTransactions,
						...prev,
					]);
				} // there are transactions so there are no errors
				else {
					setErrors(JSON.stringify(data));
				} // there are no transactions so we assume there are errors
				setIsImportLoading(false);
			});
	}, []);

	const addTransaction = (transaction: Transaction, callback: () => void) => {
		const cache = [...transactionsState];
		setTransactionsState([transaction, ...transactionsState]);
		callback();
		fetch('/api/transaction', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: login.userId,
				transaction,
			}),
		}).catch(() => {
			setTransactionsState([...cache]); // revert back to the previous state
		});
	};

	const editTransaction = (id: string, categoryId: string) => {
		setTransactionsState(prev =>
			prev.map(tx => (tx.id === id ? { ...tx, categoryId } : tx)),
		);
	};

	useEffect(() => {
		fetch('/api/transaction', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then((data: { data: Transaction[] }) => {
				if (data?.data) {
					setTransactionsState(data.data || []);
				}
			});
	}, []);

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="my-5 text-2xl font-bold">Bank</h1>
			<div className="w-full flex flex-col md:flex-row">
				<div className="flex-1 flex justify-center items-start">
					<TransactionCreate addTransaction={addTransaction} />
				</div>
				<div className="flex-1 flex justify-center items-start">
					<TransactionImport
						importBankData={importBankData}
						isLoading={isImportLoading}
						errors={errors}
					/>
				</div>
			</div>
			<TransactionTable
				transactions={transactionsState}
				editTransaction={editTransaction}
			/>
		</div>
	);
};

export default Bank;
