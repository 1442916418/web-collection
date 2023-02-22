import styles from './styles.js'

export default class YCheckboxGroup extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'required']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style><slot></slot>`
  }

  get name() {
    return this.getAttribute('name')
  }

  get min() {
    const min = this.getAttribute('min') || 0
    return this.required ? Math.max(1, min) : min
  }

  get max() {
    return this.getAttribute('max') || Infinity
  }

  get required() {
    return this.getAttribute('required') !== null
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get defaultValue() {
    const values = this.getAttribute('default-value')
    return values ? values.split(',') : []
  }

  get value() {
    return [...this.querySelectorAll('y-checkbox[checked]')].map((el) => el.value)
  }

  get noValidate() {
    return this.getAttribute('no-validate') !== null
  }

  get validity() {
    if (!this.required && !this.valueLength) {
      return true
    }

    return this.valueLength >= this.min && this.valueLength <= this.max
  }

  get invalid() {
    return this.getAttribute('invalid') !== null
  }

  get invalidMessage() {
    let msg = '请选择'

    if (this.valueLength < this.min) {
      msg = `最少选择 ${this.min} 项`
    }
    if (this.valueLength > this.max) {
      msg = `最多选择 ${this.max} 项`
    }

    return this.getAttribute('invalid-message') || msg
  }

  get valueLength() {
    return this.value.length
  }

  set invalidMessage(value) {
    this.setAttribute('msg', value)
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  set value(value) {
    this.elements.forEach((el) => {
      if (value.includes(el.value)) {
        el.checked = true
      } else {
        el.checked = false
      }
    })
  }

  set required(value) {
    if (value === null || value === false) {
      this.removeAttribute('required')
    } else {
      this.setAttribute('required', '')
    }
  }

  set noValidate(value) {
    if (value === null || value === false) {
      this.removeAttribute('no-validate')
    } else {
      this.setAttribute('no-validate', '')
    }
  }

  set invalid(value) {
    if (value === null || value === false) {
      this.removeAttribute('invalid')
    } else {
      this.setAttribute('invalid', '')
    }
  }

  connectedCallback() {
    this.formEle = this.closest('y-form')
    this.slotsEle = this.shadowRoot.querySelector('slot')

    this.slotchange = () => this.handleSlotsChangeEvent()

    this.slotsEle.addEventListener('slotchange', this.slotchange)
  }

  disconnectedCallback() {
    this.slotsEle.removeEventListener('slotchange', this.slotchange)
  }

  handleSlotsChangeEvent() {
    this.elements = this.querySelectorAll('y-checkbox')
    this.value = this.defaultValue

    this.elements.forEach((el) => {
      el.addEventListener('change', () => {
        this.checkValidity()
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              value: this.value
            }
          })
        )
      })
    })
  }

  focus() {
    this.elements.length && this.elements[0].focus()
  }

  checkAll() {
    this.elements.forEach((el) => {
      el.checked = true
    })
  }

  checkValidity() {
    this.invalidMessage = ''

    if (this.noValidate || this.disabled || (this.formEle && this.formEle.noValidate)) {
      return true
    }

    if (this.validity) {
      this.invalid = false
      return true
    }

    this.focus()
    this.invalid = true
    this.invalidMessage = this.invalidMessage

    return false
  }

  reset() {
    this.value = this.defaultValue
    this.invalidMessage = ''
    this.invalid = false
  }
}

if (!customElements.get('y-checkbox-group')) {
  customElements.define('y-checkbox-group', YCheckboxGroup)
}
