const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'faceDetection',
      password : '',
      database : 'smartbrain'
    }
  });

/*const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
  }); */
  
const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'jogn@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'aally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: {
        id: '987',
        hash: '',
        email: 'test@gmail.com'
    }
}

app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    //bcrypt.compare("bacon", hash, function(err, res) {
        // res == true
    //});
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password)
        res.json(database.users[0]);
    else 
        res.json('Error authentication');
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;  
    bcrypt.hash(password, null, null, function(err, hash) 
    {
        db('users')
         .returning('*')
         .insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(user => {
            res.json(user[0]);
        }).catch(err => res.status(400).json('unable to register'))

    }); 
    
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*').from('users').where({ id: id })
    .then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not found!')
        }        
    })
    .catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users').where('id', '=', id)
    .increment('entries', '')
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to increment entries'))

})


/*
// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
}); */

app.listen(3000, () => {
    console.log("app running on por 3000");
})

// Middleware - pass here before the other endpoints.
/* app.use((req, res, next) => {
    console.log('<h1> Hello </h1>');
    next();
})*/

/* Node Section
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const user = {
    name: 'John',
    age: 15
}

app.get('/', (req, res) => {
    res.send("gettin root");
})

app.get('/profile', (req, res) => {
    res.send("gettin profile");
})

app.post('/profile', (req, res) => {
    console.log(req.body);
    res.send('Sucess!');
})

app.listen(3000, () => {
    console.log("app running on por 3000");
})

*/



/* Creating a server withou express (npm install express):
const http = require('http');
const server = http.createServer((request, response) => {

    const obj = {
        name: 'Test',
        age: 15
    }

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(obj));
})
server.listen(3000);
*/