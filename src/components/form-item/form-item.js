import styles from './styles.js'

export default class YFormItem extends HTMLElement {
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

  set legend(value) {
    this.setAttribute('legend', value)
  }

  connectedCallback() {
    this.formEle = this.closest('y-form')
    this.labelsEle = this.shadowRoot.querySelector('label')
    this.slotsEle = this.shadowRoot.querySelector('slot')

    this.slotsEleChange = () => this.handleSlotsEleChangeEvent()

    this.slotsEle.addEventListener('slotchange', this.slotsEleChange)
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
}

if (!customElements.get('y-form-item')) {
  customElements.define('y-form-item', YFormItem)
}
