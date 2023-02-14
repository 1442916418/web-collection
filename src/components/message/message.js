import styles from './styles.js'

class YMessage extends HTMLElement {
  static get observedAttributes() {
    return ['size', 'type', 'icon', 'theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    const type = this.type ? `type="${this.type}"` : ''

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <div class="message" ${type}>
                              <iconpark-icon id="icon" class="icon" ></iconpark-icon>
                              <slot></slot>
                            </div>                        
                           `
  }

  get size() {
    return this.getAttribute('size')
  }

  get type() {
    return this.getAttribute('type')
  }

  get icon() {
    return this.getAttribute('icon')
  }

  get theme() {
    return this.getAttribute('theme')
  }

  get show() {
    return this.getAttribute('show') !== null
  }

  set show(value) {
    if (value === null || value === false) {
      this.removeAttribute('show')
    } else {
      this.setAttribute('show', '')
    }
  }

  set theme(value) {
    this.setAttribute('theme', value)
  }

  set icon(value) {
    this.setAttribute('icon', value)
  }

  set type(value) {
    this.setAttribute('type', value)
  }

  set size(value) {
    if (value === null || value === false) {
      this.removeAttribute('size')
    } else {
      this.setAttribute('size', '')
    }
  }

  connectedCallback() {
    this.remove = false

    this.iconEle = this.shadowRoot.getElementById('icon')

    this.shadowRootTransitionend = (e) => this.handleShadowRootTransitionendEvent(e)

    this.shadowRoot.addEventListener('transitionend', this.shadowRootTransitionend)

    this.type = this.type
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener('transitionend', this.shadowRootTransitionend)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'type' && this.iconEle) {
      if (newValue !== null && newValue !== 'null') {
        this.iconEle.name = this.getIcon(newValue).name
      }
    }
    if (name == 'icon' && this.iconEle) {
      if (newValue !== null) {
        this.iconEle.name = newValue
      }
    }
  }

  handleShadowRootTransitionendEvent(e) {
    if (e.propertyName === 'transform' && !this.show) {
      messageContent.removeChild(this)
      this.dispatchEvent(new CustomEvent('close'))
    }
  }

  getIcon(type) {
    if (!type) return

    const icons = {
      info: { name: 'info' },
      success: { name: 'success' },
      danger: { name: 'close-one' },
      warning: { name: 'attention' }
    }

    return icons[type]
  }
}

if (!customElements.get('y-message')) {
  customElements.define('y-message', YMessage)
}

let messageContent = document.getElementById('message-content')

if (!messageContent) {
  messageContent = document.createElement('div')
  messageContent.id = 'message-content'
  messageContent.style = 'position:fixed; pointer-events:none; left:0; right:0; top:10px; z-index:51;'
  document.body.appendChild(messageContent)
}

export default {
  info: function (text = '', duration, onclose) {
    const message = new YMessage()
    message.timer && clearTimeout(message.timer)
    messageContent.appendChild(message)
    message.type = 'info'
    message.textContent = text
    message.show = true
    message.onclose = onclose
    message.timer = setTimeout(() => {
      message.show = false
    }, duration || 3000)
    return message
  },
  success: function (text = '', duration, onclose) {
    const message = new YMessage()
    message.timer && clearTimeout(message.timer)
    messageContent.appendChild(message)
    message.type = 'success'
    message.textContent = text
    message.show = true
    message.onclose = onclose
    message.timer = setTimeout(() => {
      message.show = false
    }, duration || 3000)
    return message
  },
  danger: function (text = '', duration, onclose) {
    const message = new YMessage()
    message.timer && clearTimeout(message.timer)
    messageContent.appendChild(message)
    message.type = 'danger'
    message.textContent = text
    message.show = true
    message.onclose = onclose
    message.timer = setTimeout(() => {
      message.show = false
    }, duration || 3000)
    return message
  },
  warning: function (text = '', duration, onclose) {
    const message = new YMessage()
    message.timer && clearTimeout(message.timer)
    messageContent.appendChild(message)
    message.type = 'warning'
    message.textContent = text
    message.show = true
    message.onclose = onclose
    message.timer = setTimeout(() => {
      message.show = false
    }, duration || 3000)
    return message
  },
  show: function ({ text, duration, onclose, icon }) {
    const message = new YMessage()
    message.timer && clearTimeout(message.timer)
    messageContent.appendChild(message)
    message.icon = icon
    message.textContent = text || ''
    message.show = true
    message.onclose = onclose

    if (duration !== 0) {
      message.timer = setTimeout(() => {
        message.show = false
      }, duration || 3000)
    }
    return message
  }
}
