const etch = require('etch');

module.exports = class SelectList {

  constructor (props, children) {
    etch.initialize(this);
  }

  render () {
    console.log(this);
    return etch.dom.div(
        { className: 'status-bar', innerHTML: 'hi' }
    );
  }

  update (props, children) {
    return etch.update(this);
  }

  destroy () {
    return etch.destroy(this);
  }
}
