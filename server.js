const express = require('express');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const authRouter = require('./auth/auth-router.js');
const usersRouter = require('./users/users-router.js');
const db = require('./data/dbConfig.js');

const server = express();

const KnexSessionStore = connectSessionKnex(session);

const sessionConfig = {
    name: 'regNlog',
    secret: 'this should not be hard coded',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave:false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        knex: db,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
}

server.use(express.json());
server.use(session(sessionConfig))

server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

module.exports = server;