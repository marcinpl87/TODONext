'use client';

import React from 'react';
import TenantCreate from '../../components/TenantCreate';
import TenantItem from '../../components/TenantItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import { useTenants } from '../../hooks/tenants';
import { useLogin } from '../../hooks/app';

const Tenants: React.FC = () => {
	const login = useLogin();
	const { tenants, add, update, remove, isLoading } = useTenants(
		login.userId,
	);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Tenants</h1>
			<TenantCreate addTenant={add} />
			{tenants
				.sort(
					(a, b) =>
						(b.creationTimestamp || 0) - (a.creationTimestamp || 0),
				)
				.map(tenant => (
					<TenantItem
						key={tenant.id}
						tenant={tenant}
						updateTenant={update}
						removeTenant={remove}
					/>
				))}
		</div>
	);
};

export default Tenants;
