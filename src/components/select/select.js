import styles from './styles.js'

export default class YSelect extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'multiple', 'name', 'size', 'placeholder', 'value']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const name = this.name ? `name="${this.name}"` : ''
    const multiple = this.multiple ? `multiple="${this.multiple}"` : ''
    const disabled = this.disabled ? `disabled="${this.disabled}"` : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <div class="select" id="select" ${name} ${multiple} ${disabled}>
                              <span class="placeholder">${this.placeholder}</span>
                              <div class="options" id="options"><slot id="slot"></slot></div>
                            </div>
                            <iconpark-icon class="arrow" name="down"></iconpark-icon>
                            `
  }

  get disabled() {
    return this.getAttribute('disabled')
  }

  get multiple() {
    return this.getAttribute('multiple')
  }

  get name() {
    return this.getAttribute('name')
  }

  get size() {
    return this.getAttribute('size')
  }

  get placeholder() {
    return this.selectValue || this.getAttribute('placeholder') || '请选择'
  }

  get value() {
    return this.selectValue || ''
  }

  set value(value) {
    console.log('🚀 ~ file: select.js:50 ~ YSelect ~ set value ~ value', value, this.slotNodes)

    if (!value) {
      this.selectValue = value

      if (this.focusIndex >= 0) {
        const curNode = this.slotNodes[this.focusIndex]

        if (curNode) {
          this.focusIndex = -1
          curNode.selected = false
        }
      }
      return
    }

    if (value !== this.value) {
      this.selectValue = value

      const curIndex = this.slotNodes.findIndex((v) => v.value === value)

      this.slotNodes.forEach((item, i) => {
        item.selected = curIndex === i
      })

      this.focusIndex = curIndex
      console.log(this.slotNodes, this.focusIndex)
    }
  }

  set size(value) {
    this.setAttribute('size', value)
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } else {
      this.setAttribute('disabled', '')
    }
  }

  set multiple(value) {
    this.setAttribute('multiple', value)
  }

  set name(value) {
    this.setAttribute('name', value)
  }

  connectedCallback() {
    this.select = this.shadowRoot.getElementById('select')
    this.options = this.shadowRoot.getElementById('options')
    this.slots = this.shadowRoot.getElementById('slot')

    this.slotNodes = []
    this.selectValue = ''
    this.focusIndex = -1

    this.addEventListener('click', (e) => {
      e.stopPropagation()
      this.checkOptionsVisible(true)
    })
    this.select.addEventListener('click', (e) => {
      e.stopPropagation()
      this.checkOptionsVisible(true)
    })
    this.options.addEventListener('click', (ev) => {
      this.focus()
      const target = ev.target

      if (target) {
        this.value = target.value
      }
    })
    this.slots.addEventListener('slotchange', (e) => {
      const querySlots = this.querySelectorAll('y-select-option:not([disabled])')

      this.slotNodes = querySlots.length ? [...querySlots] : []
    })

    this.setOptionsStyles()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'disabled' && this.select) {
      this.select.disabled = !!newValue
    }
  }

  focus() {
    this.select.focus()
  }

  checkOptionsVisible(value) {
    this.options.style.visibility = value ? 'visible' : 'hidden'
  }

  setOptionsStyles() {
    if (this.select && this.options) {
      const { height } = this.getBoundingClientRect()
      const { height: selectHeight } = this.select.getBoundingClientRect()
      this.options.style.top = `${height + selectHeight + 6}px`
    }
  }
}

if (!customElements.get('y-select')) {
  customElements.define('y-select', YSelect)
}
