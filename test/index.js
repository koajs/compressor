
var request = require('supertest')
var assert = require('assert')
var http = require('http')
var koa = require('koa')
var Stream = require('stream')
var crypto = require('crypto')
var fs = require('fs')
var path = require('path')
var compress = require('..')

describe('Compress', function () {
  var buffer = crypto.randomBytes(1024)
  var string = buffer.toString('hex')

  function* sendString(next) {
    this.body = string
  }

  function* sendBuffer(next) {
    this.type = 'text'
    this.body = buffer
  }

  it('should compress strings', function (done) {
    var app = koa()

    app.use(compress())
    app.use(sendString)

    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err)
        return done(err)

      res.should.have.header('Content-Encoding', 'gzip')
      res.should.have.header('Content-Length')
      res.should.not.have.header('Vary', 'Accept-Encoding')
      res.text.should.equal(string)

      done()
    })
  })

  it('should not compress strings below threshold', function (done) {
    var app = koa()

    app.use(compress({
      threshold: '1mb'
    }))
    app.use(sendString)

    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err)
        return done(err)

      res.should.have.header('Content-Length', '2048')
      res.should.not.have.header('Vary', 'Accept-Encoding')
      res.headers.should.not.have.property('content-encoding')
      res.headers.should.not.have.property('transfer-encoding')
      res.text.should.equal(string)

      done()
    })
  })

  it('should compress JSON body', function (done) {
    var app = koa()
    var jsonBody = { 'status': 200, 'message': 'ok', 'data': string }

    app.use(compress())
    app.use(function* (next) {
      this.body = jsonBody
    })

    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err)
        return done(err)

      res.should.have.header('Content-Length')
      res.should.not.have.header('Vary', 'Accept-Encoding')
      res.text.should.equal(JSON.stringify(jsonBody))

      done()
    })
  })

  it('should not compress JSON body below threshold', function (done) {
    var app = koa()
    var jsonBody = { 'status': 200, 'message': 'ok' }

    app.use(compress())
    app.use(function* sendJSON(next) {
      this.body = jsonBody
    })

    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err)
        return done(err)

      res.should.not.have.header('Vary', 'Accept-Encoding')
      res.headers.should.not.have.property('content-encoding')
      res.headers.should.not.have.property('transfer-encoding')
      res.text.should.equal(JSON.stringify(jsonBody))

      done()
    })
  })

  it('should compress buffers', function (done) {
    var app = koa()

    app.use(compress())
    app.use(sendBuffer)

    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err)
        return done(err)

      res.should.have.header('Content-Encoding', 'gzip')
      res.should.have.header('Content-Length')
      res.should.not.have.header('Transfer-Encoding', 'chunked')
      res.should.not.have.header('Vary', 'Accept-Encoding')

      done()
    })
  })

  it('should compress streams', function (done) {
    var app = koa()

    app.use(compress())

    app.use(function* (next) {
      this.type = 'application/javascript'
      this.body = fs.createReadStream(path.join(__dirname, 'index.js'))
    })

    request(app.listen())
    .get('/')
    .expect(200)
    .end(function (err, res) {
      if (err)
        return done(err)

      res.should.have.header('Content-Encoding', 'gzip')
      res.should.have.header('Transfer-Encoding', 'chunked')
      res.should.not.have.header('Content-Length')
      res.should.not.have.header('Vary', 'Accept-Encoding')

      done()
    })
  })

  it('should not compress HEAD requests', function (done) {
    var app = koa()

    app.use(compress())
    app.use(sendString)

    request(app.listen())
    .head('/')
    .expect(200)
    .expect('', function (err, res) {
      if (err)
        return done(err)

      res.headers.should.not.have.property('content-encoding')

      done()
    })
  })

  it('should ignore accept-encoding', function (done) {
    var app = koa()

    app.use(compress())
    app.use(sendBuffer)

    request(app.listen())
    .get('/')
    .set('Accept-Encoding', 'sdch')
    .expect(200, done)
  })

  it('should not crash if a type does not pass the filter', function (done) {
    var app = koa()

    app.use(compress())
    app.use(function* () {
      this.type = 'image/png'
      this.body = new Buffer(2048)
    })

    request(app.listen())
    .get('/')
    .expect(200, done)
  })

  it('should not compress when transfer-encoding is already set', function (done) {
    var app = koa()

    app.use(compress({
      threshold: 0
    }))
    app.use(function* () {
      this.set('Content-Encoding', 'identity')
      this.type = 'text'
      this.body = 'asdf'
    })

    request(app.listen())
    .get('/')
    .expect('asdf', done)
  })
})
