const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig);

const User = require('./User')(sequelize);
const PontoColeta = require('./PontoColeta')(sequelize);
const Residuo = require('./Residuo')(sequelize);
const Agendamento = require('./Agendamento')(sequelize);

const db = {
  sequelize,
  Sequelize,
  User,
  PontoColeta,
  Residuo,
  Agendamento,
};

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

module.exports = db;
