const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { PrismaClient } = require("@prisma/client");

const authenticateToken = require("../middlewares/tokenMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

// Rota para obter todos os usuários
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter um usuário específico por ID
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para criar um novo usuário
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar se o e-mail já está em uso
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: "E-mail já está em uso." });
  }

  try {
    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário com senha hash
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    // Gerar token JWT
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: 86400, // expira em 24 horas
    });

    // Retornar o usuário criado (sem a senha) e o token
    res.json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
