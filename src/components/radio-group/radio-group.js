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

  set value(value) {
    this.elements.forEach((el) => {
      el.checked = value === el.value
    })
  }

  set required(value) {
    if (value === null || value === false) {
      this.removeAttribute('required')
    } else {
      this.setAttribute('required', '')
    }
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  reset() {
    this.value = this.defaultValue
  }

  connectedCallback() {
    this.slotsEle = this.shadowRoot.querySelector('slot')

    this.slotchange = () => this.handleSlotsChangeEvent()

    this.slotsEle.addEventListener('slotchange', this.slotchange)
  }

  disconnectedCallback() {
    this.slotsEle.removeEventListener('slotchange', this.radioChange)
  }

  handleSlotsChangeEvent() {
    this.elements = this.querySelectorAll('y-radio')
    this.value = this.defaultValue

    this.elements.forEach((el) => {
      el.addEventListener('change', () => {
        if (el.checked) {
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
    this.init = true
  }
}

if (!customElements.get('y-radio-group')) {
  customElements.define('y-radio-group', YRadioGroup)
}
