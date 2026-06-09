const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const routes = require('./routes');
const { setUser } = require('./middlewares/authMiddleware');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Popula res.locals.user em todas as views
app.use(setUser);

// Routes
app.use('/', routes);

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Página não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/500', { title: 'Erro interno do servidor' });
});

module.exports = app;
