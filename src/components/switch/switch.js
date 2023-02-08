import styles from './styles.js'

export default class YSwitch extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'checked', 'size', 'theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const size = this.size ? `size="${this.size}"` : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <input type="checkbox" class="switch" id="switch">
                            <slot name="inactive"></slot>
                            <label id="label" for="switch" ${size}></label>
                            <slot name="active"></slot>
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

    this.switchEle = this.shadowRoot.getElementById('switch')
    this.labelEle = this.shadowRoot.getElementById('label')

    this.switchChange = (e) => this.handleSwitchChangeEvent(e)
    this.switchKeydown = (e) => this.handleSwitchKeydownEvent(e)
    this.switchFocus = (e) => this.handleSwitchFocusEvent(e)
    this.switchBlur = (e) => this.handleBlurFocusEvent(e)

    this.switchEle.addEventListener('change', this.switchChange)
    this.switchEle.addEventListener('keydown', this.switchKeydown)
    this.switchEle.addEventListener('focus', this.switchFocus)
    this.switchEle.addEventListener('blur', this.switchBlur)

    this.disabled = this.disabled
    this.checked = this.checked
  }

  disconnectedCallback() {
    this.switchEle.removeEventListener('change', this.switchChange)
    this.switchEle.removeEventListener('keydown', this.switchKeydown)
    this.switchEle.removeEventListener('focus', this.switchFocus)
    this.switchEle.removeEventListener('blur', this.switchBlur)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.switchEle) {
      if (newValue !== null) {
        this.switchEle.setAttribute('disabled', 'disabled')
      } else {
        this.switchEle.removeAttribute('disabled')
      }
    }
    if (name === 'checked' && this.switchEle) {
      if (newValue !== null) {
        this.switchEle.checked = true
      } else {
        this.switchEle.checked = false
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
  }

  focus() {
    this.switchEle.focus()
  }

  handleSwitchChangeEvent() {
    this.checked = this.switchEle.checked

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

    if (getComputedStyle(this.switchEle).zIndex == 2) {
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

if (!customElements.get('y-switch')) {
  customElements.define('y-switch', YSwitch)
}
