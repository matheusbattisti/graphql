const { authors, books, reviews } = require("../data/db.js");

const generateId = () => Math.random().toString(36).substr(2, 9);

const resolvers = {
  Query: {
    // 4 - Criando as primeiras queries
    // Retorna uma lista de autores. Se um ID for fornecido, retorna apenas o autor com esse ID.
    // Retorna todos os autores.
    allAuthors: () => authors,

    // Retorna todos os livros.
    allBooks: () => books,

    // Retorna todas as avaliações.
    allReviews: () => reviews,

    // 5 - Filtrando por atributo
    // Retorna um autor específico com base no ID.
    author: (_, args) => authors.find((author) => author.id === args.id),

    // Retorna um livro específico com base no ID.
    book: (_, args) => books.find((book) => book.id === args.id),

    // Retorna uma avaliação específica com base no ID.
    review: (_, args) => reviews.find((review) => review.id === args.id),

    // 6 - Queries mais complexas
    // Retorna os livros e avaliações de um autor específico com base no nome do autor.
    booksByAuthor: (_, args) => {
      console.log(authors, args);
      const author = authors.find((author) => author.name === args.authorName);

      return books
        .filter((book) => book.author_id === author.id)
        .map((book) => ({
          ...book,
          reviews: reviews.filter((review) => review.book_id === book.id),
        }));
    },

    // Retorna as avaliações e o autor de um livro específico com base no título do livro.
    reviewsByBook: (_, args) => {
      const book = books.find((book) => book.title === args.bookTitle);
      return reviews
        .filter((review) => review.book_id === book.id)
        .map((review) => ({
          ...review,
          book: {
            ...book,
            author: authors.find((author) => author.id === book.author_id),
          },
        }));
    },

    // Retorna os livros com uma avaliação específica ou superior, junto com seus autores.
    booksWithRatingAbove: (_, args) => {
      const bookIds = reviews
        .filter((review) => review.rating >= args.rating)
        .map((review) => review.book_id);
      return books
        .filter((book) => bookIds.includes(book.id))
        .map((book) => ({
          ...book,
          author: authors.find((author) => author.id === book.author_id),
        }));
    },

    //  8 - Exercício 1
    booksWithSpecificRating: (_, args) => {
      const bookIds = reviews
        .filter((review) => review.rating === args.rating)
        .map((review) => review.book_id);
      return books.filter((book) => bookIds.includes(book.id));
    },

    //  9 - Exercício 2
    authorsWithMinBooks: (_, args) => {
      return authors.filter((author) => {
        const authorBooks = books.filter(
          (book) => book.author_id === author.id
        );
        return authorBooks.length >= args.minBooks;
      });
    },

    //  10 - Exercício 3
    recentReviews: (_, args) => {
      return reviews.filter(
        (review) => new Date(review.date) > new Date(args.afterDate)
      );
    },
  },

  // 7 - Resolvers de tipo
  // Retorna todos os livros escritos por um autor específico.
  Author: {
    books: (author) => books.filter((book) => book.author_id === author.id),
    // 7.1 - Resolver de tipo para manipular dados
    name: (author) => {
      return `Sr(a). ${author.name}`;
    },
  },

  // Retorna o autor de um livro específico e todas as avaliações desse livro.
  Book: {
    author: (book) => authors.find((author) => author.id === book.author_id),
    reviews: (book) => reviews.filter((review) => review.book_id === book.id),
  },

  // Retorna o livro associado a uma avaliação específica.
  Review: {
    book: (review) => books.find((book) => book.id === review.book_id),
  },

  // Seção de Mutations
  Mutation: {
    // 16 - Criando Dados
    addBook: (_, { title, author_id }) => {
      const newBook = {
        id: generateId(),
        title,
        author_id,
      };
      books.push(newBook);
      return newBook;
    },
    addReview: (_, { content, rating, book_id, date }) => {
      const newReview = {
        id: generateId(),
        content,
        rating,
        book_id,
        date,
      };
      reviews.push(newReview);
      return newReview;
    },

    // 17 - Atualizando Dados
    updateAuthor: (_, { id, name }) => {
      const author = authors.find((author) => author.id === id);
      if (author) {
        author.name = name;
        return author;
      }
      throw new Error("Author not found");
    },
    updateReview: (_, { id, content, rating, book_id, date }) => {
      const review = reviews.find((review) => review.id === id);
      if (review) {
        review.content = content;
        review.rating = rating;
        review.book_id = book_id;
        review.date = date;
        return review;
      }
      throw new Error("Review not found");
    },

    // 18 - Deletando Dados
    deleteAuthor: (_, { id }) => {
      const authorIndex = authors.findIndex((author) => author.id === id);
      if (authorIndex !== -1) {
        return authors.splice(authorIndex, 1)[0];
      }
      throw new Error("Author not found");
    },
    deleteBook: (_, { id }) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex !== -1) {
        return books.splice(bookIndex, 1)[0];
      }
      throw new Error("Book not found");
    },

    // 19 - Exercício 4: Excluir Review
    deleteReview: (_, { id }) => {
      const reviewIndex = reviews.findIndex((review) => review.id === id);
      if (reviewIndex !== -1) {
        return reviews.splice(reviewIndex, 1)[0];
      }
      throw new Error("Review not found");
    },

    // 20 - Exercício 5: Atualizar Livro
    updateBook: (_, { id, title, author_id }) => {
      const book = books.find((book) => book.id === id);
      if (book) {
        book.title = title;
        book.author_id = author_id;
        return book;
      }
      throw new Error("Book not found");
    },

    // 21 - Exercício 6: Criar Autor
    addAuthor: (_, { name }) => {
      const newAuthor = {
        id: generateId(),
        name,
      };
      authors.push(newAuthor);
      return newAuthor;
    },
  },
};

module.exports = {
  resolvers,
};
