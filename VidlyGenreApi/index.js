const config = require('config');
const express = require('express');
const app = express();
const genres = require('./Data/genres.json');
const logger = require("./logger");
const authenticator = require("./authenicator");
const helmet = require('helmet')
const morgan = require('morgan');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db')
const genresRouting = require('./routes/genres');
const homeRouting = require('./routes/home');

app.set('view engine', 'pug'); //express internally loads this module
app.set('views', './views'); //default
//Configuration
app.use('/api/genres', genresRouting);
app.use('/', homeRouting);




console.log('Application name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

//process.env.NODE_ENV //

const dev = (app.get('env') === 'development');

//console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//console.log(`app: ${app.get('env')}`);

app.use(express.json()); // sets req.body
app.use(express.urlencoded({extended: true})); // parses key=value&key=value etc url encoded payload
app.use(express.static('public')); //static content is served from the root of the site
app.use(helmet());
if(dev) 
{
    app.use(morgan('tiny'));
    startupDebugger('morgan enabled');
}
//Db work ...

dbDebugger("connected to the db");

app.use(logger);
app.use(authenticator);

const port = process.env.port || 3000;
app.listen(port, ()=> console.log(`Listening on ${port}...`));

