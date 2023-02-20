import styles from './styles.js'

export default class YImgPreview extends HTMLElement {
  static get observedAttributes() {
    return ['open']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <span id="close" class="close"></span>
                            <slot id="slot"></slot>
                            <a id="operation" class="operation">
                              <span class="left">&lt;</span>
                              <div id="dots"></div>
                              <span class="right">&gt;</span>
                            </a>`
  }

  get open() {
    return this.getAttribute('open') !== null
  }

  set open(value) {
    if (value === null || value === false) {
      this.removeAttribute('open')
    } else {
      this.setAttribute('open', '')
    }
  }

  connectedCallback() {
    this.indexList = []

    this.slotsEle = this.shadowRoot.getElementById('slot')
    this.operationEle = this.shadowRoot.getElementById('operation')
    this.closeEle = this.shadowRoot.getElementById('close')

    this.shadowRootTransitionend = (e) => this.handleShadowRootTransitionendEvent(e)
    this.slotsEleChange = () => this.handleSlotsEleChangeEvent()
    this.operationEleClick = (e) => this.handleOperationEleClickEvent(e)
    this.shadowRootKeydown = (e) => this.handleShadowRootKeydownEvent(e)
    this.closeEleClick = () => this.handleCloseEleClickEvent()

    this.addEventListener('transitionend', this.shadowRootTransitionend)
    this.addEventListener('keydown', this.shadowRootKeydown)
    this.slotsEle.addEventListener('slotchange', this.slotsEleChange)
    this.operationEle.addEventListener('click', this.operationEleClick)
    this.closeEle.addEventListener('click', this.closeEleClick)
  }

  disconnectedCallback() {
    this.removeEventListener('transitionend', this.shadowRootTransitionend)
    this.removeEventListener('keydown', this.shadowRootKeydown)
    this.slotsEle.removeEventListener('slotchange', this.slotsEleChange)
    this.operationEle.removeEventListener('click', this.operationEleClick)
    this.closeEle.removeEventListener('click', this.closeEleClick)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'open' && this.shadowRoot) {
      if (newValue == null) {
        document.querySelector(`y-img[index="${this.indexList[this.index]}"]`).focus()
      }
    }
  }

  handleShadowRootTransitionendEvent(e) {
    if (e.propertyName === 'transform' && this.open) {
      this.focus()
    }
  }

  handleSlotsEleChangeEvent() {
    if (this.indexList.length > 1) {
      this.operationEle.classList.remove('only')

      const list = this.indexList.sort((a, b) => a - b)

      let html = ''

      list.forEach((el) => {
        html += '<i data-index=' + el + ' class=' + (el == list[this.index] ? 'current' : '') + '></i>'
      })

      this.operationEle.querySelector('#dots').innerHTML = html
      this.indexList = list
    } else {
      this.operationEle.classList.handleAdd('only')
    }
  }

  handleOperationEleClickEvent(e) {
    if (e.target.tagName === 'I') {
      this.handleChange(e.target.dataset.index)
    }
    if (e.target.className === 'left') {
      this.handleGo(-1)
    }
    if (e.target.className === 'right') {
      this.handleGo(1)
    }
  }

  handleShadowRootKeydownEvent(e) {
    switch (e.code) {
      case 'ArrowLeft':
        this.handleGo(-1)
        break
      case 'ArrowRight':
        this.handleGo(1)
        break
      case 'Backspace':
      case 'Escape':
        e.preventDefault()
        this.open = false
        break
      default:
        break
    }
  }

  handleCloseEleClickEvent() {
    this.open = false
  }

  handleShow(index) {
    this.open = true
    this.handleChange(index)
  }

  handleChange(index) {
    this.index = this.indexList.indexOf(+index)

    const prevImg = this.querySelector('img.current')
    const prevDot = this.operationEle.querySelector('i.current')

    if (prevImg && prevDot) {
      prevImg.classList.remove('current')
      prevDot.classList.remove('current')
    }

    this.querySelector(`img[data-index="${index}"]`).classList.add('current')

    const curDot = this.operationEle.querySelector(`i[data-index="${index}"]`)

    curDot && curDot.classList.add('current')
  }

  handleGo(step) {
    this.index += step

    const len = this.indexList.length

    if (this.index > len - 1) {
      this.index = 0
    }
    if (this.index < 0) {
      this.index = len - 1
    }

    this.handleChange(this.indexList[this.index])
  }

  /**
   * Add img element and index
   * @param {Element} img
   * @param {Number} index
   */
  handleAdd(img, index) {
    this.indexList.push(index)
    this.appendChild(img)
  }

  handleRemove(index) {
    this.indexList = this.indexList.filter((el) => el != index)
    const child = this.querySelector(`img[data-index="${index}"]`)
    child && this.removeChild(child)
  }
}

if (!customElements.get('y-img-preview')) {
  customElements.define('y-img-preview', YImgPreview)
}
