'use client';

import React, {
	forwardRef,
	type TextareaHTMLAttributes,
	type InputHTMLAttributes,
} from 'react';

type InputTextProps = {
	label?: string;
	isError?: boolean;
} & (
	| (InputHTMLAttributes<HTMLInputElement> & { as?: 'input' })
	| (TextareaHTMLAttributes<HTMLTextAreaElement> & { as?: 'textarea' })
);

const InputText = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputTextProps
>(({ id, label, isError, className, as = 'input', ...props }, ref) => {
	const inputClass = `shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 ${
		isError ? 'border-red-700' : 'border-transparent'
	}`;
	const commonProps = {
		id,
		className: `${inputClass} ${className || ''}`,
		ref,
		...props,
	};

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
			{as === 'textarea' ? (
				<textarea
					{...(commonProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
				/>
			) : (
				<input
					{...(commonProps as InputHTMLAttributes<HTMLInputElement>)}
				/>
			)}
		</>
	);
});

export default InputText;
