const express = require('express');

const User = require('user-model.js');

const server = express();

server.use(express.json());

server.get('/api/register', (req, res) => {

})

server.post('/api/login', (req, res) => {

})

server.get('/api/users', (req, res) => {

})

module.exports = server;