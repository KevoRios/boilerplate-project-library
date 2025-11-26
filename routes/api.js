'use strict';

module.exports = function (app) {
  
  // "Base de datos" en memoria para pasar los tests
  let books = [];

  // /api/books
  app.route('/api/books')
    
    // GET: listar todos los libros
    .get(function (req, res) {
      const response = books.map(b => ({
        _id: b._id,
        title: b.title,
        commentcount: b.comments.length
      }));
      res.json(response);
    })

    // POST: crear libro
    .post(function (req, res) {
      const { title } = req.body;

      if (!title) {
        return res.send('missing required field title');
      }

      const newBook = {
        _id: Math.random().toString(16).slice(2),
        title,
        comments: []
      };

      books.push(newBook);

      res.json({
        _id: newBook._id,
        title: newBook.title
      });
    })

    // DELETE: borrar todos los libros
    .delete(function (req, res) {
      books = [];
      res.send('complete delete successful');
    });

  // /api/books/:id
  app.route('/api/books/:id')

    // GET: obtener libro por id
    .get(function (req, res) {
      const bookid = req.params.id;
      const book = books.find(b => b._id === bookid);

      if (!book) {
        return res.send('no book exists');
      }

      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      });
    })

    // POST: agregar comentario
    .post(function (req, res) {
      const bookid = req.params.id;
      const { comment } = req.body;

      if (!comment) {
        return res.send('missing required field comment');
      }

      const book = books.find(b => b._id === bookid);

      if (!book) {
        return res.send('no book exists');
      }

      book.comments.push(comment);

      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      });
    })

    // DELETE: borrar un libro
    .delete(function (req, res) {
      const bookid = req.params.id;
      const index = books.findIndex(b => b._id === bookid);

      if (index === -1) {
        return res.send('no book exists');
      }

      books.splice(index, 1);
      res.send('delete successful');
    });

};

