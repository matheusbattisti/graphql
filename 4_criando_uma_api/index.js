const express = require("express");

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

// Importando rotas
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(express.json());

// Configuração de rotas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Rota básica para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("API está funcionando!");
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
