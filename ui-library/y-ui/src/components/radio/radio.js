import styles from './styles.js'

export default class YRadio extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'checked', 'size', 'theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const size = this.size ? `size="${this.size}"` : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <input type="radio" class="radio" id="radio">
                            <label id="label" for="radio" ${size}>
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

  get value() {
    return this.getAttribute('value')
  }

  get theme() {
    return this.getAttribute('theme')
  }

  set theme(value) {
    if (this.labelEle) {
      if (value) {
        this.labelEle.setAttribute('theme', value)
      } else {
        this.labelEle.removeAttribute('theme')
      }
    }
  }

  set value(value) {
    this.setAttribute('value', value)
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

    this.radioGroupEle = this.closest('y-radio-group')
    this.parentEle = this.radioGroupEle || this.getRootNode()
    this.radioEle = this.shadowRoot.getElementById('radio')
    this.labelEle = this.shadowRoot.getElementById('label')

    this.radioChange = (e) => this.handleRadioChangeEvent(e)

    this.radioEle.addEventListener('change', this.radioChange)

    this.disabled = this.disabled
    this.checked = this.checked

    this.handleTheme()
  }

  disconnectedCallback() {
    this.radioEle.removeEventListener('change', this.radioChange)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.radioEle) {
      if (newValue !== null) {
        this.radioEle.setAttribute('disabled', 'disabled')
      } else {
        this.radioEle.removeAttribute('disabled')
      }
    }
    if (name === 'checked' && this.radioEle) {
      if (newValue !== null) {
        this.radioEle.checked = true
      } else {
        this.radioEle.checked = false
      }
    }
    if (name === 'theme' && this.labelEle) {
      if (newValue === null || newValue !== 'dark') {
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
  }

  handleChecked() {
    const selector = this.radioGroupEle ? `y-radio[checked]` : `y-radio[name="${this.name}"][checked]`
    const prev = this.parentEle.querySelector(selector)

    if (prev) {
      prev.checked = false
    }
    this.checked = true
  }

  focus() {
    this.radioEle.focus()
  }

  handleRadioChangeEvent() {
    this.handleChecked()

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          checked: this.checked
        }
      })
    )
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-radio')) {
  customElements.define('y-radio', YRadio)
}
