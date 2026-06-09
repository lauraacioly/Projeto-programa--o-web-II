const { Router } = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const residuoController = require('../controllers/residuoController');

const router = Router();

router.use(authMiddleware);

router.get('/', residuoController.index);
router.get('/novo', isAdmin, residuoController.showCreate);
router.post('/', isAdmin, residuoController.store);
router.get('/:id/editar', isAdmin, residuoController.showEdit);
router.put('/:id', isAdmin, residuoController.update);
router.delete('/:id', isAdmin, residuoController.destroy);

module.exports = router;
