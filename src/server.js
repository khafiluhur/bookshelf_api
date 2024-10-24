const Hapi = require('@hapi/hapi');
const fs = require('fs').promises;
const path = require('path');
const createResponse = require('./models/Response');
const { nanoid } = require('nanoid');

// Path to the books.json file
// eslint-disable-next-line no-undef
const booksFilePath = path.join(__dirname, 'books.json');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  // GET all books
  server.route({
    method: 'GET',
    path: '/books',
    handler: async (request, h) => {
      try {
        const data = await fs.readFile(booksFilePath, 'utf-8');
        const bookDataArray = JSON.parse(data);

        const { name, reading, finished } = request.query;

        let filteredBooks = bookDataArray;

        if (name) {
          filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
          );
        }

        if (reading !== undefined) {
          const isReading = reading === '1';
          filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
        }

        if (finished !== undefined) {
          const isFinished = finished === '1';
          filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
        }

        const books = filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));

        return h.response(createResponse('success', null, { books })).code(200);
      } catch (error) {
        console.error('Error reading books data:', error);
        return h.response(createResponse('error', 'Failed to read books data', null)).code(500);
      }
    }
  });

  // POST new book
  server.route({
    method: 'POST',
    path: '/books',
    handler: async (request, h) => {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      if (!name) {
        return h.response(createResponse('fail', 'Gagal menambahkan buku. Mohon isi nama buku', null)).code(400);
      }

      if (readPage > pageCount) {
        return h.response(createResponse('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', null)).code(400);
      }

      const newBook = {
        id: nanoid(),
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        insertedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const books = JSON.parse(await fs.readFile(booksFilePath, 'utf-8'));
      books.push(newBook);
      await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));

      return h.response(createResponse('success', 'Buku berhasil ditambahkan', { bookId: newBook.id })).code(201);
    }
  });

  // GET detail book
  server.route({
    method: 'GET',
    path: '/books/{bookId}',
    handler: async (request, h) => {
      const { bookId } = request.params;
      try {
        const data = await fs.readFile(booksFilePath, 'utf-8');
        const books = JSON.parse(data);
        const book = books.find((b) => b.id === bookId);

        if (book) {
          return h.response(createResponse('success', null, { book })).code(200);
        } else {
          return h.response(createResponse('fail', 'Buku tidak ditemukan', null)).code(404);
        }
      } catch (error) {
        console.error('Error reading books data:', error);
        return h.response(createResponse('error', 'Failed to read books data', null)).code(500);
      }
    }
  });

  // PUT update book
  server.route({
    method: 'PUT',
    path: '/books/{bookId}',
    handler: async (request, h) => {
      const { bookId } = request.params;
      const updatedBookData = request.payload;

      try {
        const data = await fs.readFile(booksFilePath, 'utf-8');
        const books = JSON.parse(data);
        const bookIndex = books.findIndex((b) => b.id === bookId);

        if (!updatedBookData.name) {
          return h.response(createResponse('fail', 'Gagal memperbarui buku. Mohon isi nama buku', null)).code(400);
        }

        if (updatedBookData.readPage > updatedBookData.pageCount) {
          return h.response(createResponse('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', null)).code(400);
        }

        if (bookIndex !== -1) {
          books[bookIndex] = {
            ...books[bookIndex],
            ...updatedBookData,
            updatedAt: new Date().toISOString()
          };
          await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));

          return h.response(createResponse('success', 'Buku berhasil diperbarui')).code(200);
        } else {
          return h.response(createResponse('fail', 'Gagal memperbarui buku. Id tidak ditemukan', null)).code(404);
        }
      } catch (error) {
        console.error('Error updating book data:', error);
        return h.response(createResponse('error', 'Failed to update book data', null)).code(500);
      }
    }
  });

  // DELETE book
  server.route({
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: async (request, h) => {
      const { bookId } = request.params;

      try {
        const data = await fs.readFile(booksFilePath, 'utf-8');
        const books = JSON.parse(data);
        const bookIndex = books.findIndex((b) => b.id === bookId);

        if (bookIndex !== -1) {
          books.splice(bookIndex, 1);
          await fs.writeFile(booksFilePath, JSON.stringify(books, null, 2));
          return h.response(createResponse('success', 'Buku berhasil dihapus', null)).code(200);
        } else {
          return h.response(createResponse('fail', 'Buku gagal dihapus. Id tidak ditemukan', null)).code(404);
        }
      } catch (error) {
        console.error('Error deleting book data:', error);
        return h.response(createResponse('error', 'Failed to delete book data', null)).code(500);
      }
    }
  });

  // Start the server
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
