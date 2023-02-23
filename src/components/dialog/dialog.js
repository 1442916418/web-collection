import styles from './styles.js'

class YDialog extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'title', 'confirm-text', 'cancel-text', 'loading', 'type', 'size', 'theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <div class="dialog">
                              <iconpark-icon id="dialog-type" class="dialog-type"></iconpark-icon>
                              <div class="dialog-content">
                                <div class="dialog-title" id="title">${this.title}</div>
                                <y-button class="btn-close" circle id="btn-close" icon="close"></y-button>

                                <div class="dialog-body">
                                  <slot></slot>
                                </div>
                                <div class="dialog-footer">
                                  <y-button id="btn-cancel">${this.cancelText}</y-button>
                                  <y-button id="btn-submit" type="primary">${this.confirmText}</y-button>
                                </div>
                              </div>
                            </div>`
  }

  get open() {
    return this.getAttribute('open') !== null
  }

  get title() {
    return this.getAttribute('title') || 'dialog'
  }

  get type() {
    return this.getAttribute('type')
  }

  get confirmText() {
    return this.getAttribute('confirm-text') || 'ok'
  }

  get portal() {
    const portal = this.getAttribute('portal')
    if (portal) {
      return document.querySelector(portal)
    }
    return null
  }

  get cancelText() {
    return this.getAttribute('cancel-text') || 'cancel'
  }

  get loading() {
    return this.getAttribute('loading') !== null
  }

  get size() {
    return this.getAttribute('size')
  }

  get theme() {
    return this.getAttribute('theme')
  }

  set theme(value) {
    this.handleSetTheme(value)
  }

  set size(value) {
    this.handleSize(value)
  }

  set title(value) {
    this.setAttribute('title', value)
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  set confirmText(value) {
    this.setAttribute('confirm-text', value)
  }

  set cancelText(value) {
    this.setAttribute('cancel-text', value)
  }

  set open(value) {
    if (value === null || value === false) {
      this.removeAttribute('open')
    } else {
      this.setAttribute('open', '')
      this.loading && (this.loading = false)
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
    this.remove = false
    this.autoclose = true

    this.titleEle = this.shadowRoot.getElementById('title')
    this.btnCloseEle = this.shadowRoot.getElementById('btn-close')
    this.btnCancelEle = this.shadowRoot.getElementById('btn-cancel')
    this.btnSubmitEle = this.shadowRoot.getElementById('btn-submit')
    this.dialogTypeEle = this.shadowRoot.getElementById('dialog-type')

    this.shadowRootTransitionendEvent = (e) => this.handleShadowRootTransitionendEvent(e)
    this.wheelEvent = (e) => this.handleWheelEvent(e)
    this.btnCloseEleClickEvent = () => this.handleBtnCloseEleClickEvent()
    this.btnCancelEleClickEvent = () => this.handleBtnCancelEleClickEvent()
    this.btnSubmitEleClick = () => this.handleBtnSubmitEleClick()

    this.shadowRoot.addEventListener('transitionend', this.shadowRootTransitionendEvent)
    this.addEventListener('wheel', this.wheelEvent)
    this.btnCloseEle.addEventListener('click', this.btnCloseEleClickEvent)
    this.btnCancelEle.addEventListener('click', this.btnCancelEleClickEvent)
    this.btnSubmitEle.addEventListener('click', this.btnSubmitEleClick)

    if (this.portal && this.portal !== this.parentNode) {
      this.portal.appendChild(this)
    }

    this.handleTheme()
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('transitionend', this.shadowRootTransitionendEvent)
    this.removeEventListener('wheel', this.wheelEvent)
    this.btnCloseEle.removeEventListener('click', this.btnCloseEleClickEvent)
    this.btnCancelEle.removeEventListener('click', this.btnCancelEleClickEvent)
    this.btnSubmitEle.removeEventListener('click', this.btnSubmitEleClick)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'open' && this.shadowRoot) {
      if (newValue !== null) {
        this.btnActive = document.activeElement
      } else {
        //this.btnActive.focus();
      }
    }
    if (name == 'loading' && this.shadowRoot) {
      if (newValue !== null) {
        this.btnSubmitEle.loading = true
      } else {
        this.btnSubmitEle.loading = false
      }
    }
    if (name == 'title' && this.titleEle) {
      if (newValue !== null) {
        this.titleEle.textContent = newValue
      }
    }
    if (name == 'confirm-text' && this.btnSubmitEle) {
      if (newValue !== null) {
        this.btnSubmitEle.textContent = newValue
      }
    }
    if (name == 'cancel-text' && this.btnCancelEle) {
      if (newValue !== null) {
        this.btnCancelEle.textContent = newValue
      }
    }
    if (name == 'type' && this.dialogTypeEle) {
      if (newValue !== null && newValue !== 'null') {
        this.dialogTypeEle.name = this.getIcon(newValue).name
      }
    }
  }

  handleShadowRootTransitionendEvent(e) {
    if (e.propertyName === 'transform' && this.open) {
      if (this.open) {
        this.btnSubmitEle.focus()
      } else {
        if (this.remove) {
          document.body.removeChild(this)
        }
        this.dispatchEvent(new CustomEvent('close'))
        this.btnActive && this.btnActive.focus()
      }
    }
  }

  handleWheelEvent(e) {
    e.preventDefault()
  }

  handleBtnCloseEleClickEvent() {
    this.open = false
  }

  async handleBtnCancelEleClickEvent() {
    this.dispatchEvent(new CustomEvent('cancel'))
    this.open = false
  }

  handleBtnSubmitEleClick() {
    this.dispatchEvent(new CustomEvent('submit'))
    if (!this.loading && this.autoclose) {
      this.open = false
    }
  }

  getIcon(type) {
    if (!type) return

    const icons = {
      info: { name: 'info' },
      success: { name: 'success' },
      danger: { name: 'close-one' },
      warning: { name: 'attention' },
      confirm: { name: 'check-one' }
    }

    return icons[type]
  }

  handleSize(value) {
    if (!value || value === 'null') {
      this.removeAttribute('size')
      this.btnCloseEle && this.btnCloseEle.removeAttribute('size')
      this.btnCancelEle && this.btnCancelEle.removeAttribute('size')
      this.btnSubmitEle && this.btnSubmitEle.removeAttribute('size')
    } else {
      this.setAttribute('size', value)
      this.btnCloseEle && this.btnCloseEle.setAttribute('size', value)
      this.btnCancelEle && this.btnCancelEle.setAttribute('size', value)
      this.btnSubmitEle && this.btnSubmitEle.setAttribute('size', value)
    }
  }

  handleSetTheme(value) {
    if (!value || value === 'light') {
      this.removeAttribute('theme')
      this.btnCloseEle && this.btnCloseEle.removeAttribute('theme')
      this.btnCancelEle && this.btnCancelEle.removeAttribute('theme')
      this.btnSubmitEle && this.btnSubmitEle.removeAttribute('theme')
    } else {
      this.setAttribute('theme', value)
      this.btnCloseEle && this.btnCloseEle.setAttribute('theme', value)
      this.btnCancelEle && this.btnCancelEle.setAttribute('theme', value)
      this.btnSubmitEle && this.btnSubmitEle.setAttribute('theme', value)
    }
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-dialog')) {
  customElements.define('y-dialog', YDialog)
}

export default {
  alert: function () {
    const dialog = new YDialog()
    document.body.appendChild(dialog)
    dialog.remove = true

    const storeTheme = window.localStorage.getItem('theme')

    if (typeof arguments[0] === 'object') {
      const { title, confirmText, content, ok, size, theme } = arguments[0]
      dialog.size = size || ''
      dialog.theme = theme ? theme : !storeTheme || storeTheme === 'light' ? '' : storeTheme
      dialog.title = title || 'Alert'
      dialog['confirm-text'] = confirmText || '确 定'
      dialog.onsubmit = ok || null
      dialog.innerHTML = content || ''
    } else {
      dialog.title = 'Alert'
      dialog['confirm-text'] = '确 定'
      dialog.innerHTML = arguments[0] || ''
      dialog.onsubmit = arguments[1] || null
      dialog.size = arguments[2] || ''
      dialog.theme = arguments[3] ? arguments[3] : !storeTheme || storeTheme === 'light' ? '' : storeTheme
    }

    dialog.open = true

    return dialog
  },
  info: function () {
    const dialog = new YDialog()
    document.body.appendChild(dialog)
    dialog.type = 'info'
    dialog.remove = true

    const storeTheme = window.localStorage.getItem('theme')

    if (typeof arguments[0] === 'object') {
      const { title, confirmText, content, ok, size, theme } = arguments[0]
      dialog.size = size || ''
      dialog.theme = theme ? theme : !storeTheme || storeTheme === 'light' ? '' : storeTheme
      dialog.title = title || 'Info'
      dialog['confirm-text'] = confirmText || '知道了'
      dialog.onsubmit = ok || null
      dialog.innerHTML = content || ''
    } else {
      dialog.title = 'Info'
      dialog['confirm-text'] = '知道了'
      dialog.innerHTML = arguments[0] || ''
      dialog.onsubmit = arguments[1] || null
      dialog.size = arguments[2] || ''
      dialog.theme = arguments[3] ? arguments[3] : !storeTheme || storeTheme === 'light' ? '' : storeTheme
    }

    dialog.open = true

    return dialog
  },
  success: function () {
    const dialog = new YDialog()
    document.body.appendChild(dialog)
    dialog.type = 'success'
    dialog.remove = true

    const storeTheme = window.localStorage.getItem('theme')

    if (typeof arguments[0] === 'object') {
      const { title, confirmText, content, ok, size, theme } = arguments[0]
      dialog.size = size || ''
      dialog.theme = theme ? theme : !storeTheme || storeTheme === 'light' ? '' : storeTheme
      dialog.title = title || 'Success'
      dialog['confirm-text'] = confirmText || '知道了'
      dialog.onsubmit = ok || null
      dialog.innerHTML = content || ''
    } else {
      dialog.title = 'Success'
      dialog['confirm-text'] = '知道了'
      dialog.innerHTML = arguments[0] || ''
      dialog.onsubmit = arguments[1] || null
      dialog.size = arguments[2] || ''
      dialog.theme = arguments[3] ? arguments[3] : !storeTheme || storeTheme === 'light' ? '' : storeTheme
    }

    dialog.open = true

    return dialog
  },
  danger: function () {
    const dialog = new YDialog()
    document.body.appendChild(dialog)
    dialog.type = 'danger'
    dialog.remove = true

    const storeTheme = window.localStorage.getItem('theme')

    if (typeof arguments[0] === 'object') {
      const { title, confirmText, content, ok, size, theme } = arguments[0]
      dialog.size = size || ''
      dialog.theme = theme ? theme : !storeTheme || storeTheme === 'light' ? '' : storeTheme
      dialog.title = title || 'Danger'
      dialog['confirm-text'] = confirmText || '知道了'
      dialog.onsubmit = ok || null
      dialog.innerHTML = content || ''
    } else {
      dialog.title = 'Danger'
      dialog['confirm-text'] = '知道了'
      dialog.innerHTML = arguments[0] || ''
      dialog.onsubmit = arguments[1] || null
      dialog.size = arguments[2] || ''
      dialog.theme = arguments[3] ? arguments[3] : !storeTheme || storeTheme === 'light' ? '' : storeTheme
    }
    dialog.open = true

    return dialog
  },
  warning: function () {
    const dialog = new YDialog()
    document.body.appendChild(dialog)
    dialog.type = 'warning'
    dialog.remove = true

    const storeTheme = window.localStorage.getItem('theme')

    if (typeof arguments[0] === 'object') {
      const { title, confirmText, content, ok, size, theme } = arguments[0]
      dialog.size = size || ''
      dialog.theme = theme ? theme : !storeTheme || storeTheme === 'light' ? '' : storeTheme
      dialog.title = title || 'Warning'
      dialog['confirm-text'] = confirmText || '知道了'
      dialog.onsubmit = ok || null
      dialog.innerHTML = content || ''
    } else {
      dialog.title = 'Warning'
      dialog['confirm-text'] = '知道了'
      dialog.innerHTML = arguments[0] || ''
      dialog.onsubmit = arguments[1] || null
      dialog.size = arguments[2] || ''
      dialog.theme = arguments[3] ? arguments[3] : !storeTheme || storeTheme === 'light' ? '' : storeTheme
    }

    dialog.open = true

    return dialog
  },
  confirm: function () {
    const dialog = new YDialog()
    document.body.appendChild(dialog)
    dialog.remove = true
    dialog.btnCancelEle.style.visibility = 'visible'

    const storeTheme = window.localStorage.getItem('theme')

    if (typeof arguments[0] === 'object') {
      const { type, title, content, confirmText, cancelText, ok, cancel, size, theme } = arguments[0]
      dialog.size = size || ''
      dialog.theme = theme ? theme : !storeTheme || storeTheme === 'light' ? '' : storeTheme
      dialog.type = type || 'confirm'
      dialog.title = title || 'Confirm'
      dialog['confirm-text'] = confirmText || '确 定'
      dialog['cancel-text'] = cancelText || '取 消'
      dialog.innerHTML = content || ''
      dialog.onsubmit = ok || null
      dialog.oncancel = cancel || null
    } else {
      dialog.type = 'confirm'
      dialog.title = 'Confirm'
      dialog['confirm-text'] = '确 定'
      dialog['cancel-text'] = '取 消'
      dialog.innerHTML = arguments[0] || ''
      dialog.onsubmit = arguments[1] || null
      dialog.oncancel = arguments[2] || null
      dialog.size = arguments[2] || ''
      dialog.theme = arguments[3] ? arguments[3] : !storeTheme || storeTheme === 'light' ? '' : storeTheme
    }

    dialog.open = true

    return dialog
  }
}
