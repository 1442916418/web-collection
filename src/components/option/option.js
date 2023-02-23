import styles from './styles.js'

export default class YSelectOption extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'size', 'label', 'selected', 'value', 'type', 'theme']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const disabled = this.disabled ? `disabled="${this.disabled}"` : ''
    const label = this.label ? `label="${this.label}"` : ''
    const selected = this.selected ? `selected="${this.selected}"` : ''
    const value = this.value ? `value="${this.value}"` : ''
    const type = this.type ? `type="${this.type}"` : ''

    shadowRoot.innerHTML = `<style>${styles}</style><option class="option" id="option" ${disabled} ${label} ${selected} ${value} ${type}></option>`
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get size() {
    return this.getAttribute('size')
  }

  get label() {
    return this.getAttribute('label')
  }

  get selected() {
    return this.getAttribute('selected') !== null
  }

  get value() {
    return this.getAttribute('value')
  }

  get type() {
    return this.getAttribute('type')
  }

  get theme() {
    return this.getAttribute('theme')
  }

  set theme(value) {
    if (value) {
      this.setAttribute('theme', value)
    } else {
      this.removeAttribute('theme')
    }
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  set size(value) {
    this.setAttribute('size', value)
  }

  set label(value) {
    this.setAttribute('label', value)
  }

  set selected(value) {
    this.setAttribute('selected', value)
  }

  connectedCallback() {
    this.optionEle = this.shadowRoot.getElementById('option')

    this.setAttribute('sign', 'query')
    this.handleTheme()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'disabled' && this.optionEle) {
      this.optionEle.disabled = !!newValue
    }
    if (name === 'selected' && this.optionEle) {
      this.optionEle.selected = newValue
    }
  }

  focus() {
    this.optionEle.focus()
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-select-option')) {
  customElements.define('y-select-option', YSelectOption)
}
