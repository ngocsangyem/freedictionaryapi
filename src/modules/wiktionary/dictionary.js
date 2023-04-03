const { MongoClient } = require('mongodb');
const errors = require('../../utils/errors');
require('dotenv').config();

class Dictionary {
	async meaning(word) {
		const client = new MongoClient(process.env.APP_URI);

		try {
			if (typeof word !== 'string') {
				throw new errors.NoDefinitionsFound({
					reason: 'Word must be a string!',
				});
			}

			await client.connect();

			const result = await client
				.db('english_dictionary')
				.collection('english_dictionary')
				.findOne({ wiki: word });

			if (!result) {
				throw new errors.NoDefinitionsFound();
			}

			return result.data;
		} catch (error) {
			throw new errors.NoDefinitionsFound({
				reason: 'Website returned 404.',
			});
		} finally {
			await client.close();
		}
	}
}

module.exports = Dictionary;
