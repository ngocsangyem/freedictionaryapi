const express = require('express');
const router = express.Router();
const path = require('path');

const Utils = require('../../utils/utils');
const errors = require('../../utils/errors');

const CamDictionary = require('../../modules/cambridge/dictionary');

/**
 * Get definition
 */

const getDefinition = router.get(
	'/:version/entries/:language/:word',
	async (req, res) => {
		let { word, language, version } = req.params;
		word = decodeURIComponent(word).trim().toLocaleLowerCase();

		if (!word || !language || !version) {
			return Utils.handleError.call(res, new errors.NoDefinitionsFound());
		}

		if (!Utils.isVersionSupported(version)) {
			return Utils.handleError.call(res, new errors.NoDefinitionsFound());
		}

		if (language === 'en_US' || language === 'en_GB' || language === 'en') {
			language = 'english';
		}

		if (
			language === 'vi_VN' ||
			language === 'vietnamese' ||
			language === 'vn' ||
			language === 'vi'
		) {
			language = 'english-vietnamese';
		}

		language = language.toLowerCase();

		if (!Utils.isLanguageSupported(language)) {
			return Utils.handleError.call(res, new errors.NoDefinitionsFound());
		}

		try {
			if (language !== 'english') {
				throw new errors.NoDefinitionsFound({
					reason: 'Only English is supported at the moment.',
				});
			}

			const meaning = req.dictionary.get(word);

			res.set('Content-Type', 'application/json');
			res.set('Access-Control-Allow-Origin', '*');

			if (!meaning) {
				throw new errors.NoDefinitionsFound();
			}

			return res.status(200).send(meaning);
		} catch (error) {
			console.log('error', error);
			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		}
	}
);

const getPronunciation = router.get(
	'/:version/pronunciation/:language/:word',
	async (req, res, next) => {
		let { word, language, version } = req.params;
		word = decodeURIComponent(word).trim().toLocaleLowerCase();

		if (!word || !language || !version) {
			return Utils.handleError.call(res, new errors.NoDefinitionsFound());
		}

		if (!Utils.isVersionSupported(version)) {
			return Utils.handleError.call(res, new errors.NoDefinitionsFound());
		}

		if (language === 'en_US' || language === 'en_GB' || language === 'en') {
			language = 'english';
		}

		if (language !== 'english') {
			return Utils.handleError.call(
				res,
				new errors.NoPronunciationFound()
			);
		}

		language = language.toLowerCase();

		word = word.trim().toLocaleLowerCase(language);

		try {
			const dictionary = new CamDictionary();
			const pronunciation = await dictionary.pronunciation(
				word,
				language
			);

			const body = Utils.checkBody(pronunciation);

			res.set(Utils.HEADER_CONTENT_TYPE, 'application/json');
			res.set(Utils.HEADER_ACCESS_CONTROL_ALLOW_ORIGIN, '*');
			if (!body) {
				throw new errors.NoPronunciationFound();
			}
			return res.send(body);
		} catch (error) {
			console.log('error', error);
			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		}
	}
);

module.exports = { getDefinition, getPronunciation };
