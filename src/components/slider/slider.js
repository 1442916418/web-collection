import '../tips/tips.js'

import styles from './styles.js'

export default class YSlider extends HTMLElement {
  static get observedAttributes() {
    return ['min', 'max', 'step', 'disabled', 'is-tips', 'suffix', 'theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const tipsDir = `dir=${this.vertical ? 'r' : 't'}`
    const tipsStyles = `style="--percent:${(this.defaultValue - this.min) / (this.max - this.min)}"`
    const tipsContent = `tips="${this.isTips && !this.disabled ? this.defaultValue : ''}"`
    const tipsSuffix = `${this.suffix ? `suffix=${this.suffix}` : ''}`
    const tipsPrefix = `${this.prefix ? `prefix=${this.prefix}` : ''}`
    const disabled = this.disabled ? 'disabled' : ''

    const rangeEle = `<input id='slider' value=${this.defaultValue} min=${this.min} max=${this.max} step=${this.step} ${disabled} type='range'>`
    const tipsEle = `<y-tips id='slider-container' ${tipsDir} ${tipsStyles} ${tipsContent} ${tipsSuffix} ${tipsPrefix}>${rangeEle}</y-tips>`

    shadowRoot.innerHTML = `<style>${styles}</style>${tipsEle}`
  }

  get value() {
    return Number(this.sliderEle.value)
  }

  get defaultValue() {
    return this.getAttribute('default-value') || 0
  }

  get suffix() {
    return this.getAttribute('suffix') || ''
  }

  get prefix() {
    return this.getAttribute('prefix') || ''
  }

  get min() {
    return this.getAttribute('min') || 0
  }

  get max() {
    return this.getAttribute('max') || 100
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get isTips() {
    return this.getAttribute('is-tips') !== null
  }

  get vertical() {
    return this.getAttribute('vertical') !== null
  }

  get theme() {
    return this.getAttribute('theme')
  }

  set theme(value) {
    if (value) {
      this.sliderEle && this.sliderEle.setAttribute('theme', value)
      this.sliderContainerEle && this.sliderContainerEle.setAttribute('type', value)
    } else {
      this.sliderEle && this.sliderEle.removeAttribute('theme')
      this.sliderContainerEle && this.sliderContainerEle.removeAttribute('type')
    }
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  set isTips(value) {
    if (value === null || value === false) {
      this.removeAttribute('is-tips')
    } else {
      this.setAttribute('is-tips', '')
    }
  }

  get step() {
    return this.getAttribute('step') || 1
  }

  set value(value) {
    this.sliderEle.value = value
    this.sliderContainerEle.style.setProperty('--percent', (this.value - this.min) / (this.max - this.min))

    if (this.isTips && !this.disabled) {
      this.sliderContainerEle.tips = this.value
    } else {
      this.sliderContainerEle.tips = ''
    }
  }

  set min(value) {
    this.setAttribute('min', value)
  }

  set max(value) {
    this.setAttribute('max', value)
  }

  set step(value) {
    this.setAttribute('step', value)
  }

  set prefix(value) {
    this.setAttribute('prefix', value)
  }

  set suffix(value) {
    this.setAttribute('suffix', value)
  }

  connectedCallback() {
    this.sliderEle = this.shadowRoot.getElementById('slider')
    this.sliderContainerEle = this.shadowRoot.getElementById('slider-container')

    this.handleVerticalStyles()

    this.sliderInput = (e) => this.handleSliderClickEvent(e)
    this.sliderClick = () => handleSliderChangeEvent()
    this.shadowRootWheel = (e) => this.handleShadowRootWheelEvent(e)

    this.sliderEle.addEventListener('input', this.sliderInput)
    this.sliderEle.addEventListener('change', this.sliderClick)
    this.addEventListener('wheel', this.shadowRootWheel, true)

    this.setAttribute('sign', 'query')
    this.handleTheme()
  }

  disconnectedCallback() {
    this.vertical && this.resizeObserver.unobserve(this)

    this.sliderEle.removeEventListener('input', this.sliderInput)
    this.sliderEle.removeEventListener('change', this.sliderClick)
    this.removeEventListener('wheel', this.shadowRootWheel, true)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.sliderEle && oldValue !== newValue && !this._oninput) {
      if (name == 'disabled') {
        if (newValue !== null) {
          this.sliderEle.setAttribute('disabled', 'disabled')
        } else {
          this.sliderEle.removeAttribute('disabled')
        }
      } else {
        this.sliderEle[name] = newValue
        this[name] = newValue
        this.sliderContainerEle.style.setProperty('--percent', (this.value - this.min) / (this.max - this.min))
        if (name === 'suffix') {
          this.sliderContainerEle.suffix = newValue
        }
      }
    }
  }

  focus() {
    this.sliderEle.focus()
  }

  handleVerticalStyles() {
    if (this.vertical) {
      this.style = 'height: var(--h, 300px)'

      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { height } = entry.contentRect
          this.sliderContainerEle.style.setProperty('--h', height + 'px')
        }
      })
      this.resizeObserver.observe(this)
    }
  }

  handleSliderClickEvent(e) {
    this.value = this.sliderEle.value
    this._oninput = true

    e.stopPropagation()

    this.dispatchEvent(
      new CustomEvent('input', {
        detail: {
          value: this.sliderEle.value
        }
      })
    )
  }

  handleSliderChangeEvent() {
    this.value = this.sliderEle.value
    this._oninput = false

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.sliderEle.value
        }
      })
    )
  }

  handleShadowRootWheelEvent(e) {
    if (getComputedStyle(this.sliderEle).zIndex == 2) {
      e.preventDefault()
      if ((e.deltaY < 0 && !this.vertical) || (e.deltaY > 0 && this.vertical)) {
        this.value -= this.step * 5
      } else {
        this.value += this.step * 5
      }
      this.dispatchEvent(
        new CustomEvent('change', {
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

if (!customElements.get('y-slider')) {
  customElements.define('y-slider', YSlider)
}
