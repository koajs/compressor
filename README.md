# Koa Compressor

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
