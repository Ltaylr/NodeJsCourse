const express = require('express');
const Joi = require('joi');
const fs = require('fs');
const router = express.Router();


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


const genrePath = '/'




router.get(genrePath, (req, res) => {
    res.send(genres);
});

router.get(genrePath + ':id', (req, res) =>{
    
    const genre = findGenre(req, genres);

    if(genre)
    {
        res.send(genre);
    }
    else{
        res.status(404).send('There is no genre for that id');
    }
});

router.put(genrePath + ':id', (req, res) => {

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


router.post(genrePath, (req, res) => {
    
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

router.delete(genrePath + ':id', (req, res)=>{
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

module.exports = router;