# Sistema de Gestão de Coleta Seletiva Urbana

Sistema web desenvolvido para gerenciar o processo de coleta seletiva urbana, permitindo o cadastro de pontos de coleta, tipos de resíduos e o agendamento de coletas por parte dos usuários.

---

## Objetivo

Desenvolver uma aplicação web completa com autenticação, controle de acesso por perfil de usuário e operações de CRUD, aplicando os conceitos de desenvolvimento back-end com Node.js, banco de dados relacional com Sequelize e renderização de views com EJS.

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Node.js | 18+ |
| Framework web | Express | 4.21.2 |
| ORM | Sequelize | 6.37.5 |
| Banco de dados | SQLite3 | 5.1.7 |
| Autenticação | jsonwebtoken (JWT) | 9.0.2 |
| Hash de senhas | bcryptjs | 2.4.3 |
| Template engine | EJS | 3.1.10 |
| Variáveis de ambiente | dotenv | 16.4.7 |
| Suporte PUT/DELETE em forms | method-override | 3.0.0 |
| Parser de cookies | cookie-parser | 1.4.7 |
| Hot reload (dev) | nodemon | 3.1.9 |

---

## Funcionalidades

### Autenticação
- Cadastro de conta com validação de e-mail único e senha mínima de 6 caracteres
- Login com geração de token JWT armazenado em cookie `httpOnly`
- Logout com invalidação do cookie
- Proteção de rotas por middleware — usuários não autenticados são redirecionados para o login

### Controle de Acesso por Perfil
- **Administrador (`admin`):** pode criar, editar e excluir Pontos de Coleta e Resíduos
- **Usuário comum (`usuario`):** pode visualizar Pontos de Coleta e Resíduos, e gerenciar seus próprios agendamentos

### Dashboard
- Painel com contagem total de usuários, resíduos, pontos de coleta e agendamentos

### Pontos de Coleta *(admin: CRUD completo | usuário: somente leitura)*
- Cadastro com nome, endereço, bairro, horário de funcionamento e descrição
- Listagem ordenada alfabeticamente
- Edição e exclusão (exclusão bloqueada se houver agendamentos vinculados)

### Resíduos *(admin: CRUD completo | usuário: somente leitura)*
- Cadastro com nome, categoria pré-definida e descrição
- Categorias disponíveis: Papel, Plástico, Vidro, Metal, Orgânico, Eletrônico, Perigoso, Outros
- Listagem ordenada alfabeticamente
- Edição e exclusão (exclusão bloqueada se houver agendamentos vinculados)

### Agendamentos *(todos os usuários autenticados)*
- Criação de agendamento vinculando um ponto de coleta, um resíduo, data e horário
- Validação de data: não é permitido agendar para datas passadas (tanto na criação quanto na edição)
- Listagem exclusiva dos agendamentos do próprio usuário
- Status do agendamento: `pendente`, `confirmado`, `cancelado`, `concluído`
- Edição e exclusão

---

## Entidades do Banco de Dados

### `User` (Usuários)
| Campo | Tipo | Restrições |
|-------|------|-----------|
| id | INTEGER | PK, auto-increment |
| nome | STRING | NOT NULL |
| email | STRING | NOT NULL, UNIQUE |
| senha | STRING | NOT NULL (hash bcrypt) |
| role | ENUM | `admin` \| `usuario`, default: `usuario` |

### `PontoColeta` (Pontos de Coleta)
| Campo | Tipo | Restrições |
|-------|------|-----------|
| id | INTEGER | PK, auto-increment |
| nome | STRING | NOT NULL |
| endereco | STRING | NOT NULL |
| bairro | STRING | NOT NULL |
| horarioFuncionamento | STRING | NOT NULL |
| descricao | TEXT | opcional |

### `Residuo` (Resíduos)
| Campo | Tipo | Restrições |
|-------|------|-----------|
| id | INTEGER | PK, auto-increment |
| nome | STRING | NOT NULL |
| categoria | STRING | NOT NULL |
| descricao | TEXT | opcional |

### `Agendamento` (Agendamentos)
| Campo | Tipo | Restrições |
|-------|------|-----------|
| id | INTEGER | PK, auto-increment |
| data | DATEONLY | NOT NULL |
| horario | STRING | NOT NULL |
| status | ENUM | `pendente` \| `confirmado` \| `cancelado` \| `concluido` |
| userId | INTEGER | FK → Users |
| pontoColetaId | INTEGER | FK → PontoColetas |
| residuoId | INTEGER | FK → Residuos |

---

## Relacionamentos

```
User          1 ──────── N  Agendamento
PontoColeta   1 ──────── N  Agendamento
Residuo       1 ──────── N  Agendamento
```

- Um **usuário** pode ter vários **agendamentos**
- Um **ponto de coleta** pode estar em vários **agendamentos**
- Um **resíduo** pode estar em vários **agendamentos**
- Cada **agendamento** pertence a exatamente um usuário, um ponto de coleta e um resíduo

---

## Como Instalar

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) (incluso com o Node.js)

### Passo a passo

**1. Clone o repositório ou extraia os arquivos do projeto**

```bash
git clone <url-do-repositorio>
cd "Projeto programação web II"
```

**2. Instale as dependências**

```bash
npm install
```

**3. Configure as variáveis de ambiente**

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
PORT=3000
NODE_ENV=development
DB_STORAGE=./database.sqlite
JWT_SECRET=troque_por_uma_chave_segura_em_producao
JWT_EXPIRES_IN=1d
```

> **Importante:** Em produção, substitua `JWT_SECRET` por uma string longa e aleatória.

---

## Como Rodar o Projeto

### Modo desenvolvimento (com hot reload)

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

O banco de dados SQLite (`database.sqlite`) é criado automaticamente na primeira execução. Não é necessário rodar migrations.

---

## Como Acessar no Navegador

Após iniciar o servidor, acesse:

```
http://localhost:3000
```

### Fluxo de uso

1. Acesse a página inicial e clique em **Cadastrar-se** para criar uma conta
2. Faça **login** com o e-mail e senha cadastrados
3. Você será redirecionado ao **Dashboard**
4. Na barra lateral, acesse os módulos: Agendamentos, Pontos de Coleta e Resíduos

### Como criar um usuário administrador

O primeiro usuário criado recebe automaticamente o perfil `usuario`. Para promovê-lo a `admin`, execute o comando abaixo com um cliente SQLite (ex: [DB Browser for SQLite](https://sqlitebrowser.org/)):

```sql
UPDATE Users SET role = 'admin' WHERE email = 'seu@email.com';
```

Após a alteração, faça **logout** e **login** novamente para que o novo perfil seja refletido no token.

---

## Estrutura de Pastas

```
Projeto programação web II/
│
├── public/                     # Arquivos estáticos servidos pelo Express
│   ├── css/
│   │   └── style.css           # Estilos globais da aplicação
│   └── js/
│       └── main.js             # Scripts do frontend (sidebar, active links)
│
├── src/
│   ├── app.js                  # Configuração do Express (middlewares, rotas, erros)
│   │
│   ├── config/
│   │   └── database.js         # Configuração do Sequelize (SQLite)
│   │
│   ├── controllers/            # Lógica de negócio de cada módulo
│   │   ├── authController.js
│   │   ├── agendamentoController.js
│   │   ├── pontoColetaController.js
│   │   └── residuoController.js
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js   # setUser (global), authMiddleware, isAdmin
│   │
│   ├── models/                 # Modelos Sequelize e associações
│   │   ├── index.js            # Inicialização e carregamento das associações
│   │   ├── User.js
│   │   ├── Agendamento.js
│   │   ├── PontoColeta.js
│   │   └── Residuo.js
│   │
│   ├── routes/                 # Definição das rotas por módulo
│   │   ├── index.js            # Rota raiz (/) e /dashboard
│   │   ├── authRoutes.js
│   │   ├── agendamentoRoutes.js
│   │   ├── pontoColetaRoutes.js
│   │   └── residuoRoutes.js
│   │
│   └── views/                  # Templates EJS
│       ├── layouts/
│       │   └── main.ejs        # Layout base (usado pelas páginas de erro)
│       ├── partials/
│       │   ├── header.ejs      # Cabeçalho/sidebar (dinâmico por autenticação)
│       │   └── footer.ejs      # Rodapé
│       └── pages/
│           ├── home.ejs
│           ├── dashboard.ejs
│           ├── 403.ejs
│           ├── 404.ejs
│           ├── 500.ejs
│           ├── auth/
│           │   ├── login.ejs
│           │   └── register.ejs
│           ├── agendamento/
│           │   ├── index.ejs
│           │   ├── create.ejs
│           │   └── edit.ejs
│           ├── pontoColeta/
│           │   ├── index.ejs
│           │   ├── create.ejs
│           │   └── edit.ejs
│           └── residuo/
│               ├── index.ejs
│               ├── create.ejs
│               └── edit.ejs
│
├── .env                        # Variáveis de ambiente (não versionado)
├── .env.example                # Modelo de variáveis de ambiente
├── .gitignore
├── database.sqlite             # Banco de dados gerado automaticamente
├── package.json
├── package-lock.json
└── server.js                   # Entry point — inicializa servidor e banco de dados
```

---

## Rotas da Aplicação

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/` | Público | Página inicial |
| GET | `/auth/register` | Público | Formulário de cadastro |
| POST | `/auth/register` | Público | Processa cadastro |
| GET | `/auth/login` | Público | Formulário de login |
| POST | `/auth/login` | Público | Processa login |
| GET | `/auth/logout` | Autenticado | Encerra a sessão |
| GET | `/dashboard` | Autenticado | Painel com estatísticas |
| GET | `/agendamentos` | Autenticado | Lista agendamentos do usuário |
| GET | `/agendamentos/novo` | Autenticado | Formulário de novo agendamento |
| POST | `/agendamentos` | Autenticado | Cria agendamento |
| GET | `/agendamentos/:id/editar` | Autenticado | Formulário de edição |
| PUT | `/agendamentos/:id` | Autenticado | Atualiza agendamento |
| DELETE | `/agendamentos/:id` | Autenticado | Remove agendamento |
| GET | `/pontos-coleta` | Autenticado | Lista pontos de coleta |
| GET | `/pontos-coleta/novo` | **Admin** | Formulário de novo ponto |
| POST | `/pontos-coleta` | **Admin** | Cria ponto de coleta |
| GET | `/pontos-coleta/:id/editar` | **Admin** | Formulário de edição |
| PUT | `/pontos-coleta/:id` | **Admin** | Atualiza ponto de coleta |
| DELETE | `/pontos-coleta/:id` | **Admin** | Remove ponto de coleta |
| GET | `/residuos` | Autenticado | Lista resíduos |
| GET | `/residuos/novo` | **Admin** | Formulário de novo resíduo |
| POST | `/residuos` | **Admin** | Cria resíduo |
| GET | `/residuos/:id/editar` | **Admin** | Formulário de edição |
| PUT | `/residuos/:id` | **Admin** | Atualiza resíduo |
| DELETE | `/residuos/:id` | **Admin** | Remove resíduo |

---

## Informações Acadêmicas

| | |
|---|---|
| **Instituição** | Universidade Mario Pontes Jucá — UMJ |
| **Disciplina** | Programação Web II |
| **Professor** | Anderson Pereira de Lima Jeronimo |

---

## Autora

| Nome | 
|------|
| Ana Laura Acioly de Carvalho Vasconcellos |

---

> Projeto desenvolvido exclusivamente para fins acadêmicos.
