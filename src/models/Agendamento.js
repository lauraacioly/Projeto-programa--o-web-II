const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agendamento = sequelize.define('Agendamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    horario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado', 'concluido'),
      allowNull: false,
      defaultValue: 'pendente',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
    },
    pontoColetaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'PontoColetas', key: 'id' },
    },
    residuoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Residuos', key: 'id' },
    },
  });

  Agendamento.associate = (db) => {
    Agendamento.belongsTo(db.User, { foreignKey: 'userId', as: 'usuario' });
    Agendamento.belongsTo(db.PontoColeta, { foreignKey: 'pontoColetaId', as: 'pontoColeta' });
    Agendamento.belongsTo(db.Residuo, { foreignKey: 'residuoId', as: 'residuo' });
  };

  return Agendamento;
};
