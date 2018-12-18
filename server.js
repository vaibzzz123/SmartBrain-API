const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const database = {
    users: [
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
            username: 'lumenlogic',
            name: 'Ryan',
            email: 'idk@gmail.com',
            password: 'deltarune',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('success');
    }
    else {
        res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const {email, name, password, username} = req.body;
    database.users.push({
        id: '125',
        email: email,
        name: name,
        password: password,
        username: username,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:userId', (req, res) => {
    res.send('This is working');
})

app.put('/image', (req, res) => {
    res.send('This is working');
})

app.listen(3000, () => {
    console.log("App is running on port 3000");
})