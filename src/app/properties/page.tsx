'use client';

import React from 'react';
import PropertyCreate from '../../components/PropertyCreate';
import PropertyItem from '../../components/PropertyItem';
import LoadingIconTwo from '../../components/LoadingIconTwo';
import { useProperties } from '../../hooks/properties';
import { useLogin } from '../../hooks/app';

const Properties: React.FC = () => {
	const login = useLogin();
	const { properties, add, update, remove, isLoading } = useProperties(
		login.userId,
	);

	if (isLoading) {
		return (
			<LoadingIconTwo className="absolute z-[1] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
		);
	}

	return (
		<div className="flex flex-col items-center max-w-4xl m-auto">
			<h1 className="text-2xl font-bold my-5">Properties</h1>
			<PropertyCreate addProperty={add} />
			{properties
				.sort(
					(a, b) =>
						(b.creationTimestamp || 0) - (a.creationTimestamp || 0),
				)
				.map(property => (
					<PropertyItem
						key={property.id}
						property={property}
						updateProperty={update}
						removeProperty={remove}
					/>
				))}
		</div>
	);
};

export default Properties;
