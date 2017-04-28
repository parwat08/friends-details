const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');

const app = express();
/* eslint-disable no-console */
require('./config/dbConnection')(app);
const port = process.env.PORT || require('./config').app.port;

const user = require('./controllers/user');
const friends = require('./controllers/friend');
const auth = require('./controllers/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', user);
app.use('/api', friends);
app.use('/api', auth);

app.listen(port, (err) => {
    if (err) return console.log(chalk.bold.red(err));
    return console.log(chalk.green.bold(`Express server listening on port: ${port}`));
});
