const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function seedAdmin() {
  const existing = await User.findOne({ where: { role: 'admin' } });
  if (existing) return;

  const hash = await bcrypt.hash('admin123', 10);
  await User.create({
    nome: 'Ana Laura Acioly',
    email: 'lauralalaacioly@gmail.com',
    senha: hash,
    role: 'admin',
  });

  console.log('Usuário admin criado: lauralalaacioly@gmail.com / admin123');
}

module.exports = seedAdmin;
