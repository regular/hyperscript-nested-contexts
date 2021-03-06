const hs = require('.')(require('hyperscript'))
const ho = require('hyperobj')
const observable = require('observable')

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
