export default class YTabPane extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'key', 'disabled', 'icon']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<slot></slot>`
  }

  get label() {
    return this.getAttribute('label') || ''
  }

  get icon() {
    return this.getAttribute('icon')
  }

  get key() {
    return this.getAttribute('key')
  }

  get disabled() {
    return this.getAttribute('disabled')
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', value)
    }
  }

  set label(value) {
    this.setAttribute('label', value)
  }

  set key(value) {
    this.setAttribute('key', value)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && newValue !== undefined) {
      if (name === 'label') {
        this.parentNode.updateLabel && this.parentNode.updateLabel(this.key, newValue)
      }
      if (name === 'disabled') {
        this.parentNode.updateDisabled && this.parentNode.updateDisabled(this.key, newValue)
      }
    }
  }
}

if (!customElements.get('y-tab-pane')) {
  customElements.define('y-tab-pane', YTabPane)
}
