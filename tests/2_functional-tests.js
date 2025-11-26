const chai = require('chai');
let assert = chai.assert;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  this.timeout(5000);

  let testBookId;        // para usar en varios tests
  const invalidId = '1234567890abcdef12345678';

  // 1) Crear libro con title
  test('Create a book with title: POST /api/books', function (done) {
    chai
      .request(server)
      .post('/api/books')
      .send({ title: 'Libro de prueba' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.equal(res.body.title, 'Libro de prueba');
        testBookId = res.body._id;
        done();
      });
  });

  // 2) Crear libro sin title
  test('Create a book with missing title: POST /api/books', function (done) {
    chai
      .request(server)
      .post('/api/books')
      .send({ }) // sin title
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing required field title');
        done();
      });
  });

  // 3) GET /api/books (todos los libros)
  test('Get all books: GET /api/books', function (done) {
    chai
      .request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        if (res.body.length > 0) {
          const book = res.body[0];
          assert.property(book, 'title');
          assert.property(book, '_id');
          assert.property(book, 'commentcount');
        }
        done();
      });
  });

  // 4) GET /api/books/:id con id válido
  test('Get a book by id: GET /api/books/{_id} with valid id', function (done) {
    chai
      .request(server)
      .get('/api/books/' + testBookId)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.property(res.body, 'comments');
        assert.equal(res.body._id, testBookId);
        assert.isArray(res.body.comments);
        done();
      });
  });

  // 5) GET /api/books/:id con id inválido
  test('Get a book by id: GET /api/books/{_id} with invalid id', function (done) {
    chai
      .request(server)
      .get('/api/books/' + invalidId)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
        done();
      });
  });

  // 6) POST comment a libro válido
  test('Add a comment: POST /api/books/{_id}', function (done) {
    chai
      .request(server)
      .post('/api/books/' + testBookId)
      .send({ comment: 'Primer comentario' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, '_id');
        assert.property(res.body, 'title');
        assert.property(res.body, 'comments');
        assert.equal(res.body._id, testBookId);
        assert.isArray(res.body.comments);
        assert.isAtLeast(res.body.comments.length, 1);
        assert.include(res.body.comments, 'Primer comentario');
        done();
      });
  });

  // 7) POST comment sin comment
  test('Add a comment with missing comment field: POST /api/books/{_id}', function (done) {
    chai
      .request(server)
      .post('/api/books/' + testBookId)
      .send({ }) // sin comment
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'missing required field comment');
        done();
      });
  });

  // 8) POST comment a libro que no existe
  test('Add a comment to non-existing book: POST /api/books/{_id}', function (done) {
    chai
      .request(server)
      .post('/api/books/' + invalidId)
      .send({ comment: 'No debería guardar' })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'no book exists');
        done();
      });
  });

  // 9) DELETE un libro por id
  test('Delete a book by id: DELETE /api/books/{_id}', function (done) {
    chai
      .request(server)
      .delete('/api/books/' + testBookId)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'delete successful');
        done();
      });
  });

  // 10) DELETE todos los libros
  test('Delete all books: DELETE /api/books', function (done) {
    chai
      .request(server)
      .delete('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.text, 'complete delete successful');
        done();
      });
  });

});

