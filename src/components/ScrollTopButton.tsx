'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import IconButton from './IconButton';

const yOffset = 300;

const ScrollTopButton: React.FC = () => {
	const [showScroll, setShowScroll] = useState<boolean>(false);
	const checkScrollTop = () => {
		if (!showScroll && window.pageYOffset > yOffset) {
			setShowScroll(true);
		} else if (showScroll && window.pageYOffset <= yOffset) {
			setShowScroll(false);
		}
	};
	const scrollTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	useEffect(() => {
		window.addEventListener('scroll', checkScrollTop);
		return () => {
			window.removeEventListener('scroll', checkScrollTop);
		};
	});

	if (!showScroll) {
		return null;
	}

	return (
		<IconButton
			onClick={scrollTop}
			className="fixed bottom-5 right-5 z-50 opacity-50 hover:opacity-100 transition-colors duration-200 ease-out"
		>
			<ChevronUp className="size-5" />
		</IconButton>
	);
};

export default ScrollTopButton;
