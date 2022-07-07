const fs = require('fs');
const es = require('event-stream');

const errors = require('../../utils/errors');

class Dictionary {
	async meaning(word, filePath) {
		try {
			if (typeof word !== 'string') {
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});
			}
			const definitions = await this.resolveStream(word, filePath);
			return definitions;
		} catch (error) {
			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		}
	}

	resolveStream(word, filePath) {
		return new Promise((resolve, reject) => {
			let wordDefinition;
			const stream = fs
				.createReadStream(filePath)
				.pipe(es.split())
				.pipe(es.filterSync((line) => line))
				.pipe(
					es.mapSync((line) => {
						const obj = JSON.parse(line);
						if (obj[word]) {
							wordDefinition = obj[word];
							stream.end();
						}
					})
				)
				.on('end', () => {
					resolve(wordDefinition);
				});
		});
	}
}

module.exports = Dictionary;
