require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');

    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
