const errors = require('../../utils/errors');
const readline = require('readline');
const { createReadStream } = require('fs');
require('dotenv').config();

class Dictionary {
	constructor() {
		this.dictionaryData = new Map();
	}

	async loadDictionary(filePath) {
		const fileStream = createReadStream(filePath);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity
		});

		for await (const line of rl) {
			const entry = JSON.parse(line);
			const [word, definitions] = Object.entries(entry)[0];
			this.dictionaryData.set(word, definitions);
		}

		console.log('Dictionary loaded successfully');
	}
}

module.exports = Dictionary;
