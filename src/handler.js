const { nanoid } = require('nanoid');
const books = require('./books');


// TODO Kriteria 1 : API dapat menyimpan Buku
const addBooksHandler = (request, h) => {
  const {
    name, 
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16); // TODO nilai id dari nanoid
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  // TODO Jika Client tidak melampirkan properti namepada request body
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };

  // TODO Jika Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  };

  // TODO Bila buku berhasil dimasukkan
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      }
    });
    response.code(201);
    return response;
  };

  // TODO Server gagal memasukkan buku karena alasan umum (generic error). 
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// TODO Kriteria 2 : API dapat menampilkan buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let bookQuery = books;

  if (name !== undefined) {
    bookQuery = books.filter((book) => book.name.toLowerCase().include(name.toLowerCase()));
  }

  if (reading !== undefined) {
    bookQuery = books.filter((book) => book.reading === (reading === '1'));
  }

  if (finished !== undefined) {
    bookQuery = books.filter((book) => book.finished === (finished === '1'));
    
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookQuery.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }))
    }
  });
  response.code(200);
  return response;
};

// TODO Kriteria 3 : API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {

};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
};