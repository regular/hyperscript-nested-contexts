module.exports = function(hs) {

  function cleanup() {
    (this._nestedContexts || []).forEach((ctx)=>cleanup.call(ctx))
    this._cleanup()
  }

  function context() {
    let nh = hs._context()
    nh = decorate(nh)
    this._nestedContexts = (this._nestedContexts || [])
    this._nestedContexts.unshift(nh)
    return nh
  }

  function decorate(h) {
    h._cleanup = h.cleanup
    h.cleanup = cleanup.bind(h)
    if (h.context) h._context = h.context
    h.context = context.bind(h)
    return h
  }

  return decorate(hs)
}
