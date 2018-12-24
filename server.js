const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const port = 3001;

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
    if(!found) {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, username } = req.body;
    database.users.push({
        id: '125',
        email: email,
        name: name,
        username: username,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found');
    }
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