import styles from './styles.js'

export default class YForm extends HTMLElement {
  static get observedAttributes() {
    return ['disabled']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const method = this.method ? `method="${this.method}"` : ''
    const action = this.action ? `action="${this.action}"` : ''
    const noValidate = this.noValidate ? 'novalidate' : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <form id="form" ${method} ${action} ${noValidate}>
                              <slot></slot>
                            </form>`
  }

  get validity() {
    return this.elements.every((el) => el.validity)
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  get noValidate() {
    return this.getAttribute('no-validate') !== null
  }

  get formData() {
    const formData = new FormData()
    const jsonData = {}

    if (!this.disabled) {
      this.elements.forEach((el) => {
        formData.set(el.name, el.value)
        jsonData[el.name] = el.value
      })
    }

    formData.json = jsonData

    return formData
  }

  get action() {
    return this.getAttribute('action') || ''
  }

  get name() {
    return this.getAttribute('name')
  }

  get invalid() {
    return this.getAttribute('invalid') !== null
  }

  get method() {
    const method = (this.getAttribute('method') || 'get').toUpperCase()

    if (['GET', 'POST'].includes(method)) {
      return method
    }

    return 'GET'
  }

  get modeType() {
    return this.getAttribute('mode-type')
  }

  set noValidate(value) {
    if (value === null || value === false) {
      this.removeAttribute('no-validate')
    } else {
      this.setAttribute('no-validate', '')
    }
  }

  set invalid(value) {
    if (value === null || value === false) {
      this.removeAttribute('invalid')
    } else {
      this.setAttribute('invalid', '')
    }
  }

  set modeType(value) {
    this.setAttribute('mode-type', value)
  }

  connectedCallback() {
    this.formEle = this.shadowRoot.getElementById('form')
    this.elements = [...this.querySelectorAll('[name]:not([disabled])')]
    this.submitBtnEle = this.querySelector('[type=submit]')
    this.resetBtnEle = this.querySelector('[type=reset]')

    this.formEleKeydown = (e) => this.handleFormEleKeydownEvent(e)
    this.submitBtnEleClick = () => {}
    this.resetBtnEleClick = () => {}

    this.formEle.addEventListener('keydown', this.formEleKeydown)

    if (this.submitBtnEle) {
      this.submitBtnEleClick = () => this.handleSubmit()

      this.submitBtnEle.addEventListener('click', this.submitBtnEleClick)
    }

    if (this.resetBtnEle) {
      this.resetBtnEleClick = () => this.handleReset()

      this.resetBtnEle.addEventListener('click', this.resetBtnEleClick)
    }

    if (!this.noValidate) {
      this.elements.forEach((el) => {
        if (el.tagName == 'Y-INPUT') {
          el.addEventListener('input', () => {
            this.invalid = !this.validity
          })
        } else {
          el.addEventListener('change', () => {
            this.invalid = !this.validity
          })
        }
      })
    }
  }

  disconnectedCallback() {
    this.formEle.removeEventListener('keydown', this.formEleKeydown)

    if (this.submitBtnEle) {
      this.submitBtnEle.removeEventListener('click', this.submitBtnEleClick)
      this.submitBtnEleClick = () => {}
    }

    if (this.resetBtnEle) {
      this.resetBtnEle.removeEventListener('click', this.resetBtnEleClick)
      this.resetBtnEleClick = () => {}
    }
  }

  handleFormEleKeydownEvent(e) {
    if (e.target == this.resetBtnEle) {
      return
    }

    e.code === 'Enter' && this.handleSubmit()
  }

  checkValidity() {
    if (this.noValidate) {
      return true
    }

    const elements = [...this.elements].reverse()

    let validity = true

    elements.forEach((el) => {
      if (el.checkValidity && !el.checkValidity()) {
        validity = false
      }
    })

    this.invalid = !validity

    return validity
  }

  async handleSubmit() {
    if (this.checkValidity() && !this.disabled) {
      // validity
      if (this.action) {
        this.submitBtnEle && (this.submitBtnEle.loading = true)

        if (this.method == 'GET') {
          const formData = new URLSearchParams(this.formEleData).toString()
          const data = await fetch(`${this.action}?${formData}`)

          this.submitBtnEle && (this.submitBtnEle.loading = false)

          if (data.headers.get('content-type') == 'application/json') {
            this.dispatchEvent(
              new CustomEvent('submit', {
                detail: {
                  data: data.json()
                }
              })
            )
          }
        } else {
          const data = await fetch(this.action, {
            method: 'POST',
            body: this.formEleData
          })

          this.submitBtnEle && (this.submitBtnEle.loading = false)

          if (data.headers.get('content-type') == 'application/json') {
            this.dispatchEvent(
              new CustomEvent('submit', {
                detail: {
                  data: data.json()
                }
              })
            )
          }
        }
      }
    }
  }

  handleReset() {
    this.invalid = false

    this.elements.forEach((el) => {
      el.reset && el.reset()
    })
  }
}

if (!customElements.get('y-form')) {
  customElements.define('y-form', YForm)
}
