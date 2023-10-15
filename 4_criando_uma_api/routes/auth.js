const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

// Rota para login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Verificar se email e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(400).json({ error: "Usuário não encontrado." });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({ error: "Senha inválida." });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 86400, // expira em 24 horas
  });

  res.json({ auth: true, token: token });
});

// Rota para logout
router.post("/logout", (req, res) => {
  res.json({ auth: false, token: null });
});

module.exports = router;
