const Joi = require('joi');
const express = require('express');

const app = express()

app.use(express.json());


const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/', (req, res)=> //route handler
{
    res.send('hello world!!!');
});

app.get('/api/courses', (req, res) =>{
    res.send(courses);
});

app.get('/api/courses/:id', (req,res)=> {
    
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) // return 404
    {
        res.status(404).send('The course was not found');
    }
    else{
        res.send(course);
    }

});

app.post('/api/courses', (req, res) => { 

    //basic input validation
    const { error } = ValidateCourse(req.body);
    
    if(error)
    {
        //400 bad Request
        res.status(400).send(error);
        return;
    }

    const course =
    {
        id: courses.length + 1, 
        name: req.body.name
    };

    courses.push(course);
    res.send(course);

});

app.put('/api/courses/:id', (req, res) => {
    
    // look up the course
    //if nothing, 404
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) // return 404
    {
        res.status(404).send('The course was not found');
        return;
    }
    //validate
    //if invalid, 400
    
    
    const { error } = ValidateCourse(req.body);
    
    if(error)
    {
        //400 bad Request
        res.status(400).send(error);
        return;
    }

    course.name = req.body.name;
    //all good, update
    //return course
    res.send(course);
})

app.delete('/api/courses/:id', (req, res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course) // return 404
    {
        res.status(404).send('The course was not found');
        return;
    }
    //validate
    //if invalid, 40
    const index = courses.indexOf(course);

    courses.splice(index, 1);

    res.send(course);
});
/*app.get('/api/posts/:year/:month', (req,res)=> {
    res.send(req.params);
});*/

app.get('/api/courses/:id', (req,res)=> {
    res.send(req.query);
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on ${port}...`))

function ValidateCourse(course)
{
    const schema = Joi.object(
        {
            name : Joi.string().min(3).max(30).required()
        }
    )

    return schema.validate(course.body);
}

