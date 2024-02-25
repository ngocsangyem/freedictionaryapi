const fetch = require('node-fetch');
const cheerio = require('cheerio');
const errors = require('./errors');
const { JSDOM } = require('jsdom');
const { DOMParser } = new JSDOM().window;

const SUPPORTED_VERSIONS = new Set(['v1', 'v2']);
const SUPPORTED_LANGUAGES = new Set(['en', 'english', 'en-uk', 'vi', 'english-vietnamese']);

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
			if (!res.ok) return '';
			const html = await res.text();
			return { html, url: res.url, isRedirected: res.redirected };
		} catch (e) {
			console.error('Error fetching HTML:', e);
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

	cleanText(text) {
		if (!text) {
			return text;
		}
		return new DOMParser().parseFromString(text, 'text/html').body.textContent;
	},

	getUrlParameter(url, name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		const results = regex.exec(url);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	},

	handleError(err = {}) {
		if (!errors.requestType) {
			err = new errors.UnexpectedError({ original_error: err });
		}
		const { requestType, title, message, resolution } = err;
		const status = { notFound: 404, rateLimit: 429, serverError: 500 }[requestType];
		const body = JSON.stringify({ title, message, resolution });
		console.error('Error:', body);
		return { status, body };
	},
};

module.exports = Utils;
