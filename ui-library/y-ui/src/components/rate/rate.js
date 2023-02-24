import styles from './styles.js'

export default class YRate extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'void-color', 'fill-color']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style>${this.getRateElements()}`
  }

  get length() {
    return this.getAttribute('length') || 5
  }

  get icon() {
    return this.getAttribute('icon') || 'like'
  }

  get size() {
    return this.getAttribute('size') || 32
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get defaultValue() {
    return this.getAttribute('default-value') || 0
  }

  get value() {
    return this.shadowRoot.value
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  set value(value) {
    if (value === 0) {
      this.radioEle[this.value - 1].checked = false
    } else {
      this.radioEle[+value - 1].checked = true
    }

    this.shadowRoot.value = value
  }

  connectedCallback() {
    this.radioEle = [...this.shadowRoot.querySelectorAll('input[type="radio"]')].reverse()

    if (this.defaultValue) {
      this.shadowRoot.value = this.defaultValue
      this.radioEle[Number(this.defaultValue) - 1].checked = true
    }

    this.radioEle.forEach((el) => {
      el.addEventListener('change', () => {
        this.value = el.value

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

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'void-color' && this.shadowRoot) {
      this.style.setProperty('--icon-void-color', newValue)
    }
    if (name === 'fill-color' && this.shadowRoot) {
      this.style.setProperty('--icon-fill-color', newValue)
    }
  }

  focus() {
    this.shadowRoot.querySelector('input[type="radio"]').focus()
  }

  getRateElements() {
    const icon = this.icon
    const size = this.size

    let result = ''
    let len = this.length

    if (!len) {
      len = 5
    }

    for (let i = len; i >= 1; i--) {
      const num = i < 10 ? '0' + i : i
      result += `<input tabindex="${i}" type="radio" name="item" id="item${num}" value="${i}" />
                 <span class="item">
                    <label for="item${num}">
                      <iconpark-icon name="${icon}" size="${size}" class="icon"></iconpark-icon>
                    </label>
                 </span>`
    }

    return result
  }
}

if (!customElements.get('y-rate')) {
  customElements.define('y-rate', YRate)
}
