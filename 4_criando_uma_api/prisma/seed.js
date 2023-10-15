const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Criando os usuários primeiro
  const alice = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      password: "teste123",
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob",
      email: "bob@example.com",
      password: "teste123",
    },
  });

  // Criando posts e comentários para Alice
  await prisma.post.create({
    data: {
      title: "Primeiro post de Alice",
      content: "Este é o conteúdo do primeiro post de Alice.",
      authorId: alice.id,
      comments: {
        create: [
          {
            content: "Ótimo post, Alice!",
            authorId: bob.id,
          },
        ],
      },
    },
  });

  // Criando posts e comentários para Bob
  await prisma.post.create({
    data: {
      title: "Primeiro post de Bob",
      content: "Este é o conteúdo do primeiro post de Bob.",
      authorId: bob.id,
      comments: {
        create: [
          {
            content: "Muito interessante, Bob!",
            authorId: alice.id,
          },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Segundo post de Bob",
      content: "Este é o conteúdo do segundo post de Bob.",
      authorId: bob.id,
      comments: {
        create: [
          {
            content: "Concordo com o que você disse!",
            authorId: alice.id,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
