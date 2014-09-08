
# Koa Compressor

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Similar to [koa-compress][koa-compress],
except it basically __always__ compresses the response to `gzip`.
This is particularly nice for SPDY as the specifications states that user agents must [always support gzip compression](http://www.chromium.org/spdy/spdy-protocol/spdy-protocol-draft3#TOC-3.2-HTTP-Request-Response).
Thus, this compression middleware is a little simpler.

Differences:

- `Accept-Encoding` is ignored
- No `vary` header is set
- No `this.compress` option
- Sets `content-length` on compressed bodies if available (should probably port that to [koa-compress][koa-compress])

[koa-compress]: https://github.com/koajs/compress
[npm-image]: https://img.shields.io/npm/v/koa-compressor.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-compressor
[github-tag]: http://img.shields.io/github/tag/koajs/compressor.svg?style=flat-square
[github-url]: https://github.com/koajs/compressor/tags
[travis-image]: https://img.shields.io/travis/koajs/compressor.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/compressor
[coveralls-image]: https://img.shields.io/coveralls/koajs/compressor.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/compressor?branch=master
[david-image]: http://img.shields.io/david/koajs/compressor.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/compressor
[license-image]: http://img.shields.io/npm/l/koa-compressor.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/koa-compressor.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/koa-compressor
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
