const router = require('express').Router();

const Users = require('../user-model.js');

router.get('/api/users', restricted, (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send(err));
});

function restricted(req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcryptjs.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({ message: 'Invalid credentials'})
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Unexpected error' })
        })
    } else {
        res.status(400).json({ message: 'You shall not pass!'})
    }
}
  
  module.exports = router;