'use client';

import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
	const buttonClass =
		'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';

	return (
		<button className={`${buttonClass} ${className}`} {...props}>
			{children}
		</button>
	);
};

export default Button;
