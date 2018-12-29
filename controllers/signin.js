const handleSignIn = (req, res, db, bcrypt) => {
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
}

module.exports = {
    handleSignIn: handleSignIn
}