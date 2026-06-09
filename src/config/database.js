const path = require('path');

module.exports = {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', '..', process.env.DB_STORAGE || 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
};
