const express = require("express");
const { PrismaClient } = require("@prisma/client");

const authenticateToken = require("../middlewares/tokenMiddleware");

const prisma = new PrismaClient();

const router = express.Router();

// Rota para criar um novo post
router.post("/", authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Título e conteúdo do usuário são obrigatórios." });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: {
          connect: {
            id: req.userId,
          },
        },
      },
    });

    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter todos os posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para obter um post específico por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado." });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um post
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Recuperar o post pelo ID
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // Se o post não existir, retorne um erro
    if (!post) {
      return res.status(404).json({ error: "Post não encontrado." });
    }

    // Verificar se o authorId do post corresponde ao userId do token
    if (post.authorId !== req.userId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para atualizar este post." });
    }

    // Prossiga com a atualização
    const updatedPost = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
        content: content,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para excluir um post
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Recuperar o post pelo ID
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    // Se o post não existir, retorne um erro
    if (!post) {
      return res.status(404).json({ error: "Post não encontrado." });
    }

    // Verificar se o authorId do post corresponde ao userId do token
    if (post.authorId !== req.userId) {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para excluir este post." });
    }

    // Prossiga com a exclusão
    const deletedPost = await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
