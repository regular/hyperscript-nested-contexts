const hs = require('hyperscript')
const ho = require('hyperobj')
const observable = require('observable')

function cleanup(h) {
  (h.nestedContexts || []).forEach(cleanup)
  h.cleanup()
}

function context(h) {
  let nh = hs.context()
  h.nestedContexts = (h.nestedContexts || [])
  h.nestedContexts.unshift(nh)
  return nh
}

const render = ho(
  function(v) {
    if (typeof v!=='object') return
    const h = this.ctx || hs
    return h('ol',
      Object.keys(v).map( (k)=> {
        const msg = observable()
        return (function(h) {
          msg('ctx')
          return h('li', [
            h('em.key', h('span', msg), this.call(this, k), {
              onclick: function() {
                msg('clicked')
                cleanup(h)
              }
            }),
            h('span.value', this.call(this, v[k], k))
          ])
        }).call(this, this.ctx = context(h))
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
