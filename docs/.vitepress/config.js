module.exports = {
	title: 'Free Dictionary API',
	description: 'Fast stories powered by Vite',
	head: [
		['meta', { property: 'og:title', content: 'Free Dictionary API' }],
		['meta', { property: 'og:site_name', content: 'Free Dictionary API' }],
		['meta', { property: 'og:type', content: 'website' }],
		[
			'meta',
			{
				property: 'og:description',
				content: 'Fast stories powered by Vite',
			},
		],
		[
			'meta',
			{ property: 'og:url', content: 'https://freedictionaryapi.dev/' },
		],
		[
			'meta',
			{
				property: 'og:image',
				content: 'https://freedictionaryapi.dev/opengraph.png',
			},
		],
		['meta', { property: 'og:image:width', content: '600' }],
		['meta', { property: 'og:image:height', content: '315' }],
		['meta', { name: 'twitter:card', content: 'summary_large_image' }],
		['meta', { name: 'twitter:site', content: '@ngocsangyem' }],
	],

	lastUpdated: true,

	themeConfig: {
		logo: '/logo.svg',

		editLink: {
			repo: 'ngocsangyem/freedictionaryapi',
			branch: 'main',
			dir: 'docs',
			text: 'Edit this page on GitHub',
			pattern: 'https://github.com/ngocsangyem/freedictionary/edit/main/docs'
		},

		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2022-present Sang Nguyen',
		},

		nav: [
			{ text: 'API Reference', link: '/reference/definition' },
			{
				text: 'Changelog',
				link: 'https://github.com/ngocsangyem/freedictionaryapi/blob/main/CHANGELOG.md',
			},
			{
				text: 'Sponsor',
				items: [
					{
						text: 'Sang Nguyen',
						link: 'https://github.com/ngocsangyem',
					},
				],
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/ngocsangyem/freedictionaryapi',
			},
			{ icon: 'twitter', link: 'https://twitter.com/ngocsangyem' },
		],

		sidebar: {
			'/reference/': [
				{
					text: 'API Reference',
					items: [
						{
							text: 'Definition',
							link: '/reference/definition',
						},
						{
							text: 'Pronunciation',
							link: '/reference/pronunciation',
						},
					],
				},
			],
			'/guide/': [
				{
					text: 'Guide',
					collapsible: true,
					items: [],
				},
			],
		},
	},
};
