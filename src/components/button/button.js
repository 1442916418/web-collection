import styles from './styles.js'

export default class YButton extends HTMLElement {
  /** 监听属性变化 */
  static get observedAttributes() {
    return ['disabled', 'icon', 'loading', 'href', 'type', 'theme']
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
      !this.loading && this.icon && this.icon !== 'null'
        ? `<iconpark-icon name="${this.icon}" id="icon" class="icon" ></iconpark-icon>`
        : ''

    shadowRoot.innerHTML = `<style>${styles}</style><${tag} ${type} ${download} ${href} class="btn" id="btn"></${tag}>${icon}<slot></slot>`
  }

  focus() {
    this.btnEle.focus()
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get type() {
    return this.getAttribute('type')
  }

  get name() {
    return this.getAttribute('name')
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

  set loading(value) {
    if (value === null || value === false) {
      this.removeAttribute('loading')
    } else {
      this.setAttribute('loading', '')
    }
  }

  connectedCallback() {
    this.btnEle = this.shadowRoot.getElementById('btn')
    this.iconEle = this.shadowRoot.getElementById('icon')
    this.loadLoadingIconEle = document.createElement('iconpark-icon')

    this.btnKeydown = (e) => this.handleBtnKeydown(e)

    this.btnEle.addEventListener('keydown', this.btnKeydown)

    this.handleLoadingIcon()

    this.disabled = this.disabled
    this.loading = this.loading

    this.setAttribute('sign', 'query')
    this.handleTheme()
  }

  disconnectedCallback() {
    this.btnEle.removeEventListener('keydown', this.btnKeydown)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.btnEle) {
      if (newValue !== null) {
        this.btnEle.setAttribute('disabled', 'disabled')

        this.href && this.btnEle.removeAttribute('href')
      } else {
        this.btnEle.removeAttribute('disabled')

        if (this.href) {
          this.btnEle.href = this.href
        }
      }
    }
    if (name === 'loading' && this.btnEle) {
      if (newValue !== null) {
        this.shadowRoot.prepend(this.loadLoadingIconEle)
        this.btnEle.setAttribute('disabled', 'disabled')
      } else {
        this.shadowRoot.removeChild(this.loadLoadingIconEle)
        this.btnEle.removeAttribute('disabled')
      }
    }
    if (name === 'icon' && this.iconEle) {
      this.iconEle.name = newValue
    }
    if (name === 'href' && this.btnEle) {
      if (newValue !== 'null' && !this.disabled) {
        this.btnEle.href = newValue
      }
    }
    if (name === 'type' && this.btnEle) {
      if (newValue !== 'null') {
        this.btnEle.type = newValue
      }
    }
  }

  handleBtnKeydown(e) {
    if (e.code === 'Enter') {
      e.stopPropagation()
    }
  }

  handleLoadingIcon() {
    this.loadLoadingIconEle.setAttribute('spin', '')
    this.loadLoadingIconEle.setAttribute('name', 'loading-four')
    this.loadLoadingIconEle.style.color = 'inherit'
    this.loadLoadingIconEle.style.marginRight = '0.55rem'
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-button')) {
  customElements.define('y-button', YButton)
}

class YButtonGroup extends HTMLElement {
  static get observedAttributes() {
    return ['disabled']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `
      <style>
      :host {
          display:inline-flex;
      }
      ::slotted(y-button:not(:first-of-type):not(:last-of-type)){
          border-radius:0;
      }
      ::slotted(y-button){
          margin:0 !important;
      }
      ::slotted(y-button:not(:first-of-type)){
          margin-left:-1px !important;
      }
      ::slotted(y-button[type]:not([type="dashed"]):not(:first-of-type)){
          margin-left:1px !important;
      }
      ::slotted(y-button:first-of-type){
          border-top-right-radius: 0;
          border-bottom-right-radius: 0px;
      }
      ::slotted(y-button:last-of-type){
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
      }
      </style>
      <slot></slot>
      `
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }
}

if (!customElements.get('y-button-group')) {
  customElements.define('y-button-group', YButtonGroup)
}
