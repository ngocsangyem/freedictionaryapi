const Utils = require('../../utils/utils');
const constants = require('../../utils/constants');
const errors = require('../../utils/errors');

class Dictionary {
	async meaning(word, language) {
		try {
			if (typeof word !== 'string')
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});
			const { html } = await Utils.getHTML(
				`${constants.cambridge.BASE_URL}${
					constants.cambridge.DICT
				}${language}/${word.split(' ').join('-')}`
			);

			if (!html)
				throw new errors.NoDefinitionsFound({
					reason: 'Website returned 404.',
				});

			const $ = Utils.loadHTML(html);

			if ($('.entry-body').length > 0 || $('.dictionary').length > 0) {
				const $firstEntry = $('.entry-body__el').first();
				const $entries = $('.entry-body')
					.first()
					.find('.entry-body__el');
				const definition = $('meta[itemprop="headline"]').attr(
					'content'
				);
				const meaningPage = definition
					.split('definition: 1. ')[1]
					.split(' 2. ')[0]
					? definition.split('definition: 1. ')[1].split(' 2. ')[0]
					: definition.split('definition: 1. ')[1];
				const firstMeaning = $firstEntry
					.find('.dsense')
					.first()
					.find('.def-block')
					.first()
					.find('.def.ddef_d')
					.text()
					.trim()
					.replace(':', '');

				const wordHeading =
					definition.split('definition: ')[0].trim() ||
					$('.dictionary').first().find('.headword').text();

				const meanings = $entries
					.filter((_, entry) => entry)
					.map((_, entry) => ({
						partOfSpeech: $(entry)
							.find('.pos-header .pos.dpos')
							.text(),
						definitions: $(entry)
							.find('.pos-body .def-block')
							.filter((_, sense) => sense)
							.map((_, sense) => ({
								definition: Utils.removeLineBreak(
									$(sense).find('.ddef_h .def.ddef_d').text()
								),
								examples: $(sense)
									.find('.def-body .examp.dexamp')
									.map((_, example) => $(example).text())
									.get(),
								synonyms: $(sense)
									.find(
										'.daccord header:contains("synonyms")'
									)
									.next()
									.find('.hul-u li')
									.map((_, synonym) => ({
										word: $(synonym).find('a').text(),
										example: $(synonym)
											.find('.example')
											.text(),
									}))
									.get(),
							}))
							.get(),
						idioms: $(entry)
							.find('.idioms .lcs .item')
							.filter((_, idiom) => idiom)
							.map((_, idiom) => ({
								text: $(idiom).text(),
								url: `${constants.cambridge.BASE_URL}${$(idiom)
									.find('a')
									.attr('href')}`,
							}))
							.get(),
						phrasal_verbs: $(entry)
							.find('.phrasal_verbs .lcs .item')
							.filter((_, verb) => verb)
							.map((_, verb) => ({
								text: $(verb).text(),
								url: `${constants.cambridge.BASE_URL}${$(verb)
									.find('a')
									.attr('href')}`,
							}))
							.get(),
					}))
					.get();

				const dictionaryMeanings = $('.dictionary')
					.filter((_, entry) => entry)
					.map((_, entry) => ({
						partOfSpeech: $(entry)
							.find('.pos-header .pos.dpos')
							.text(),
						definitions: $(entry)
							.find('.didiom-body .dsense')
							.filter((_, sense) => sense)
							.map((_, sense) => ({
								definition: Utils.removeLineBreak(
									$(sense)
										.find('.def-block .ddef_d.db')
										.text()
								),
								examples: $(sense)
									.find('.def-body .examp.dexamp')
									.map((_, example) => $(example).text())
									.get(),
								synonyms: [],
							}))
							.get(),
						idioms: [],
						phrasal_verbs: [],
					}))
					.get();

				const phonetics = $('.pos-header')
					.first()
					.find('.dpron-i')
					.map((_, elm) => ({
						type: $(elm).find('.region').text(),
						url: `${constants.cambridge.BASE_URL}${$(elm)
							.find('source[type="audio/mpeg"]')
							.attr('src')}`,
						text: $(elm).find('.dipa.ipa').text(),
					}))
					.get();

				const phonetic = $('.dipa').first().text();

				const examples = $firstEntry
					.find('.dsense')
					.first()
					.find('.examp')
					.filter((_, elm) => $(elm).text().length)
					.map((_, elm) => $(elm).text().trim())
					.get();

				const dictionaryExample = $('.dictionary')
					.first()
					.find('.sense-body .examp.dexamp')
					.map((_, elm) => $(elm).text())
					.get();

				const irregular_verbs = $firstEntry
					.find('.pos-header .irreg-infls .inf-group')
					.filter((_, elm) => elm)
					.map((_, elm) => ({
						type: $(elm).find('.dlab').text(),
						text: $(elm).find('.dinf').text(),
					}))
					.get();

				const obj = {
					word: wordHeading,
					meaning:
						Utils.removeLineBreak(firstMeaning) ||
						Utils.removeLineBreak(
							meaningPage.substring(
								0,
								meaningPage.lastIndexOf('. Learn more.')
							)
						) ||
						Utils.removeLineBreak(meaningPage),
					phonetic,
					type: $('.dpos').eq(0).text()
						? $('.dpos').eq(0).text().split(',')
						: [],
					irregular_verbs,
					examples:
						examples.length > 0 ? examples : dictionaryExample,
					phonetics,
					meanings:
						meanings.length > 0 ? meanings : dictionaryMeanings,
				};

				return obj;
			}

			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		} catch (error) {
			console.log(error);
		}
	}

	async vietnameseMeaning(word, language) {
		try {
			if (typeof word !== 'string')
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});
			const { html, url, isRedirected } = await Utils.getHTML(
				`${constants.cambridge.BASE_URL}${
					constants.cambridge.DICT
				}${language}/${word.split(' ').join('-')}`
			);

			const { html: html2 } = await Utils.getHTML(
				`${constants.cambridge.BASE_URL}${
					constants.cambridge.DICT
				}english/${word.split(' ').join('-')}`
			);

			if (!html)
				throw new errors.NoDefinitionsFound({
					reason: 'Website returned 404.',
				});

			const $ = Utils.loadHTML(html);
			const $$ = Utils.loadHTML(html2);

			if ($('.entry-body').length === 0) {
				throw new errors.NoDefinitionsFound({
					reason: 'Website returned 404.',
				});
			}

			const $firstEntry = $('.english-vietnamese').first();
			const $entry = $('.entry-body').first().find('.english-vietnamese');
			const definition = $('meta[itemprop="headline"]').attr('content');
			const meaningPage = definition.split('go translate: ')[1];
			const firstMeaning = $entry
				.find('.pos-body .sense-block')
				.first()
				.find('.def-body .trans.dtrans')
				.text()
				.trim()
				.replace(/;/g, ',');
			const wordHeading = Utils.getUrlParameter(url, 'q')
				? Utils.getUrlParameter(url, 'q').replace(/-/g, ' ')
				: $('.di-title').first().text();

			const meanings = $entry
				.filter((_, entry) => entry)
				.map((_, entry) => ({
					partOfSpeech: $(entry).find('.dpos-g .dpos').text(),
					definitions: $(entry)
						.find('.pos-body .sense-block')
						.filter((_, sense) => sense)
						.map((_, sense) => ({
							definition: $(sense)
								.find('.def-body .trans.dtrans')
								.text()
								.replace(/;/g, ','),
							examples: $(sense)
								.find('.examp.dexamp')
								.map((_, example) => $(example).text())
								.get(),
						}))
						.get(),
				}))
				.get();

			const phonetics = $$('.pos-header')
				.first()
				.find('.dpron-i')
				.map((_, elm) => ({
					type: $$(elm).find('.region').text(),
					url: `${constants.cambridge.BASE_URL}${$(elm)
						.find('source[type="audio/mpeg"]')
						.attr('src')}`,
					text: $$(elm).find('.dipa.ipa').text(),
				}))
				.get();

			const phonetic = !isRedirected
				? $('.ipa.dipa').first().text()
				: $$('.dipa').first().text();

			const examples = $firstEntry
				.find('.sense-body')
				.first()
				.find('.def-body .examp.dexamp')
				.filter((_, elm) => $(elm).text().length)
				.map((_, elm) => $(elm).text().trim())
				.get();

			const obj = {
				word: wordHeading,
				meaning:
					Utils.removeLineBreak(firstMeaning) ||
					Utils.removeLineBreak(
						meaningPage.substring(0, m.lastIndexOf('. Learn more.'))
					) ||
					Utils.removeLineBreak(meaningPage),
				phonetic,
				type: $('.dpos').eq(0).text(),
				examples: examples,
				phonetics,
				meanings,
			};

			return obj;
		} catch (error) {
			console.log(error);
		}
	}

	async pronunciation(word, language) {
		try {
			if (typeof word !== 'string')
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});

			const { html } = await Utils.getHTML(
				`${constants.cambridge.BASE_URL}${
					constants.cambridge.PRON
				}${language}/${word.split(' ').join('-')}`
			);
			if (!html)
				throw new errors.NoDefinitionsFound({
					reason: 'Website returned 404.',
				});
			const $ = Utils.loadHTML(html);

			const phonetics = $('.pronunciation-item')
				.map((_, elm) => ({
					type: Utils.removeLineBreak(
						$(elm).find('.i-volume-up').text()
					),
					audio: `${constants.cambridge.BASE_URL}${$(elm)
						.find('source[type="audio/mpeg"]')
						.attr('src')}`,
				}))
				.get();

			const obj = {
				word: $('h1.lmt-15').text(),
				phonetics,
			};

			return obj;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Dictionary;
