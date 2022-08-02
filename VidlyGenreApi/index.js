const joi = require('joi');
const fs = require('fs');
const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

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

const genres = 

[
    {id: 1, name:'Sci-fi'},
    {id: 2, name:'Fantasy'},
    {id: 3, name:'Horror'},
];

/*fs.readFile('./Data/genres.json', 'utf8', (err, data) => {

    if(err)
    {
        //???
        genres = [
            {id: 1, name:'Sci-fi'},
            {id: 2, name:'Fantasy'},
            {id: 3, name:'Horror'},
        ]; 
        return;
    }
    else{
        genres = JSON.parse(data);
    }
    
});*/


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