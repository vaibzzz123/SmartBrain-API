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

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    db.select('*').from('users').then(data => {
        res.json(data);
    })
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email) //last two lines get data of user
    .then(data => {
        const isValidLogin = bcrypt.compareSync(req.body.password, data[0].hash); //compares hashes
        if(isValidLogin) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user')) //if unable to fetch user
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials')) //If login fails
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    let hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login') //inserts this transaction into login
            .returning('email') //returns email (is it really even required?)
            .then(loginEmail => { //then if that's successful, enter it into the users table
                trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                    })
                    .then(trx.commit) //to confirm the changes and add to the db
                    .catch(trx.rollback) //if anything fails, we rollback changes
                    .catch(err => {
                        res.status(400).json('unable to register');
                    })

            })
    })

})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id: id }).then(user => {
        if (user.length >= 1) {
            res.json(user[0]);
        } else {
            res.status(400).json('user not found');
        }
    }).catch(err => res.status(400).json('error getting user'));
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id).increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('Unable to increment entries'))
})

app.listen(port, () => {
    console.log("App is running on port", port);
})