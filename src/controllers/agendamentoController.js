const { Agendamento, PontoColeta, Residuo } = require('../models');

const agendamentoController = {
  async index(req, res) {
    try {
      const agendamentos = await Agendamento.findAll({
        where: { userId: req.user.id },
        include: [
          { model: PontoColeta, as: 'pontoColeta' },
          { model: Residuo, as: 'residuo' },
        ],
        order: [['data', 'DESC'], ['horario', 'ASC']],
      });
      const mensagens = {
        criado: 'Agendamento criado com sucesso!',
        editado: 'Agendamento atualizado com sucesso!',
        excluido: 'Agendamento excluído com sucesso!',
      };
      res.render('pages/agendamento/index', {
        title: 'Meus Agendamentos',
        agendamentos,
        success: mensagens[req.query.success] || null,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async showCreate(req, res) {
    try {
      const [pontos, residuos] = await Promise.all([
        PontoColeta.findAll({ order: [['nome', 'ASC']] }),
        Residuo.findAll({ order: [['nome', 'ASC']] }),
      ]);
      res.render('pages/agendamento/create', {
        title: 'Novo Agendamento',
        error: null,
        dados: {},
        pontos,
        residuos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async store(req, res) {
    const { pontoColetaId, residuoId, data, horario } = req.body;

    let pontos, residuos;
    try {
      [pontos, residuos] = await Promise.all([
        PontoColeta.findAll({ order: [['nome', 'ASC']] }),
        Residuo.findAll({ order: [['nome', 'ASC']] }),
      ]);
    } catch (err) {
      console.error(err);
      return res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }

    const renderErr = (msg) =>
      res.render('pages/agendamento/create', {
        title: 'Novo Agendamento',
        error: msg,
        dados: req.body,
        pontos,
        residuos,
      });

    if (!pontoColetaId || !residuoId || !data || !horario) {
      return renderErr('Preencha todos os campos obrigatórios.');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(data + 'T00:00:00');
    if (dataSelecionada < hoje) {
      return renderErr('A data do agendamento não pode ser no passado.');
    }

    try {
      await Agendamento.create({
        pontoColetaId: parseInt(pontoColetaId),
        residuoId: parseInt(residuoId),
        data,
        horario,
        userId: req.user.id,
        status: 'pendente',
      });
      return res.redirect('/agendamentos?success=criado');
    } catch (err) {
      console.error(err);
      return renderErr('Erro ao criar agendamento. Tente novamente.');
    }
  },

  async showEdit(req, res) {
    try {
      const [agendamento, pontos, residuos] = await Promise.all([
        Agendamento.findOne({ where: { id: req.params.id, userId: req.user.id } }),
        PontoColeta.findAll({ order: [['nome', 'ASC']] }),
        Residuo.findAll({ order: [['nome', 'ASC']] }),
      ]);
      if (!agendamento) {
        return res.status(404).render('pages/404', { title: 'Página não encontrada' });
      }
      res.render('pages/agendamento/edit', {
        title: 'Editar Agendamento',
        error: null,
        agendamento,
        pontos,
        residuos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    const { pontoColetaId, residuoId, data, horario, status } = req.body;

    let agendamento, pontos, residuos;
    try {
      [agendamento, pontos, residuos] = await Promise.all([
        Agendamento.findOne({ where: { id: req.params.id, userId: req.user.id } }),
        PontoColeta.findAll({ order: [['nome', 'ASC']] }),
        Residuo.findAll({ order: [['nome', 'ASC']] }),
      ]);
    } catch (err) {
      console.error(err);
      return res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }

    if (!agendamento) {
      return res.status(404).render('pages/404', { title: 'Página não encontrada' });
    }

    const renderErr = (msg) =>
      res.render('pages/agendamento/edit', {
        title: 'Editar Agendamento',
        error: msg,
        agendamento: { ...agendamento.dataValues, ...req.body, id: agendamento.id },
        pontos,
        residuos,
      });

    if (!pontoColetaId || !residuoId || !data || !horario) {
      return renderErr('Preencha todos os campos obrigatórios.');
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(data + 'T00:00:00');
    if (dataSelecionada < hoje) {
      return renderErr('A data do agendamento não pode ser no passado.');
    }

    const statusValidos = ['pendente', 'confirmado', 'cancelado', 'concluido'];
    const statusFinal = statusValidos.includes(status) ? status : agendamento.status;

    try {
      await agendamento.update({
        pontoColetaId: parseInt(pontoColetaId),
        residuoId: parseInt(residuoId),
        data,
        horario,
        status: statusFinal,
      });
      return res.redirect('/agendamentos?success=editado');
    } catch (err) {
      console.error(err);
      return renderErr('Erro ao atualizar agendamento. Tente novamente.');
    }
  },

  async destroy(req, res) {
    try {
      const agendamento = await Agendamento.findOne({
        where: { id: req.params.id, userId: req.user.id },
      });
      if (!agendamento) {
        return res.status(404).render('pages/404', { title: 'Página não encontrada' });
      }
      await agendamento.destroy();
      return res.redirect('/agendamentos?success=excluido');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },
};

module.exports = agendamentoController;
