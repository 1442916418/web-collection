import '../tips/tips.js'

import styles from './styles.js'

export default class YSlider extends HTMLElement {
  static get observedAttributes() {
    return ['min', 'max', 'step', 'disabled', 'is-tips', 'suffix', 'theme-type']
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

  focus() {
    this.slider.focus()
  }

  get value() {
    return Number(this.slider.value)
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

  get themeType() {
    return this.getAttribute('theme-type')
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
    this.slider.value = value
    this.sliderContainer.style.setProperty('--percent', (this.value - this.min) / (this.max - this.min))

    if (this.isTips && !this.disabled) {
      this.sliderContainer.tips = this.value
    } else {
      this.sliderContainer.tips = ''
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
    this.slider = this.shadowRoot.getElementById('slider')
    this.sliderContainer = this.shadowRoot.getElementById('slider-container')

    if (this.themeType) {
      this.slider.setAttribute('theme-type', this.themeType)
      this.sliderContainer.setAttribute('type', this.themeType)
    } else {
      this.slider.removeAttribute('theme-type')
      this.sliderContainer.removeAttribute('type')
    }

    if (this.vertical) {
      this.style = 'height: var(--h, 300px)'

      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { height } = entry.contentRect
          this.sliderContainer.style.setProperty('--h', height + 'px')
        }
      })
      this.resizeObserver.observe(this)
    }

    this.slider.addEventListener('input', (ev) => {
      this.value = this.slider.value
      this._oninput = true
      ev.stopPropagation()
      this.dispatchEvent(
        new CustomEvent('input', {
          detail: {
            value: this.slider.value
          }
        })
      )
    })

    this.slider.addEventListener('change', (ev) => {
      this.value = this.slider.value
      this._oninput = false
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            value: this.slider.value
          }
        })
      )
    })

    this.addEventListener(
      'wheel',
      (ev) => {
        if (getComputedStyle(this.slider).zIndex == 2) {
          ev.preventDefault()
          if ((ev.deltaY < 0 && !this.vertical) || (ev.deltaY > 0 && this.vertical)) {
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
      },
      true
    )
  }

  disconnectedCallback() {
    if (this.vertical) {
      this.resizeObserver.unobserve(this)
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.slider && oldValue !== newValue && !this._oninput) {
      if (name == 'disabled') {
        if (newValue !== null) {
          this.slider.setAttribute('disabled', 'disabled')
        } else {
          this.slider.removeAttribute('disabled')
        }
      } else {
        this.slider[name] = newValue
        this[name] = newValue
        this.sliderContainer.style.setProperty('--percent', (this.value - this.min) / (this.max - this.min))
        if (name === 'suffix') {
          this.sliderContainer.suffix = newValue
        }
      }
    }
  }
}

if (!customElements.get('y-slider')) {
  customElements.define('y-slider', YSlider)
}
