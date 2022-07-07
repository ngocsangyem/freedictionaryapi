const fetch = require('node-fetch');
const cheerio = require('cheerio');
const errors = require('./errors');
const { JSDOM } = require('jsdom');
const { DOMParser } = new JSDOM().window;

const parser = new DOMParser();
const V1 = 'v1';
const V2 = 'v2';
const SUPPORTED_VERSIONS = new Set([V1, V2]);
const SUPPORTED_LANGUAGES = new Set([
	// 'hi', // Hindi
	'en', // English (US)
	'english', // English (US)
	'en-uk', // English (UK)
	// 'es', // Spanish
	// 'fr', // French
	// 'ja', // Japanese
	// 'cs', // Czech
	// 'nl', // Dutch
	// 'sk', // Slovak
	// 'ru', // Russian
	// 'de', // German
	// 'it', // Italian
	// 'ko', // Korean
	// 'pt-BR', // Brazilian Portuguese
	// 'ar', // Arabic
	// 'tr', // Turkish
	'vi', // Vietnamese
	'english-vietnamese', // Vietnamese
]);
const REQUEST_TYPE_STATUS_CODE = {
	notFound: 404,
	rateLimit: 429,
	serverError: 500,
};

const Utils = {
	async getHTML(url) {
		if (typeof url !== 'string') {
			throw new errors.UnexpectedError({
				reason: `The url type must be a string, received "${typeof url}"!`,
			});
		}

		try {
			const res = await fetch(url, {
				redirect: 'follow',
				cache: 'force-cache',
			});
			const isRedirected = res.redirected;
			if (res.status !== 200) return '';
			const html = await res.text();
			return { html, url: res.url, isRedirected };
		} catch (e) {
			console.log('error', e);
			return '';
		}
	},

	loadHTML(html) {
		if (typeof html !== 'string')
			throw new errors.UnexpectedError({
				reason: `The html type must be a string, received "${typeof html}"!`,
			});

		return cheerio.load(html);
	},

	removeLineBreak(str) {
		if (typeof str !== 'string') return '';
		return str.replace(/\s+/g, ' ').replace(':', '').trim();
	},

	logEvent(word, language, message, additionalInfo = {}) {
		console.log({
			Word: word,
			Language: language,
			Message: message,
			AdditionalInfo: JSON.stringify(additionalInfo),
		});
	},

	isLanguageSupported(language) {
		return SUPPORTED_LANGUAGES.has(language);
	},

	isVersionSupported(version) {
		return SUPPORTED_VERSIONS.has(version);
	},

	checkBody(data) {
		return JSON.stringify(data, (key, value) => {
			if (typeof value === 'object') {
				return value;
			}

			return this.cleanText(value);
		});
	},

	cleanText(text) {
		if (!text) {
			return text;
		}

		return parser.parseFromString(text, 'text/html').body.textContent;
	},

	getUrlParameter(url, name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		const results = regex.exec(url);
		return results === null
			? ''
			: decodeURIComponent(results[1].replace(/\+/g, ' '));
	},

	handleError(errors = {}) {
		// Using duck typing to know if we explicitly threw this error
		// If not then wrapping original error into UnexpectedError
		if (!errors.requestType) {
			errors = new errors.UnexpectedError({ original_error: errors });
		}

		const { requestType, title, message, resolution } = errors;
		const status = REQUEST_TYPE_STATUS_CODE[requestType];
		const body = JSON.stringify({
			title,
			message,
			resolution,
		});

		this.set('Content-Type', 'application/json');
		this.set('Access-Control-Allow-Origin', '*');

		return this.status(status).send(body);
	},
	HEADER_CONTENT_TYPE: 'Content-Type',
	HEADER_ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
};

module.exports = Utils;
