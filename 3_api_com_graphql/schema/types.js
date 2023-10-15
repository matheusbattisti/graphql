// 3 - Definindo os tipos
const { gql } = require("apollo-server");

const typeDefs = gql`
  # 7.2 - Documentação
  """
  Representa um autor de livros.
  """
  type Author {
    """
    O ID único do autor.
    """
    id: ID!

    """
    Nome completo do autor.
    """
    name: String!

    """
    Lista de livros escritos por este autor.
    """
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    content: String!
    rating: Int!
    book: Book!
    date: String!
  }

  # 4 - Criando as primeiras queries
  type Query {
    # 7.2 - Documentação
    """
    Recupera a lista completa de autores disponíveis.
    """
    allAuthors: [Author!]!
    allBooks: [Book!]!
    allReviews: [Review!]!

    # 5 - Filtrando por atributo
    author(id: ID!): Author
    book(id: ID!): Book
    review(id: ID!): Review

    # 6 - Queries mais complexas
    # Retorna os livros e avaliações de um autor específico com base no nome do autor.
    booksByAuthor(authorName: String!): [BookWithReviews!]!

    # Retorna as avaliações e o autor de um livro específico com base no título do livro.
    reviewsByBook(bookTitle: String!): [ReviewWithAuthor!]!

    # Retorna os livros com uma avaliação específica ou superior, junto com seus autores.
    booksWithRatingAbove(rating: Int!): [BookWithAuthor!]!

    # 7 - Resolvers de tipo
    books(id: ID, authorName: String): [Book!]!
    reviews(book_id: ID, rating: Int): [Review!]!

    # 8 - Exercício 1 => Livros por Avaliação
    booksWithSpecificRating(rating: Int!): [Book]

    # 9 - Exercício 2 => Autores com Mais Livros
    authorsWithMinBooks(minBooks: Int!): [Author]

    # 10 - Exercício 3 => Avaliações Recentes
    recentReviews(afterDate: String!): [Review]
  }

  type BookWithReviews {
    id: ID!
    title: String!
    author_id: ID!
    reviews: [Review!]!
  }

  type ReviewWithAuthor {
    id: ID!
    content: String!
    rating: Int!
    book_id: ID!
    date: String!
    book: BookWithAuthor!
  }

  type BookWithAuthor {
    id: ID!
    title: String!
    author: Author!
  }

  # Seção de Mutations
  type Mutation {
    # 16 - Criando Dados
    addBook(title: String!, author_id: ID!): Book!
    addReview(
      content: String!
      rating: Int!
      book_id: ID!
      date: String!
    ): Review!

    # 17 - Atualizando Dados
    updateAuthor(id: ID!, name: String!): Author!
    updateReview(
      id: ID!
      content: String!
      rating: Int!
      book_id: ID!
      date: String!
    ): Review!

    # 18 - Deletando Dados
    deleteAuthor(id: ID!): Author!
    deleteBook(id: ID!): Book!

    # 19 - Exercício 4: Excluir Review
    deleteReview(id: ID!): Review!

    # 20 - Exercício 5: Atualizar Livro
    updateBook(id: ID!, title: String!, author_id: ID!): Book!

    # 21 - Exercício 6: Criar Autor
    addAuthor(name: String!): Author!
  }
`;

module.exports = {
  typeDefs,
};

module.exports = {
  typeDefs,
};
