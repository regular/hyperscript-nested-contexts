const hs = decorate(require('hyperscript'))
const ho = require('hyperobj')
const observable = require('observable')

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

const render = ho(
  function(v) {
    if (typeof v!=='object') return
    const h = this.ctx || hs
    return h('ol',
      Object.keys(v).map( (k)=> {
        const msg = observable()
        return (function(h) {
          msg('clickme')
          return h('li', [
            h('em.key', h('span', msg), this.call(this, k), {
              onclick: function() {
                msg('I was clicked')
                h.cleanup()
              }
            }),
            h('span.value', this.call(this, v[k], k))
          ])
        }).call(this, this.ctx = h.context())
      })
    )
  },
  function(v) {
    const h = this.ctx || hs
    return h('span.string', v)
  }
)

document.body.appendChild(
  render(require('./package.json'))
)
document.body.appendChild(hs('style', `
  span {padding: .1em;}
`))
