import styles from './styles.js'

export default class YFormItem extends HTMLElement {
  static get observedAttributes() {
    return ['theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <label>${this.legend}</label>
                            <div class="form-item"><slot></slot></div>`
  }

  get legend() {
    return this.getAttribute('legend') || ''
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

  set legend(value) {
    this.setAttribute('legend', value)
  }

  connectedCallback() {
    this.formEle = this.closest('y-form')
    this.labelsEle = this.shadowRoot.querySelector('label')
    this.slotsEle = this.shadowRoot.querySelector('slot')

    this.slotsEleChange = () => this.handleSlotsEleChangeEvent()

    this.slotsEle.addEventListener('slotchange', this.slotsEleChange)

    this.handleTheme()
  }

  disconnectedCallback() {
    this.slotsEle.removeEventListener('slotchange', this.slotsEleChange)
  }

  handleSlotsEleChangeEvent() {
    this.inputEle = this.querySelector('[name]')

    if (this.inputEle && this.inputEle.required) {
      this.labelsEle.classList.add('is-required')
    }
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-form-item')) {
  customElements.define('y-form-item', YFormItem)
}
