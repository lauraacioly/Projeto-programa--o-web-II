const { Residuo, Agendamento } = require('../models');

const CATEGORIAS = ['Papel', 'Plástico', 'Vidro', 'Metal', 'Orgânico', 'Eletrônico', 'Perigoso', 'Outros'];

const residuoController = {
  async index(req, res) {
    try {
      const residuos = await Residuo.findAll({ order: [['nome', 'ASC']] });
      const mensagens = {
        criado: 'Resíduo criado com sucesso!',
        editado: 'Resíduo atualizado com sucesso!',
        excluido: 'Resíduo excluído com sucesso!',
      };
      const erros = {
        vinculado: 'Não é possível excluir este resíduo pois existem agendamentos vinculados a ele.',
      };
      res.render('pages/residuo/index', {
        title: 'Resíduos',
        residuos,
        success: mensagens[req.query.success] || null,
        error: erros[req.query.error] || null,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  showCreate(req, res) {
    res.render('pages/residuo/create', {
      title: 'Novo Resíduo',
      error: null,
      dados: {},
      categorias: CATEGORIAS,
    });
  },

  async store(req, res) {
    const { nome, categoria, descricao } = req.body;

    const renderErr = (msg) =>
      res.render('pages/residuo/create', {
        title: 'Novo Resíduo',
        error: msg,
        dados: req.body,
        categorias: CATEGORIAS,
      });

    if (!nome || !categoria) {
      return renderErr('Preencha todos os campos obrigatórios.');
    }
    if (nome.trim().length < 2) return renderErr('O nome deve ter pelo menos 2 caracteres.');
    if (!CATEGORIAS.includes(categoria)) return renderErr('Selecione uma categoria válida.');

    try {
      await Residuo.create({
        nome: nome.trim(),
        categoria,
        descricao: descricao?.trim() || null,
      });
      return res.redirect('/residuos?success=criado');
    } catch (err) {
      console.error(err);
      return renderErr('Erro ao criar resíduo. Tente novamente.');
    }
  },

  async showEdit(req, res) {
    try {
      const residuo = await Residuo.findByPk(req.params.id);
      if (!residuo) return res.status(404).render('pages/404', { title: 'Página não encontrada' });

      res.render('pages/residuo/edit', {
        title: 'Editar Resíduo',
        error: null,
        residuo,
        categorias: CATEGORIAS,
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async update(req, res) {
    const { nome, categoria, descricao } = req.body;

    try {
      const residuo = await Residuo.findByPk(req.params.id);
      if (!residuo) return res.status(404).render('pages/404', { title: 'Página não encontrada' });

      const renderErr = (msg) =>
        res.render('pages/residuo/edit', {
          title: 'Editar Resíduo',
          error: msg,
          residuo: { ...residuo.dataValues, ...req.body, id: residuo.id },
          categorias: CATEGORIAS,
        });

      if (!nome || !categoria) {
        return renderErr('Preencha todos os campos obrigatórios.');
      }
      if (nome.trim().length < 2) return renderErr('O nome deve ter pelo menos 2 caracteres.');
      if (!CATEGORIAS.includes(categoria)) return renderErr('Selecione uma categoria válida.');

      await residuo.update({
        nome: nome.trim(),
        categoria,
        descricao: descricao?.trim() || null,
      });

      return res.redirect('/residuos?success=editado');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },

  async destroy(req, res) {
    try {
      const residuo = await Residuo.findByPk(req.params.id);
      if (!residuo) return res.status(404).render('pages/404', { title: 'Página não encontrada' });

      const agendamentosVinculados = await Agendamento.count({ where: { residuoId: residuo.id } });
      if (agendamentosVinculados > 0) {
        return res.redirect('/residuos?error=vinculado');
      }

      await residuo.destroy();
      return res.redirect('/residuos?success=excluido');
    } catch (err) {
      console.error(err);
      res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
    }
  },
};

module.exports = residuoController;
