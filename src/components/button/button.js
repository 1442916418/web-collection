// import './y-loading.js'
// import './y-icon.js'

// https://www.zhangxinxu.com/wordpress/2021/02/web-components-import-css/

import styles from './styles.js'

export default class YButton extends HTMLElement {
  /** 监听属性变化 */
  static get observedAttributes() {
    return ['disabled', 'icon', 'loading', 'href', 'type']
  }

  constructor() {
    super()
    /** 影子 DOM */
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const tag = this.href ? 'a' : 'button'
    const type = this.type ? `type="${this.type}"` : ''
    const download = this.download && this.href ? `download="${this.download}"` : ''
    const href = this.href ? `href="${this.href}" target="${this.target}" rel="${this.rel}"` : ''
    const icon =
      !this.loading && this.icon && this.icon !== 'null' ? '<y-icon id="icon" name=' + this.icon + '></y-icon>' : ''

    shadowRoot.innerHTML = `<style>${styles}</style><${tag} ${type} ${download} ${href} class="btn" id="btn"></${tag}>${icon}<slot></slot>`
  }

  focus() {
    this.btn.focus()
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get toggle() {
    return this.getAttribute('toggle') !== null
  }

  get type() {
    return this.getAttribute('type')
  }

  get name() {
    return this.getAttribute('name')
  }

  get checked() {
    return this.getAttribute('checked') !== null
  }

  get href() {
    return this.getAttribute('href')
  }

  get target() {
    return this.getAttribute('target') || '_blank'
  }

  get rel() {
    return this.getAttribute('rel')
  }

  get download() {
    return this.getAttribute('download')
  }

  get icon() {
    return this.getAttribute('icon')
  }

  get loading() {
    return this.getAttribute('loading') !== null
  }

  set icon(value) {
    this.setAttribute('icon', value)
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  set href(value) {
    this.setAttribute('href', value)
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  set checked(value) {
    if (value === null || value === false) {
      this.removeAttribute('checked')
    } else {
      this.setAttribute('checked', '')
    }
  }

  set loading(value) {
    if (value === null || value === false) {
      this.removeAttribute('loading')
    } else {
      this.setAttribute('loading', '')
    }
  }

  connectedCallback() {
    this.btn = this.shadowRoot.getElementById('btn')
    this.ico = this.shadowRoot.getElementById('icon')
    // this.load = document.createElement('y-loading')
    // this.load.style.color = 'inherit'

    this.btn.addEventListener('mousedown', function (e) {
      //e.preventDefault();
      //e.stopPropagation();
      if (!this.disabled) {
        const { left, top } = this.getBoundingClientRect()
        this.style.setProperty('--x', e.clientX - left + 'px')
        this.style.setProperty('--y', e.clientY - top + 'px')
      }
    })

    this.addEventListener('click', function (e) {
      if (this.toggle) {
        this.checked = !this.checked
      }
    })

    this.btn.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        e.stopPropagation()
      }
    })

    this.disabled = this.disabled
    this.loading = this.loading
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.btn) {
      if (newValue !== null) {
        this.btn.setAttribute('disabled', 'disabled')
        if (this.href) {
          this.btn.removeAttribute('href')
        }
      } else {
        this.btn.removeAttribute('disabled')
        if (this.href) {
          this.btn.href = this.href
        }
      }
    }
    if (name === 'loading' && this.btn) {
      if (newValue !== null) {
        this.shadowRoot.prepend(this.load)
        this.btn.setAttribute('disabled', 'disabled')
      } else {
        this.shadowRoot.removeChild(this.load)
        this.btn.removeAttribute('disabled')
      }
    }
    if (name === 'icon' && this.ico) {
      this.ico.name = newValue
    }
    if (name === 'href' && this.btn) {
      if (!this.disabled) {
        this.btn.href = newValue
      }
    }
    if (name === 'type' && this.btn) {
      this.btn.type = newValue
    }
  }
}

if (!customElements.get('y-button')) {
  customElements.define('y-button', YButton)
}
