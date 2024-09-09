const express = require('express');
const rateLimit = require('express-rate-limit');
const { getDefinition, getPronunciation } = require('./routes/definition');
const WikiDictionary = require('./modules/wiktionary/dictionary');
const path = require('path');

const app = express();
let dictionary;

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 800, // limit each IP to 450 requests per windowMs
});
const host = '0.0.0.0'
const PORT = process.env.PORT || 3000;


async function initializeDictionary() {
	try {
		const WikDictionary = new WikiDictionary();
		await WikDictionary.loadDictionary(path.join(__dirname, '../data/data.jsonl'));

		dictionary = WikDictionary.dictionaryData;
	} catch (error) {
		console.error('Error loading dictionary:', error);
		process.exit(1);
	}
}

app.set('trust proxy', true);
app.use(limiter);

initializeDictionary().then(() => {
	// Pass the dictionary to the routes
	app.use((req, res, next) => {
		req.dictionary = dictionary;
		next();
	});

	app.use('/api', getDefinition);
	app.use('/api', getPronunciation);

	// ... other app configurations ...

	app.listen(PORT, host, () => {
		console.log('Server is running on port 3000');
	});
});

module.exports = app;
