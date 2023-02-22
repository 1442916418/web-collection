import styles from './styles.js'

class YRadioGroup extends HTMLElement {
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

  get required() {
    return this.getAttribute('required') !== null
  }

  get defaultValue() {
    return this.getAttribute('default-value') || ''
  }

  get value() {
    const radio = this.querySelector('y-radio[checked]')
    return radio ? radio.value : ''
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get validity() {
    return this.value !== ''
  }

  get noValidate() {
    return this.getAttribute('no-validate') !== null
  }

  get invalid() {
    return this.getAttribute('invalid') !== null
  }

  get invalidMessage() {
    return this.getAttribute('invalid-message') || '请选择一项'
  }

  get required() {
    return this.getAttribute('required') !== null
  }

  set required(value) {
    if (value === null || value === false) {
      this.removeAttribute('required')
    } else {
      this.setAttribute('required', '')
    }
  }

  set invalidMessage(value) {
    this.setAttribute('msg', value)
  }

  set invalid(value) {
    if (value === null || value === false) {
      this.removeAttribute('invalid')
    } else {
      this.setAttribute('invalid', '')
    }
  }

  set noValidate(value) {
    if (value === null || value === false) {
      this.removeAttribute('no-validate')
    } else {
      this.setAttribute('no-validate', '')
    }
  }

  set value(value) {
    this.elements.forEach((el) => {
      el.checked = value === el.value
    })
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
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

  handleSlotsChangeEvent() {
    this.elements = this.querySelectorAll('y-radio')
    this.value = this.defaultValue

    this.elements.forEach((el) => {
      el.addEventListener('change', () => {
        if (el.checked) {
          this.checkValidity()
          this.dispatchEvent(
            new CustomEvent('change', {
              detail: {
                value: this.value
              }
            })
          )
        }
      })
    })
  }
}

if (!customElements.get('y-radio-group')) {
  customElements.define('y-radio-group', YRadioGroup)
}
