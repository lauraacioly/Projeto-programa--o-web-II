const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { User, PontoColeta, Residuo, Agendamento } = require('../models');

const authRoutes = require('./authRoutes');
const pontoColetaRoutes = require('./pontoColetaRoutes');
const residuoRoutes = require('./residuoRoutes');
const agendamentoRoutes = require('./agendamentoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/pontos-coleta', pontoColetaRoutes);
router.use('/residuos', residuoRoutes);
router.use('/agendamentos', agendamentoRoutes);

router.get('/', (req, res) => {
  res.render('pages/home', { title: 'Sistema de Gestão de Coleta Seletiva' });
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [totalUsuarios, totalResiduos, totalPontosColeta, totalAgendamentos] = await Promise.all([
      User.count(),
      Residuo.count(),
      PontoColeta.count(),
      Agendamento.count(),
    ]);

    res.render('pages/dashboard', {
      title: 'Dashboard',
      user: req.user,
      stats: { totalUsuarios, totalResiduos, totalPontosColeta, totalAgendamentos },
    });
  } catch (err) {
    console.error(err);
    res.render('pages/dashboard', {
      title: 'Dashboard',
      user: req.user,
      stats: { totalUsuarios: 0, totalResiduos: 0, totalPontosColeta: 0, totalAgendamentos: 0 },
    });
  }
});

module.exports = router;
