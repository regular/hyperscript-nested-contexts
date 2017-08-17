# hyperscript-nested-contexts

Hyperscript's `context()` function returns an object that implements the hyperscript API, but it misses a `context()` function itself. This module fixes this.

```
require('hyperscript').context().conext()
```

## Example

```
const hs = require('hyperscript-nested-contexts')(require('hyperscript'))
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
```

(Clicking on a parent will remove event handlers and observables from children)
