const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authenticateToken = require("../middlewares/tokenMiddleware");

// Rota para adicionar um novo comentário a um post
router.post("/", authenticateToken, async (req, res) => {
  const { content, postId } = req.body;

  if (!content) {
    return res.status(400).json({ error: "O conteúdo é obrigatório." });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        postId: parseInt(postId),
        authorId: req.userId,
      },
    });

    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para excluir um comentário
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    if (comment.authorId !== req.userId) {
      return res.status(403).json({
        error: "Você não tem permissão para excluir este comentário.",
      });
    }

    const deletedComment = await prisma.comment.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json(deletedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
