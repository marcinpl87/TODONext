import React, { ElementType, ReactNode } from 'react';

interface CardProps<T extends ElementType> {
	as?: T;
	children: ReactNode;
	className?: string;
}

const Card = <T extends ElementType = 'div'>({
	as,
	children,
	className,
	...props
}: CardProps<T> & React.ComponentPropsWithRef<T>) => {
	const Component = as || 'div';
	const cardClass =
		'mb-5 p-5 w-full max-w-4xl text-left list-none border border-white';

	return (
		<Component className={`${cardClass} ${className || ''}`} {...props}>
			{children}
		</Component>
	);
};

export default Card;
