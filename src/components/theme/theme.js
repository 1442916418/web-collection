import styles from './styles.js'

// TODO: 主题！！！
export default class YTheme extends HTMLElement {
  darkBgColor = '#262833'
  defaultBgColor = '#e6e7ee'

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style><iconpark-icon name="${this.iconName}" id="icon"></iconpark-icon>`
  }

  get storeTheme() {
    return window.localStorage.getItem('theme')
  }

  get iconName() {
    return this.storeTheme === null || this.storeTheme === 'null' ? 'moon' : 'sun-one'
  }

  get allCustomElements() {
    const list = document.querySelectorAll('[sign=query]')

    return list || []
  }

  set storeTheme(value) {
    window.localStorage.setItem('theme', value)
  }

  connectedCallback() {
    this.iconEle = this.shadowRoot.getElementById('icon')

    this.iconClick = () => this.handleIconClickEvent(false)

    this.addEventListener('click', this.iconClick)

    this.setAttribute('sign', 'query')

    this.handleIconClickEvent(true)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.iconClick)
  }

  handleIconClickEvent(isInit) {
    let value = this.storeTheme === null || this.storeTheme === 'null' ? 'dark' : 'null'

    if (isInit) {
      value = this.storeTheme || 'null'
    }

    if (!isInit) {
      this.storeTheme = value
    }

    this.iconEle.setAttribute('name', this.iconName)
    this.handleAllCustomElements(value)
    this.handleHeaderStyles(value)
    this.handleBodyStyles(value)
  }

  handleAllCustomElements(value) {
    setTimeout(() => {
      const list = this.allCustomElements

      if (list.length) {
        list.forEach((ele) => {
          if (value === 'null') {
            ele.removeAttribute('theme')
          } else {
            ele.setAttribute('theme', value)
          }
        })
      }
    }, 300)
  }

  handleBodyStyles(value) {
    const body = document.querySelector('body')
    const bgColor = value === 'dark' ? this.darkBgColor : this.defaultBgColor

    body.style.backgroundColor = bgColor
  }

  handleHeaderStyles(value) {
    const h2 = document.querySelectorAll('h2')

    if (h2.length) {
      const color = value === 'dark' ? this.defaultBgColor : this.darkBgColor

      h2.forEach((item) => (item.style.color = color))
    }
  }
}

if (!customElements.get('y-theme')) {
  customElements.define('y-theme', YTheme)
}
