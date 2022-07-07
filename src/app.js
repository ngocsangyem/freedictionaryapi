const express = require('express');
const rateLimit = require('express-rate-limit');
const { getDefinition, getPronunciation } = require('./routes/definition');

const app = express();
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 800, // limit each IP to 450 requests per windowMs
});
const host = '0.0.0.0'
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(limiter);

app.use('/', [getDefinition, getPronunciation]);

app.listen(PORT, host, () => console.log('Server running on port 3000'));

module.exports = app;
