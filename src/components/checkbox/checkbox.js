import styles from './styles.js'

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

    this.checkboxEle = this.shadowRoot.getElementById('checkbox')
    this.labelEle = this.shadowRoot.getElementById('label')

    this.checkboxChange = (e) => this.handleSwitchChangeEvent(e)
    this.checkboxKeydown = (e) => this.handleSwitchKeydownEvent(e)
    this.checkboxFocus = (e) => this.handleSwitchFocusEvent(e)
    this.checkboxBlur = (e) => this.handleBlurFocusEvent(e)

    this.checkboxEle.addEventListener('change', this.checkboxChange)
    this.checkboxEle.addEventListener('keydown', this.checkboxKeydown)
    this.checkboxEle.addEventListener('focus', this.checkboxFocus)
    this.checkboxEle.addEventListener('blur', this.checkboxBlur)

    this.disabled = this.disabled
    this.checked = this.checked
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

  focus() {
    this.checkboxEle.focus()
  }

  handleSwitchChangeEvent() {
    this.checked = this.checkboxEle.checked

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: this.checked
        }
      })
    )
  }

  handleSwitchKeydownEvent(e) {
    if (e.code === 'Enter') {
      this.checked = !this.checked
    }
  }

  handleSwitchFocusEvent(e) {
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

  handleBlurFocusEvent(e) {
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
}

if (!customElements.get('y-checkbox')) {
  customElements.define('y-checkbox', YCheckbox)
}
