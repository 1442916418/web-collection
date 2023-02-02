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
    let defaultValue = `<span class="placeholder">${this.placeholder}</span>`

    // TODO: defaultValue
    shadowRoot.innerHTML = `<style>${styles}</style>
                            <div class="select" id="select" tabindex="0" hidefocus="true" ${name} ${multiple} ${disabled}>
                              <div class="select-value">${defaultValue}</div>
                              <div class="options" id="options"><slot id="slot"></slot></div>
                            </div>
                            <iconpark-icon class="arrow" name="down"></iconpark-icon>
                            `
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get multiple() {
    return this.getAttribute('multiple') !== null
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
    const isMultiple = this.multiple
    console.log('value: %s, isMultiple: %s', value, isMultiple)

    // TODO: focusIndex
    if (isMultiple) {
      if (!Array.isArray(this.selectValue)) {
        this.selectValue = []
      }

      const isSelected = this.selectValue.find((v) => v === value)

      let list = this.selectValue.length ? [value, ...this.selectValue] : [value]

      if (isSelected) {
        list = list.filter((v) => v !== value)
      }

      this.selectValue = list

      this.slotNodes.forEach((item) => {
        if (list.find((v) => v === item.value)) {
          item.setAttribute('selected', '')
        } else {
          item.removeAttribute('selected')
        }
      })
    } else {
      this.checkOptionsVisible(false)

      if (!value) {
        this.selectValue = value

        if (this.focusIndex) {
          const curNode = this.slotNodes[this.focusIndex]

          if (curNode) {
            curNode.removeAttribute('selected')

            this.focusIndex = -1
          }
        }
        return
      }

      if (value !== this.value) {
        this.selectValue = value

        const curIndex = this.slotNodes.findIndex((v) => v.value === value)

        this.slotNodes.forEach((item, i) => {
          if (curIndex === i) {
            item.setAttribute('selected', '')
          } else {
            item.removeAttribute('selected')
          }
        })

        this.focusIndex = curIndex
      }
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
    if (value === null || value === false) {
      this.removeAttribute('multiple')
    } else {
      this.setAttribute('multiple', '')
    }
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
    this.select.addEventListener('blur', (e) => {
      e.stopPropagation()

      // TODO: multiple
      // !this.multiple && this.checkOptionsVisible(false)
      this.checkOptionsVisible(false)
    })
    this.options.addEventListener('click', (e) => {
      e.stopPropagation()
      this.focus()
      const target = e.target

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
    this.options.style.display = value ? 'block' : 'none'
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
