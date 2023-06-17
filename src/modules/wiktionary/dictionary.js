const { MongoClient } = require('mongodb');
const errors = require('../../utils/errors');
require('dotenv').config();

class Dictionary {
	constructor() {
		this.client = new MongoClient(process.env.APP_URI);
		this.collection = null;
	}

	async initialize() {
		try {
			await this.client.connect();
			const db = this.client.db('english_dictionary');
			this.collection = db.collection('english_dictionary');

			// Create an index on the "wiki" field if not already created
			const indexExists = await this.collection.indexExists('wiki');
			if (!indexExists) {
				await this.collection.createIndex({ wiki: 1 });
			}
		} catch (error) {
			throw new errors.NoDefinitionsFound();
		}
	}

	async close() {
		await this.client.close();
	}

	async meaning(word) {
		try {
			if (typeof word !== 'string') {
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});
			}

			const result = await this.collection.findOne(
				{ wiki: word },
				{ projection: { data: 1 } }
			);

			if (!result) {
				throw new errors.NoDefinitionsFound();
			}

			return result.data;
		} catch (error) {
			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		}
	}
}

module.exports = Dictionary;
