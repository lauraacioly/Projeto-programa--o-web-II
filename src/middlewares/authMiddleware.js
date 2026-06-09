const jwt = require('jsonwebtoken');

// Popula res.locals.user em todas as rotas (não bloqueia não autenticados)
function setUser(req, res, next) {
  const token = req.cookies?.token;
  if (token) {
    try {
      res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      res.clearCookie('token');
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
}

// Protege rotas — redireciona para login se não autenticado
function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
}

// Protege rotas exclusivas de admin — responde 403 se o usuário não for admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('pages/403', { title: 'Acesso negado' });
}

module.exports = { authMiddleware, setUser, isAdmin };
