const joi = require('joi');
const fs = require('fs');
const express = require('express');
const Joi = require('joi');
const app = express();
const genres = require('./Data/genres.json');
const logger = require("./logger");
const authenticator = require("./authenicator");
const helmet = require('helmet')
const morgan = require('morgan');

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
    console.log('morgan enabled')
}
app.use(logger);
app.use(authenticator);





function findGenre(req, genres)
{
    return genres.find(c => c.id === parseInt(req.params.id));
}


class Validator{
    
    
    constructor(schema = Joi.object(
        {
            name : Joi.string().min(3).max(50).required()
        }))
    {
        this.genreSchema = schema;
    }

    validate(req)
    {
        return this.genreSchema.validate(req.body);
    }
}

let validator = new Validator();





const port = process.env.port || 3000;

const genrePath = '/api/genres/'


app.get(genrePath, (req, res) => {
    res.send(genres);
});

app.get(genrePath + ':id', (req, res) =>{
    
    const genre = findGenre(req, genres);

    if(genre)
    {
        res.send(genre);
    }
    else{
        res.status(404).send('There is no genre for that id');
    }
});

app.put(genrePath + ':id', (req, res) => {

    const genre = findGenre(req, genres);

    if(!genre)
    {
        res.status(404).send('No genre of that id found');
        return;
    }
     
    
    const {error} = validator.validate(req);

    if(error)
    {
        res.status(404).send(error);
        return;
    }

    genre.name = req.body.name;
    res.send(genre);
    updateFile();

});


app.post(genrePath, (req, res) => {
    
    const {error} = validator.validate(req);

    if(error)
    {
        res.status(400).send(error);
        return;
    }

    const genre = genres.find(c => c.name === req.body.name)

    if(genre)
    {
        res.status(400).send(`${genre.name} already exists :/`);
        return;
    }

    const newGenre = {
        id: genres.length + 1,
        name: req.body.name
    }
    
    genres.push(newGenre);
    res.send(genres);

    updateFile();
   
});

app.delete(genrePath + ':id', (req, res)=>{
    const genre = genres.find(c => c.id === parseInt(req.params.id));

    if(!genre)
    {
        res.status(400).send("Genre does not exist, can't delete :/");
    }

    const index = genres.indexOf(genre);

    genres.splice(index, 1);
    res.send(genre);

    updateFile();
})

app.listen(port, ()=> console.log(`Listening on ${port}...`));

process.on('SIGTERM', () => {
    updateFile();
})

function updateFile()
{
    fs.writeFile('./Data/genres.json', JSON.stringify(genres), 'utf8', (err) =>
    {
        if(err)
        {
            console.log("Error writing out Genre file");
        }
        else{
            console.log("Successful wrote Genre.json out");
        }
    })
}