const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'test',
        database: 'smartbrain'
    }
});

const port = 3001;

//TODO fix signin endpoint to not return password

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '122',
            username: 'a',
            name: 'a',
            email: 'a',
            password: 'a',
            entries: 0,
            joined: new Date()
        },
        {
            id: '123',
            username: 'vaibzzz123',
            name: 'Vaib',
            email: 'vaib.kapoor15@gmail.com',
            password: 'ayylmao',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            username: 'asdf',
            name: 'Ghjkl',
            email: 'idk@gmail.com',
            password: 'qwertyuiop',
            entries: 0,
            joined: new Date()
        },

    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'vaib.kapoor15@gmail.com'
        }
    ]
}

// db.select('*').from('users').then(data => {
//     console.log(data);
// })

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    let found = false;
    database.users.forEach(user => {
        if (req.body.email === user.email && req.body.password === user.password) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0]);
    })
    .catch(err => {
        res.status(400).json('unable to register');
    })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id: id}).then(user => {
        if(user.length >= 1) {
            res.json(user[0]);
        } else {
            res.status(400).json('user not found');
        }
    }).catch(err => res.status(400).json('error getting user'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            ++user.entries;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('user not found');
    }
})

app.listen(port, () => {
    console.log("App is running on port", port);
})