const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PontoColeta = sequelize.define('PontoColeta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    horarioFuncionamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  PontoColeta.associate = (db) => {
    PontoColeta.hasMany(db.Agendamento, { foreignKey: 'pontoColetaId', as: 'agendamentos' });
  };

  return PontoColeta;
};
