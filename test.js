const hs = require('hyperscript')
const ho = require('hyperobj')
const observable = require('observable')

const render = ho(
  function(v) {
    if (typeof v!=='object') return
    const h = this.ctx || hs
    console.log('context:', h.n)
    return h('ol',
      Object.keys(v).map( (k)=> {
        const msg = observable()
        return (function(h) {
          msg('ctx'+h.n)
          return h('li', [
            h('em.key', h('span', msg), this.call(this, k), {
              onclick: function() {
                msg('clicked')
                h.cleanup()
              }
            }),
            h('span.value', this.call(this, v[k], k))
          ])
        }).call(this, this.ctx = Object.assign(h.context(), {context: h.context.bind(h), n: h.n ? h.n+1: 1}))
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
