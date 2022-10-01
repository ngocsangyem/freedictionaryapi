const axios = require('axios');
const errors = require('../../utils/errors');
const constants = require('../../utils/constants');
require('dotenv').config();

class Dictionary {
	async meaning(word) {
		try {
			if (typeof word !== 'string')
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});

			const options = {
				method: 'GET',
				url: `${constants.lingua_robot.BASE_URL}/${word}`,
				headers: {
					'X-RapidAPI-Key': process.env.API_KEY,
					'X-RapidAPI-Host': 'lingua-robot.p.rapidapi.com',
				},
			};

			const result = await axios.request(options);
			const entries = result.data.entries;

			if (!entries.length) {
				throw new errors.NoDefinitionsFound();
			}

			const meanings = entries[0].lexemes.map((word) => {
				const pronunciations =
					entries[0].pronunciations &&
					entries[0].pronunciations.length &&
					entries[0].pronunciations
						.filter(
							(pronunciation) =>
								pronunciation && pronunciation.audio
						)
						.map((p) => {
							let type;
							const ipa =
								p.transcriptions && p.transcriptions.length
									? p.transcriptions[0].transcription
									: '';

							if (
								p.context.regions[0] === 'United Kingdom' ||
								p.context.regions[0] === 'Australia'
							) {
								type = 'uk';
							} else if (
								p.context.regions[0] === 'United States'
							) {
								type = 'us';
							} else {
								type = p.context.regions[0];
							}

							return {
								type,
								audio: p.audio.url,
								ipa: ipa,
							};
						});
				const forms =
					word.forms &&
					word.forms.length &&
					word.forms
						.filter((form) => form.grammar && form.grammar[0].tense)
						.map((form) => ({
							text: form.form,
							type: form.grammar[0].tense,
						}));
				const senses =
					word.senses &&
					word.senses.length &&
					word.senses
						.filter((s) => s.subSenses && s.subSenses.length)
						.map((s) => ({
							definition: s.subSenses[0].definition,
							examples:
								s.subSenses[0].usageExamples &&
								s.subSenses[0].usageExamples.length
									? s.subSenses[0].usageExamples
									: [],
							synonyms: s.synonyms ? s.synonyms : [],
							antonyms: s.antonyms ? s.antonyms : [],
						}));
				return {
					word: entries[0].entry,
					partOfSpeech: word.partOfSpeech ? word.partOfSpeech : '',
					phonetics: pronunciations ? pronunciations : [],
					forms: forms ? forms : [],
					meanings: senses,
				};
			});

			return meanings;
		} catch (error) {
			console.log('error', error);
			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		}
	}
}

module.exports = Dictionary;
