const handleSignIn = (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if(!(email && password)) {
        return res.status(400).json('incorrect form submission');
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email) //last two lines get data of user
    .then(data => {
        const isValidLogin = bcrypt.compareSync(password, data[0].hash); //compares hashes
        if(isValidLogin) {
            return db.select('*').from('users')
            .where('email', '=', email)
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