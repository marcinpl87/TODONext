'use client';

import React from 'react';
import TransactionCreate from '../../components/TransactionCreate';
import TransactionImport from '../../components/TransactionImport';
import TransactionTable from '../../components/TransactionTable';
import BudgetTable from '../../components/BudgetTable';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import { useLogin } from '../../hooks/app';
import { useTransactions } from '../../hooks/transactions';

const Bank: React.FC = () => {
	const login = useLogin();

	const {
		transactions,
		budget,
		categories,
		add,
		update,
		remove,
		doImport,
		isLoading,
		isImportLoading,
		error,
	} = useTransactions(login.userId);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="my-5 text-2xl font-bold">Bank</h1>
			<div className="w-full flex flex-col md:flex-row">
				<div className="flex-1 flex justify-center items-start">
					<TransactionCreate addTransaction={add} />
				</div>
				<div className="flex-1 flex justify-center items-start">
					<TransactionImport
						importBankData={doImport}
						isLoading={isImportLoading}
						errors={error || ''}
					/>
				</div>
			</div>
			{budget && Array.isArray(budget) && budget.length > 0 && (
				<BudgetTable categories={categories} budget={budget} />
			)}
			{transactions &&
				Array.isArray(transactions) &&
				transactions.length > 0 && (
					<TransactionTable
						categories={categories}
						transactions={transactions}
						editTransaction={update}
						deleteTransaction={remove}
					/>
				)}
		</div>
	);
};

export default Bank;
