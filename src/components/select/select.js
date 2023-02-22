import styles from './styles.js'

export default class YSelect extends HTMLElement {
  static get observedAttributes() {
    return ['disabled', 'multiple', 'name', 'size', 'placeholder', 'default-value', 'type']
  }

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const name = this.name ? `name="${this.name}"` : ''
    const multiple = this.multiple ? `multiple="${this.multiple}"` : ''
    const disabled = this.disabled ? `disabled="${this.disabled}"` : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <div class="select" id="select" tabindex="0" ${name} ${multiple} ${disabled}>
                              <div class="select-value" id="select-value">${this.defaultPlaceholder}</div>
                              <div class="options" id="options"><slot id="slot"></slot></div>
                            </div>
                            <iconpark-icon class="arrow" id="arrow" name="down"></iconpark-icon>
                            `
  }

  get defaultPlaceholder() {
    return `<span class="placeholder">${this.placeholder}</span>`
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
    return this.getAttribute('placeholder') || '请选择'
  }

  get value() {
    return this.selectValue || {}
  }

  get type() {
    return this.getAttribute('type')
  }

  get defaultValue() {
    return this.getAttribute('default-value') || ''
  }

  get validity() {
    if (this.required) {
      return Array.isArray(this.value) ? !this.value.length : JSON.stringify(this.value) !== '{}'
    }

    return true
  }

  get noValidate() {
    return this.getAttribute('no-validate') !== null
  }

  get invalid() {
    return this.getAttribute('invalid') !== null
  }

  get invalidMessage() {
    return this.getAttribute('invalid-message') || '请选择一项'
  }

  get required() {
    return this.getAttribute('required') !== null
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  set required(value) {
    if (value === null || value === false) {
      this.removeAttribute('required')
    } else {
      this.setAttribute('required', '')
    }
  }

  set invalidMessage(value) {
    this.setAttribute('msg', value)
  }

  set invalid(value) {
    if (value === null || value === false) {
      this.removeAttribute('invalid')
    } else {
      this.setAttribute('invalid', '')
    }
  }

  set noValidate(value) {
    if (value === null || value === false) {
      this.removeAttribute('novalidate')
    } else {
      this.setAttribute('novalidate', '')
    }
  }

  set value(targetValue) {
    const isMultiple = this.multiple

    if (isMultiple) {
      if (!Array.isArray(this.selectValue)) {
        this.selectValue = []
      }

      const isSelected = this.selectValue.find((v) => v.value === targetValue.value)

      let list = this.selectValue.length ? [targetValue, ...this.selectValue] : [targetValue]

      if (isSelected) {
        list = list.filter((v) => v.value !== targetValue.value)
      }

      this.selectValue = list

      this.slotNodes.forEach((item) => {
        item.removeAttribute('focus')

        if (list.find((v) => v.value === item.value)) {
          item.setAttribute('selected', '')
        } else {
          item.removeAttribute('selected')
        }
      })

      this.checkValidity()
    } else {
      this.checkOptionsVisible(false)

      if (!targetValue) {
        this.selectValue = targetValue

        if (this.focusIndex) {
          const curNode = this.slotNodes[this.focusIndex]

          if (curNode) {
            curNode.removeAttribute('selected')
            curNode.removeAttribute('focus')

            this.focusIndex = -1
          }
        }

        this.checkValidity()
        this.setSelectedValue()
        return
      }

      if (JSON.stringify(targetValue) !== JSON.stringify(this.value)) {
        this.selectValue = targetValue

        const curIndex = this.slotNodes.findIndex((v) => v.value === targetValue.value)

        this.slotNodes.forEach((item, i) => {
          item.removeAttribute('focus')

          if (curIndex === i) {
            item.setAttribute('selected', '')
          } else {
            item.removeAttribute('selected')
          }
        })

        this.focusIndex = curIndex
        this.checkValidity()
      }
    }

    this.setSelectedValue()
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
    this.formEle = this.closest('y-form')
    this.selectEle = this.shadowRoot.getElementById('select')
    this.optionsEle = this.shadowRoot.getElementById('options')
    this.slotsEle = this.shadowRoot.getElementById('slot')
    this.selectValueEle = this.shadowRoot.getElementById('select-value')
    this.arrowEle = this.shadowRoot.getElementById('arrow')

    this.slotNodes = []
    this.selectValue = {} // 单选是对象，多选是对象数组
    this.focusIndex = -1

    this.documentClick = (e) => this.handleDocumentClickEvent(e)
    this.shadowRootClick = (e) => this.handleShadowRootClickEvent(e)
    this.shadowRootKeydown = (e) => this.handleShadowRootKeydownEvent(e)
    this.selectClick = (e) => this.handleSelectClickEvent(e)
    this.selectFocus = (e) => this.handleSelectFocusEvent(e)
    this.selectOptionClick = (e) => this.handleSelectOptionClickEvent(e)
    this.slotChange = () => this.handleSlotsChangeEvent()

    document.addEventListener('click', this.documentClick)

    this.addEventListener('keydown', this.shadowRootKeydown)
    this.addEventListener('click', this.shadowRootClick)
    this.selectEle.addEventListener('click', this.selectClick)
    this.selectEle.addEventListener('focus', this.selectFocus)
    this.optionsEle.addEventListener('click', this.selectOptionClick)
    this.slotsEle.addEventListener('slotchange', this.slotChange)

    this.handleDefaultValue(this.defaultValue)
    this.setAttribute('sign', 'query')
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.documentClick)

    this.removeEventListener('click', this.shadowRootClick)
    this.removeEventListener('keydown', this.shadowRootKeydown)
    this.selectEle.removeEventListener('click', this.selectClick)
    this.optionsEle.removeEventListener('click', this.selectOptionClick)
    this.slotsEle.removeEventListener('slotchange', this.slotChange)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && this.selectEle) {
      this.selectEle.disabled = !!newValue
    }
    if (name === 'default-value' && this.slotNodes) {
      this.handleDefaultValue(newValue)
    }
    if (name === 'type' && this.slotNodes) {
      this.slotNodes.forEach((v) => v.setAttribute('type', newValue))
    }
  }

  reset() {
    this.invalid = false
    this.invalidMessage = ''
    this.handleDefaultValue(this.defaultValue)
  }

  checkValidity() {
    this.invalidMessage = ''

    if (this.noValidate || this.disabled || (this.formEle && this.formEle.noValidate)) {
      return true
    }

    if (this.validity) {
      this.invalid = false
      return true
    }

    this.focus()
    this.invalid = true
    this.invalidMessage = this.invalidMessage

    return false
  }

  handleSelectFocusEvent(e) {
    e.stopPropagation()

    this.checkValidity()
  }

  handleDocumentClickEvent(e) {
    e.stopPropagation()
    this.checkOptionsVisible(false)
  }

  handleShadowRootClickEvent(e) {
    e.stopPropagation()
    this.checkOptionsVisible(true)
  }

  handleSelectClickEvent(e) {
    e.stopPropagation()
    this.checkOptionsVisible(true)
  }

  handleSelectOptionClickEvent(e) {
    e.stopPropagation()
    this.focus()
    const target = e.target

    if (target) {
      this.value = { label: target.label, value: target.value }
    }
  }

  handleSlotsChangeEvent() {
    const querySlots = this.querySelectorAll('y-select-option:not([disabled])')

    this.slotNodes = querySlots.length ? [...querySlots] : []

    if (this.type) {
      this.slotNodes.forEach((v) => (v.type = this.type))
    }

    this.handleDefaultValue(this.defaultValue)
  }

  handleShadowRootKeydownEvent(e) {
    switch (e.code) {
      case 'Tab':
        e.preventDefault()
        break
      case 'ArrowUp':
        e.preventDefault()
        this.handleMove(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        this.handleMove(1)
        break
      case 'Escape':
        e.preventDefault()
        this.checkOptionsVisible(false)
        break
      case 'Enter':
        e.preventDefault()
        const target = this.slotNodes[this.focusIndex]

        if (target) {
          this.value = { label: target.label, value: target.value }
        }
        break
    }
  }

  focus() {
    this.selectEle.focus()
  }

  // TODO: 关闭单个组件
  checkOptionsVisible(value) {
    this.optionsEle.style.display = value ? 'block' : 'none'

    if (value) {
      this.arrowEle.setAttribute('open', '')
    } else {
      this.arrowEle.removeAttribute('open')
    }
  }

  setSelectedValue() {
    let result = this.defaultPlaceholder
    const value = this.selectValue

    if (this.multiple) {
      if (Array.isArray(value) && this.selectValueEle) {
        if (value.length) {
          const disabled = this.disabled ? `disabled="${this.disabled}"` : ''
          const type = this.type ? `type="${this.type}"` : ''

          result = value.map((v) => `<y-button size="small" ${disabled} ${type}>${v.label}</y-button>`).join(' ')
        }
      }
    } else {
      if (value || JSON.stringify(value) !== '{}') {
        result = `<span>${value.label}</span>`
      }
    }

    this.selectValueEle.innerHTML = result
  }

  handleMove(dir) {
    this.focusIndex += dir

    if (this.focusIndex < 0) {
      this.focusIndex = this.slotNodes.length - 1
    }

    if (this.focusIndex === this.slotNodes.length) {
      this.focusIndex = 0
    }

    this.handleMoveOptionStyles()
  }

  handleMoveOptionStyles() {
    const target = this.slotNodes[this.focusIndex]

    this.slotNodes.forEach((item) => {
      if (item.value === target.value) {
        item.setAttribute('focus', '')
      } else {
        item.removeAttribute('focus')
      }
    })
  }

  handleDefaultValue(value) {
    if (!value || !this.slotNodes.length) {
      return
    }

    const find = this.slotNodes.find((v) => v.value === value)

    if (find) {
      this.value = { label: find.label, value: find.value }
    }
  }
}

if (!customElements.get('y-select')) {
  customElements.define('y-select', YSelect)
}
