const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../user-model.js');

router.post('/register', (req, res) => {
    let user = req.body;

    user.password = bcrypt.hashSync(user.password, 6);

    Users.add(user)
    .then(saved => {
        req.session.user = user;

        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;

            res.status(200).json({ message: `Welcome ${user.username}` })
        } else {
            res.status(401).json({ message: 'You shall not pass!'})
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.json({
                    message: 'Failed to log out.'
                })
            } else {
                res.end();
            }
        })
    }
})

module.exports = router;