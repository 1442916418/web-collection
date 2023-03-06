import styles from './styles.js'

class YButtonGroup extends HTMLElement {
  static get observedAttributes() {
    return ['disabled']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style><slot></slot>`
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }
}

if (!customElements.get('y-button-group')) {
  customElements.define('y-button-group', YButtonGroup)
}
