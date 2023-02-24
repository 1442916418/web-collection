import styles from './styles.js'

// TODO: group
export default class YCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'checked', 'size', 'theme', 'circle']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const size = this.size ? `size="${this.size}"` : ''
    const circle = this.circle ? 'circle' : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <input type="checkbox" class="checkbox" id="checkbox">
                            <label id="label" for="checkbox" ${size} ${circle}>
                              <slot>&nbsp;</slot>
                            </label>
                            `
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get checked() {
    return this.getAttribute('checked') !== null
  }

  get name() {
    return this.getAttribute('name')
  }

  get size() {
    return this.getAttribute('size')
  }

  get circle() {
    return this.getAttribute('circle') !== null
  }

  get validity() {
    return this.checked
  }

  get noValidate() {
    return this.getAttribute('no-validate') !== null
  }

  get invalid() {
    return this.getAttribute('invalid') !== null
  }

  get invalidMessage() {
    return this.getAttribute('invalid-message') || this.checkboxEle.validationMessage || '请选择'
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
      this.removeAttribute('novalidate')
    } else {
      this.setAttribute('novalidate', '')
    }
  }

  set circle(value) {
    this.setAttribute('circle', value)
    this.labelEle.setAttribute('circle', value)
  }

  set size(value) {
    this.setAttribute('size', value)
    this.labelEle.setAttribute('size', value)
  }

  set checked(value) {
    if (value === null || value === false) {
      this.removeAttribute('checked')
    } else {
      this.setAttribute('checked', '')
    }
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  connectedCallback() {
    this.setAttribute('sign', 'query')

    this.formEle = this.closest('y-form')
    this.checkboxEle = this.shadowRoot.getElementById('checkbox')
    this.labelEle = this.shadowRoot.getElementById('label')

    this.checkboxChange = (e) => this.handleCheckboxChangeEvent(e)
    this.checkboxKeydown = (e) => this.handleCheckboxKeydownEvent(e)
    this.checkboxFocus = (e) => this.handleCheckboxFocusEvent(e)
    this.checkboxBlur = (e) => this.handleCheckboxBlurFocusEvent(e)

    this.checkboxEle.addEventListener('change', this.checkboxChange)
    this.checkboxEle.addEventListener('keydown', this.checkboxKeydown)
    this.checkboxEle.addEventListener('focus', this.checkboxFocus)
    this.checkboxEle.addEventListener('blur', this.checkboxBlur)

    this.disabled = this.disabled
    this.checked = this.checked

    this.handleTheme()
  }

  disconnectedCallback() {
    this.checkboxEle.removeEventListener('change', this.checkboxChange)
    this.checkboxEle.removeEventListener('keydown', this.checkboxKeydown)
    this.checkboxEle.removeEventListener('focus', this.checkboxFocus)
    this.checkboxEle.removeEventListener('blur', this.checkboxBlur)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.checkboxEle) {
      if (newValue !== null) {
        this.checkboxEle.setAttribute('disabled', 'disabled')
      } else {
        this.checkboxEle.removeAttribute('disabled')
      }
    }
    if (name === 'checked' && this.checkboxEle) {
      if (newValue !== null) {
        this.checkboxEle.checked = true
      } else {
        this.checkboxEle.checked = false
      }
    }
    if (name === 'theme' && this.labelEle) {
      if (newValue === null) {
        this.labelEle.removeAttribute('theme')
      } else {
        this.labelEle.setAttribute('theme', newValue)
      }
    }
    if (name === 'size' && this.labelEle) {
      if (newValue === null) {
        this.labelEle.removeAttribute('size')
      } else {
        this.labelEle.setAttribute('size', newValue)
      }
    }
    if (name === 'circle' && this.labelEle) {
      if (newValue === null) {
        this.labelEle.removeAttribute('circle')
      } else {
        this.labelEle.setAttribute('circle', '')
      }
    }
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
    this.checked = false
    this.invalidMessage = ''
    this.invalid = false
  }

  focus() {
    this.checkboxEle.focus()
  }

  handleCheckboxChangeEvent() {
    this.checked = this.checkboxEle.checked

    // this.checkValidity()

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: this.checked
        }
      })
    )
  }

  handleCheckboxKeydownEvent(e) {
    if (e.code === 'Enter') {
      this.checked = !this.checked
    }
  }

  handleCheckboxFocusEvent(e) {
    e.stopPropagation()

    if (!this.isFocus) {
      this.dispatchEvent(
        new CustomEvent('focus', {
          detail: {
            value: this.value
          }
        })
      )
    }
  }

  handleCheckboxBlurFocusEvent(e) {
    e.stopPropagation()

    if (getComputedStyle(this.checkboxEle).zIndex == 2) {
      this.isFocus = true
    } else {
      this.isFocus = false
      this.dispatchEvent(
        new CustomEvent('blur', {
          detail: {
            value: this.value
          }
        })
      )
    }
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-checkbox')) {
  customElements.define('y-checkbox', YCheckbox)
}
