export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'TODO Next',
	description:
		'Beautifully designed SPA built with Next.js and Tailwind CSS.',
	mainNav: [
		{
			title: 'Home',
			href: '/',
		},
		{
			title: 'Properties',
			href: '/properties',
		},
		{
			title: 'Tenants',
			href: '/tenants',
		},
		{
			title: 'Bank',
			href: '/bank',
		},
		{
			title: 'Test',
			href: '/test',
		},
	],
	links: {
		github: 'https://github.com/marcinpl87/TODONext',
	},
};
