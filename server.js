const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

require('dotenv').config()

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
    // {
    //     host: process.env.DB_HOST,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASS,
    //     database: process.env.DB_DBNAME,
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // }
});

const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    db.select('*').from('users').then(data => {
        res.json(data);
    })
})

app.post('/signin', (req,res) => {signin.handleSignIn(req, res, db, bcrypt)})

app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

app.listen(port, () => {
    console.log("App is running on port", port);
})