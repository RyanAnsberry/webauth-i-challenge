const express = require('express');

const bcryptjs = require('bcryptjs');

const Users = require('./user-model.js');

const server = express();

server.use(express.json());

server.post('/api/register', (req, res) => {
    let user = req.body;

    user.password = bcryptjs.hashSync(user.password, 6);

    Users.add(user)
    .then(saved => {
        res.status(201).json(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
    .first()
    .then(user => {
        if (user && bcryptjs.compareSync(password, user.password)) {
            res.status(200).json({ message: `Welcome ${user.username}` })
        } else {
            res.status(401).json({ message: 'You shall not pass!'})
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

server.get('/api/users', restricted, (req, res) => {
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

module.exports = server;