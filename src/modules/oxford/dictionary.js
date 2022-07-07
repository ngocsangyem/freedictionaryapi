const Utils = require('../../utils/utils');
const constants = require('../../utils/constants');
const errors = require('../../utils/errors');

class Dictionary {
	async meaning(word) {
		try {
			if (typeof word !== 'string')
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});

			const { html } = await Utils.getHTML(
				`${constants.oxford.BASE_URL}${constants.oxford.DICT}/${word}`
			);

			if (!html)
				throw new errors.NoDefinitionsFound({
					reason: 'Website returned 404.',
				});

			const $ = Utils.loadHTML(html);
			const sensesMultiple = $('.senses_multiple').first();
			const sensesSingle = $('.sense_single').first();

			const firstMeaningShortCutOfSensesMultiple = sensesMultiple
				.find('.shcut-g')
				.first()
				.find('li.sense')
				.first()
				.find('.def')
				.text();
			const firstMeaningOfSensesMultiple = sensesMultiple
				.find('li.sense')
				.first()
				.find('.def')
				.text();
			const firstMeaningOfSingleMultiple = sensesSingle
				.find('.xrefs')
				.text();
			const nonSenseBlock = sensesSingle
				.find('li.sense')
				.first()
				.find('.def')
				.text();

			const phonetics = $('.phonetics')
				.first()
				.find('> div')
				.map((_, elm) => ({
					text: $(elm).find('.phon').first().text(),
					audio:
						$(elm).find('.sound').first().attr('data-src-mp3') ||
						$(elm).find('.sound').first().attr('data-src-ogg'),
				}))
				.get();

			const multipleMeanings = sensesMultiple
				.find('li.sense')
				.map((_, elm) => ({
					meaning: `${$(elm).find('> .cf').first().text()} ${$(elm)
						.find('> .def')
						.text()}`,
					examples: $(elm)
						.find('.examples li')
						.map((_, example) => $(example).text())
						.get(),
				}))
				.get();

			const singleMeanings = sensesSingle
				.find('li.sense')
				.map((_, elm) => ({
					meaning: `${$(elm).find('> .cf').first().text()} ${$(elm)
						.find('> .def')
						.text()}`,
					examples: $(elm)
						.find('.examples li')
						.map((_, example) => $(example).text())
						.get(),
				}))
				.get();

			return {
				word: $('h1.headword').text().toLowerCase(),
				meaning:
					firstMeaningShortCutOfSensesMultiple ||
					firstMeaningOfSensesMultiple ||
					firstMeaningOfSingleMultiple ||
					nonSenseBlock,
				phonetic: $('.phonetics')
					.first()
					.find('div')
					.first()
					.find('.phon')
					.first()
					.text(),
				type: $('.top-container')
					.first()
					.find('.pos')
					.text()
					.toLowerCase(),
				irregular_verbs: '',
				phonetics,
				meanings:
					multipleMeanings.length > 0
						? multipleMeanings
						: singleMeanings,
			};
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Dictionary;
