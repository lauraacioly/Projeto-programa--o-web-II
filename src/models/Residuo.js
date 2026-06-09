const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Residuo = sequelize.define('Residuo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Residuo.associate = (db) => {
    Residuo.hasMany(db.Agendamento, { foreignKey: 'residuoId', as: 'agendamentos' });
  };

  return Residuo;
};
