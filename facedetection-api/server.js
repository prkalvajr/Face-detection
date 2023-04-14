const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '123456',
        database: 'postgres'
    }
});

const app = express();

app.use(cors());

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.get('/', (req, res) => {
    db.select('email', 'hash').from('login')
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err))

    })

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('Unable to get user'))
        }
        else
            res.status(400).json('wrong credentials')
    }).catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
              .then(trx.commit)
              .catch(trx.rollback)
            })
            .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const {
        id
    } = req.params;

    db.select('*').from('users').where({
            id: id
        })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found!')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))
})

app.put('/image', (req, res) => {
    const {
        id
    } = req.body;

    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to increment entries'))

})


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