'use client';

import React, { useEffect, useState } from 'react';
import TenantCreate from '../../components/TenantCreate';
import TenantItem from '../../components/TenantItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import { useTenants, useLogin } from '../../hooks';
import type { Tenant } from '../../types';

const Home: React.FC = () => {
	const login = useLogin();
	const { tenants: lsTenants, isLoading: isTenantLoading } = useTenants();
	const [tenantsState, setTenantsState] = useState<Tenant[]>([]);
	const addTenant = (tenant: Tenant, callback: () => void) => {
		const cache = [...tenantsState];
		setTenantsState([tenant, ...tenantsState]);
		callback();
		fetch('/api/tenant', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: login.userId,
				tenant,
			}),
		}).catch(() => {
			setTenantsState([...cache]); // revert back to the previous state
		});
	};
	const updateTenant = (updatedTenant: Tenant, callback: () => void) => {
		const cache = [...tenantsState];
		setTenantsState([
			...tenantsState.map(tenant =>
				tenant.id === updatedTenant.id ? updatedTenant : tenant,
			),
		]);
		callback();
		fetch(`/api/tenant/${updatedTenant.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId: login.userId,
				tenant: updatedTenant,
			}),
		}).catch(() => {
			setTenantsState([...cache]); // revert back to the previous state
		});
	};
	const removeTenant = (id: string, name: string) => {
		if (
			confirm(
				`Are you sure you want to remove "${name}" (the Tenant will be permanently deleted) ?`,
			)
		) {
			const cache = [...tenantsState];
			setTenantsState([
				...tenantsState.filter(tenant => tenant.id !== id),
			]);
			fetch(`/api/tenant/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			}).catch(() => {
				setTenantsState([...cache]); // revert back to the previous state
			});
		}
	};

	useEffect(() => {
		setTenantsState(lsTenants);
	}, [lsTenants]);

	if (isTenantLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Tenants</h1>
			<TenantCreate addTenant={addTenant} />
			{tenantsState
				.sort(
					(a, b) =>
						(b.creationTimestamp || 0) - (a.creationTimestamp || 0),
				)
				.map(tenant => (
					<TenantItem
						key={tenant.id}
						tenant={tenant}
						updateTenant={updateTenant}
						removeTenant={removeTenant}
					/>
				))}
		</div>
	);
};

export default Home;
