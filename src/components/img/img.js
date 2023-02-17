import styles from './styles.js'

export default class YImg extends HTMLElement {
  static get observedAttributes() {
    return ['lazy', 'src', 'default-src', 'ratio']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <img />
                            ${this.getSlotElement('view', 'preview-open')}
                            ${this.getSlotElement('error', 'error-picture')}
                            ${this.getSlotElement('loading', 'loading-four', 'spin')}`
  }

  get src() {
    return this.getAttribute('src')
  }

  get defaultSrc() {
    return this.getAttribute('default-src')
  }

  get ratio() {
    //16/9
    const ratio = this.getAttribute('ratio')
    if (ratio && ratio.includes('/')) {
      const r = ratio.split('/')
      return (r[1] / r[0]) * 100 + '%'
    }
    return 0
  }

  get lazy() {
    return this.getAttribute('lazy') !== null
  }

  get fit() {
    return this.getAttribute('fit')
  }

  get alt() {
    return this.getAttribute('alt') || 'error'
  }

  get error() {
    return this.getAttribute('error') !== null
  }

  get default() {
    return this.getAttribute('default') !== null
  }

  set default(value) {
    if (value) {
      this.setAttribute('default', '')
    } else {
      this.removeAttribute('default')
    }
  }

  set error(value) {
    if (value) {
      this.setAttribute('error', '')
    } else {
      this.removeAttribute('error')
    }
  }

  set src(value) {
    this.setAttribute('src', value)
  }

  set fit(value) {
    this.setAttribute('fit', value)
  }

  set ratio(value) {
    this.setAttribute('ratio', value)
  }

  connectedCallback() {
    this.imgEle = this.shadowRoot.querySelector('img')

    if (this.lazy) {
      this.observer = new IntersectionObserver((item) => {
        item.forEach((v) => {
          const el = v.target
          const intersectionRatio = v.intersectionRatio
          if (intersectionRatio > 0 && intersectionRatio <= 1) {
            this.handleLoad(this.src)
            this.observer.unobserve(el)
          }
        })
      })
      this.observer.observe(this.imgEle)
    } else {
      this.handleLoad(this.src)
    }

    this.imgEle && this.handleStyles()
  }

  disconnectedCallback() {
    this.observer.disconnect()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && this.imgEle) {
      this.handleLoad(newValue)
    }
    if (name === 'ratio' && this.imgEle) {
      this.handleStyles()
    }
  }

  handleLoad(src, isDefaultSrc) {
    const img = new Image()
    img.src = src
    this.error = false

    img.onload = () => {
      this.imgEle.alt = this.alt
      this.imgEle.src = src
    }
    img.onerror = () => {
      this.error = true
      this.imgEle.removeAttribute('tabindex')

      if (this.defaultSrc && !isDefaultSrc) {
        this.default = true
        this.handleLoad(this.defaultSrc, true)
      }
    }
  }

  getSlotElement(name, iconName, attr) {
    return `<slot name="${name}"><iconpark-icon class="${name}" id="${name}" name="${iconName}" ${attr}></iconpark-icon></slot>`
  }

  handleStyles() {
    this.style.setProperty('--padding-top', this.ratio)
  }
}

if (!customElements.get('y-img')) {
  customElements.define('y-img', YImg)
}
