import styles from './styles.js'

export default class YTips extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style><slot></slot>`
  }

  get dir() {
    return this.getAttribute('dir') || 't'
  }

  get tips() {
    return this.getAttribute('tips')
  }

  get type() {
    return this.getAttribute('type')
  }

  get suffix() {
    return this.getAttribute('suffix') || ''
  }

  get prefix() {
    return this.getAttribute('prefix') || ''
  }

  get show() {
    return this.getAttribute('show') !== null
  }

  set dir(value) {
    this.setAttribute('dir', value)
  }

  set tips(value) {
    this.setAttribute('tips', value)
  }

  set suffix(value) {
    this.setAttribute('suffix', value)
  }

  set prefix(value) {
    this.setAttribute('prefix', value)
  }

  set show(value) {
    this.setAttribute('show', value)
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  connectedCallback() {
    if (this.dir === 'auto') {
      const { left, top, width, height } = this.getBoundingClientRect()
      const w = document.body.scrollWidth
      const h = document.body.scrollHeight
      const TIP_SIZE = 50

      if (top < TIP_SIZE) {
        // bottom
        this.dir = 'b'
      }
      if (h - top - height < TIP_SIZE) {
        // top
        this.dir = 't'
      }
      if (left < TIP_SIZE) {
        // right
        this.dir = 'r'
      }
      if (w - left - width < TIP_SIZE) {
        // left
        this.dir = 'l'
      }
    }

    this.setAttribute('sign', 'query')
  }
}

if (!customElements.get('y-tips')) {
  customElements.define('y-tips', YTips)
}
