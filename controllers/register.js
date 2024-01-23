const handleRegister =(req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if(!(email && name && password)) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
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
                        email: loginEmail[0].email,
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

}

module.exports = {
    handleRegister: handleRegister
};