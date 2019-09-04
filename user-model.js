  const db = require('./data/dbConfig.js');

module.exports = {
  add,
  find,
  findBy,
  findById
};
// return users
function find() {
  return db('users').select('id', 'username', 'password');
}

// return user by filter condition
function findBy(filter) {
  return db('users').where(filter);
}

// retun newly created user
function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

// return user with given id
function findById(id) {
  return db('users')
    .where({ id })
    .first();
}
