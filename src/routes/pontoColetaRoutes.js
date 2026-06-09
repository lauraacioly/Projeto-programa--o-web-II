const { Router } = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const pontoColetaController = require('../controllers/pontoColetaController');

const router = Router();

router.use(authMiddleware);

router.get('/', pontoColetaController.index);
router.get('/novo', isAdmin, pontoColetaController.showCreate);
router.post('/', isAdmin, pontoColetaController.store);
router.get('/:id/editar', isAdmin, pontoColetaController.showEdit);
router.put('/:id', isAdmin, pontoColetaController.update);
router.delete('/:id', isAdmin, pontoColetaController.destroy);

module.exports = router;
