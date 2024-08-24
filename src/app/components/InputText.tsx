'use client';

import React, { type InputHTMLAttributes } from 'react';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	isError?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
	id,
	label,
	isError,
	className,
	...props
}) => {
	const inputClass = `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 ${isError ? 'border-red-700' : 'border-transparent'}`;

	return (
		<>
			{label && (
				<label
					className="block text-gray-400 text-sm font-bold mb-2"
					htmlFor={id}
				>
					{label}
				</label>
			)}
			<input
				id={id}
				className={`${inputClass} ${className}`}
				{...props}
			/>
		</>
	);
};

export default InputText;
