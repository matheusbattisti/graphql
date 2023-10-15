// 1 - Criando estrutura do projeto
const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema/types");
const { resolvers } = require("./schema/resolvers");
const { authors, books, reviews } = require("./data/db.js"); // Importando os dados mockados

// Configuração e inicialização do servidor Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server pronto em: ${url}`);
});
