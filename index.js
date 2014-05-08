
var compressible = require('compressible')
var isJSON = require('koa-is-json')
var status = require('statuses')
var zlib = require('mz/zlib')
var bytes = require('bytes')

module.exports = function (options) {
  options = options || {}

  var filter = options.filter || compressible
  var threshold = options.threshold || 1024
  if (typeof threshold === 'string') threshold = bytes(threshold)

  return function* compressor(next) {
    yield* next

    var body = this.response.body
    if (!body) return
    if (this.request.method === 'HEAD') return
    if (status.empty[this.response.status]) return
    if (this.response.get('Content-Encoding')) return
    if (!filter(this.response.type)) return
    if (isJSON(body)) body = this.body = JSON.stringify(body)
    if (this.response.length < threshold) return

    this.response.set('Content-Encoding', 'gzip')
    this.response.remove('Content-Length')

    this.body = typeof body.pipe === 'function'
      ? body.pipe(zlib.Gzip(options))
      : (yield zlib.gzip(body))
  }
}
