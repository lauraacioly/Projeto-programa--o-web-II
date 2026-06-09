const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const agendamentoController = require('../controllers/agendamentoController');

const router = Router();

router.use(authMiddleware);

router.get('/', agendamentoController.index);
router.get('/novo', agendamentoController.showCreate);
router.post('/', agendamentoController.store);
router.get('/:id/editar', agendamentoController.showEdit);
router.put('/:id', agendamentoController.update);
router.delete('/:id', agendamentoController.destroy);

module.exports = router;
