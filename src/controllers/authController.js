const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
  showRegister(req, res) {
    if (res.locals.user) return res.redirect('/dashboard');
    res.render('pages/auth/register', { title: 'Cadastro', error: null, success: null });
  },

  async register(req, res) {
    const { nome, email, senha, confirmarSenha } = req.body;

    const renderErr = (msg) =>
      res.render('pages/auth/register', { title: 'Cadastro', error: msg, success: null });

    if (!nome || !email || !senha || !confirmarSenha) return renderErr('Preencha todos os campos.');
    if (senha !== confirmarSenha) return renderErr('As senhas não coincidem.');
    if (senha.length < 6) return renderErr('A senha deve ter pelo menos 6 caracteres.');

    try {
      const existing = await User.findOne({ where: { email } });
      if (existing) return renderErr('E-mail já cadastrado.');

      const hash = await bcrypt.hash(senha, 10);
      await User.create({ nome, email, senha: hash });

      return res.render('pages/auth/register', {
        title: 'Cadastro',
        error: null,
        success: 'Conta criada com sucesso! Faça login.',
      });
    } catch (err) {
      console.error(err);
      return renderErr('Erro ao criar conta. Tente novamente.');
    }
  },

  showLogin(req, res) {
    if (res.locals.user) return res.redirect('/dashboard');
    res.render('pages/auth/login', { title: 'Login', error: null });
  },

  async login(req, res) {
    const { email, senha } = req.body;

    const renderErr = (msg) =>
      res.render('pages/auth/login', { title: 'Login', error: msg });

    if (!email || !senha) return renderErr('Preencha todos os campos.');

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return renderErr('E-mail ou senha incorretos.');

      const valid = await bcrypt.compare(senha, user.senha);
      if (!valid) return renderErr('E-mail ou senha incorretos.');

      const token = jwt.sign(
        { id: user.id, nome: user.nome, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      return res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      return renderErr('Erro ao fazer login. Tente novamente.');
    }
  },

  logout(req, res) {
    res.clearCookie('token');
    res.redirect('/auth/login');
  },
};

module.exports = authController;
