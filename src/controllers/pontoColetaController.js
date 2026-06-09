const { PontoColeta, Agendamento } = require('../models');

const pontoColetaController = {
  async index(req, res) {
    try {
      const pontos = await PontoColeta.findAll({ order: [['nome', 'ASC']] });
      const mensagens = {
        criado: 'Ponto de coleta criado com sucesso!',
        editado: 'Ponto de coleta atualizado com sucesso!',
        excluido: 'Ponto de coleta excluído com sucesso!',
      };
      const erros = {
        vinculado: 'Não é possível excluir este ponto de coleta pois existem agendamentos vinculados a ele.',
      };
      res.render('pages/pontoColeta/index', {
        title: 'Pontos de Coleta',
        pontos,
        success: mensagens[req.query.success] || null,
        error: erros[req.query.error] || null,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  showCreate(req, res) {
    res.render('pages/pontoColeta/create', {
      title: 'Novo Ponto de Coleta',
      error: null,
      dados: {},
    });
  },

  async store(req, res) {
    const { nome, endereco, bairro, horarioFuncionamento, descricao } = req.body;

    const renderErr = (msg) =>
      res.render('pages/pontoColeta/create', {
        title: 'Novo Ponto de Coleta',
        error: msg,
        dados: req.body,
      });

    if (!nome || !endereco || !bairro || !horarioFuncionamento) {
      return renderErr('Preencha todos os campos obrigatórios.');
    }
    if (nome.trim().length < 3) return renderErr('O nome deve ter pelo menos 3 caracteres.');
    if (endereco.trim().length < 5) return renderErr('O endereço deve ter pelo menos 5 caracteres.');
    if (bairro.trim().length < 2) return renderErr('O bairro deve ter pelo menos 2 caracteres.');
    if (horarioFuncionamento.trim().length < 3) return renderErr('Informe o horário de funcionamento.');

    try {
      await PontoColeta.create({
        nome: nome.trim(),
        endereco: endereco.trim(),
        bairro: bairro.trim(),
        horarioFuncionamento: horarioFuncionamento.trim(),
        descricao: descricao?.trim() || null,
      });
      return res.redirect('/pontos-coleta?success=criado');
    } catch (err) {
      console.error(err);
      return renderErr('Erro ao criar ponto de coleta. Tente novamente.');
    }
  },

  async showEdit(req, res) {
    try {
      const ponto = await PontoColeta.findByPk(req.params.id);
      if (!ponto) return res.status(404).render('pages/404', { title: 'Página não encontrada' });

      res.render('pages/pontoColeta/edit', {
        title: 'Editar Ponto de Coleta',
        error: null,
        ponto,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    const { nome, endereco, bairro, horarioFuncionamento, descricao } = req.body;

    try {
      const ponto = await PontoColeta.findByPk(req.params.id);
      if (!ponto) return res.status(404).render('pages/404', { title: 'Página não encontrada' });

      const renderErr = (msg) =>
        res.render('pages/pontoColeta/edit', {
          title: 'Editar Ponto de Coleta',
          error: msg,
          ponto: { ...ponto.dataValues, ...req.body, id: ponto.id },
        });

      if (!nome || !endereco || !bairro || !horarioFuncionamento) {
        return renderErr('Preencha todos os campos obrigatórios.');
      }
      if (nome.trim().length < 3) return renderErr('O nome deve ter pelo menos 3 caracteres.');
      if (endereco.trim().length < 5) return renderErr('O endereço deve ter pelo menos 5 caracteres.');
      if (bairro.trim().length < 2) return renderErr('O bairro deve ter pelo menos 2 caracteres.');
      if (horarioFuncionamento.trim().length < 3) return renderErr('Informe o horário de funcionamento.');

      await ponto.update({
        nome: nome.trim(),
        endereco: endereco.trim(),
        bairro: bairro.trim(),
        horarioFuncionamento: horarioFuncionamento.trim(),
        descricao: descricao?.trim() || null,
      });

      return res.redirect('/pontos-coleta?success=editado');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async destroy(req, res) {
    try {
      const ponto = await PontoColeta.findByPk(req.params.id);
      if (!ponto) return res.status(404).render('pages/404', { title: 'Página não encontrada' });

      const agendamentosVinculados = await Agendamento.count({ where: { pontoColetaId: ponto.id } });
      if (agendamentosVinculados > 0) {
        return res.redirect('/pontos-coleta?error=vinculado');
      }

      await ponto.destroy();
      return res.redirect('/pontos-coleta?success=excluido');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },
};

module.exports = pontoColetaController;
