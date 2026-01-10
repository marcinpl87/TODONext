'use client';

import { useState, useEffect } from 'react';
import {
	Budget,
	Category,
	Transaction,
	TransactionDelete,
	TransactionEdit,
} from '../types/financial';

export const useTransactions = (userId: string) => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [budget, setBudget] = useState<Budget[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isCategoriesLoading, setIsCategoriesLoading] =
		useState<boolean>(true);
	const [isImportLoading, setIsImportLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [categoriesError, setCategoriesError] = useState<string | null>(null);
	useEffect(() => {
		const fetchTransactions = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const response = await fetch('/api/transaction', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok) {
					if (response.status === 401) {
						// Token expired or invalid, redirect to login
						localStorage.removeItem('authToken');
						window.location.reload();
						return;
					}
					throw new Error('Failed to fetch transactions');
				}
				const data = await response.json();
				setTransactions(data?.data || []);
				setBudget(data?.budgetData || []);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred');
				}
			} finally {
				setIsLoading(false);
			}
		};
		const fetchCategories = async () => {
			setIsCategoriesLoading(true);
			setCategoriesError(null);
			try {
				const response = await fetch('/api/category', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('authToken')}`,
						'Content-Type': 'application/json',
					},
				});
				if (!response.ok) {
					if (response.status === 401) {
						// Token expired or invalid, redirect to login
						localStorage.removeItem('authToken');
						window.location.reload();
						return;
					}
					throw new Error('Failed to fetch categories');
				}
				const data = await response.json();
				setCategories(data?.data || []);
			} catch (err) {
				if (err instanceof Error) {
					setCategoriesError(err.message);
				} else {
					setCategoriesError('An unknown error occurred');
				}
			} finally {
				setIsCategoriesLoading(false);
			}
		};
		fetchTransactions();
		fetchCategories();
	}, []);
	const add = (transaction: Transaction, callback: () => void) => {
		const cache = [...transactions];
		setTransactions([transaction, ...transactions]);
		callback();
		fetch('/api/transaction', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				transaction,
			}),
		}).catch(() => {
			setTransactions([...cache]); // revert back to the previous state
		});
	};
	const update: TransactionEdit = (id, name, value) => {
		fetch(`/api/transaction/${id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				transaction: {
					[name]: value,
				},
			}),
		});
	};
	const remove: TransactionDelete = id => {
		fetch(`/api/transaction/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('authToken')}`,
				'Content-Type': 'application/json',
			},
		});
	};
	const doImport = () => {
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
					setTransactions(prev => [
						...data.importedTransactions,
						...prev,
					]);
				} // there are transactions so there are no errors
				else {
					setError(JSON.stringify(data));
				} // there are no transactions so we assume there are errors
				setIsImportLoading(false);
			});
	};

	return {
		transactions,
		budget,
		categories,
		add,
		update,
		remove,
		doImport,
		isLoading,
		isCategoriesLoading,
		isImportLoading,
		error,
		categoriesError,
	};
};
