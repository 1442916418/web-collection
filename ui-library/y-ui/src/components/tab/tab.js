import styles from './styles.js'

import YButton from '../button/button.js'

export default class YTab extends HTMLElement {
  static get observedAttributes() {
    return ['active-key', 'theme']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `<style>${styles}</style>
                            <style id="filter"></style>
                            <div class="tab">
                              <div class="tab-nav-container">
                                <div class="tab-nav" id="nav"></div>
                              </div>
                              <div class="tab-content">
                                <div class="tab-content-wrap" id="tab-content"><slot id="slot">NEED CONTENT</slot></div>
                              </div>
                            </div>
                            `
  }

  get activeKey() {
    return this.getAttribute('active-key')
  }

  get theme() {
    return this.getAttribute('theme')
  }

  get size() {
    return this.getAttribute('size')
  }

  set theme(value) {
    if (value) {
      this.setAttribute('theme', value)
    } else {
      this.removeAttribute('theme')
    }
  }

  set size(value) {
    this.setAttribute('size', value)
  }

  set activeKey(value) {
    this.setAttribute('active-key', value)
  }

  connectedCallback() {
    this.setAttribute('sign', 'query')

    this.tabNavItemInfo = {}

    this.navEle = this.shadowRoot.getElementById('nav')
    this.tabContentEle = this.shadowRoot.getElementById('tab-content')
    this.slotsEle = this.shadowRoot.getElementById('slot')
    this.filter = this.shadowRoot.getElementById('filter')

    this.slotsChange = () => this.handleSlotChangeEvent()
    this.navClick = (e) => this.handleNavClickEvent(e)
    this.navKeydown = (e) => this.handleNavKeydownEvent(e)

    this.slotsEle.addEventListener('slotchange', this.slotsChange)
    this.navEle.addEventListener('click', this.navClick)
    this.navEle.addEventListener('keydown', this.navKeydown)

    this.handleTheme()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'theme' && this.navEle) {
      const navItems = this.navEle.querySelectorAll('y-button')

      if (navItems.length) {
        navItems.forEach((item) => {
          if (newValue === null) {
            item.removeAttribute('theme')
          } else {
            item.setAttribute('theme', newValue)
          }
        })
      }
    }

    if (name == 'active-key' && this.tabContentEle) {
      let active = this.tabNavItemInfo[newValue]

      if (active === undefined) {
        this.activeKey = this.slotsEle.assignedElements()[0].key

        active = this.tabNavItemInfo[this.activeKey]
      }

      this.tabContentEle.style.transform = `translateX(${-active.index * 100}%)`
      this.filter.textContent = `
          ::slotted(y-tab-pane:not([key="${this.activeKey}"])){
              height:0;
              overflow:visible;
          }
          `
      if (oldValue !== newValue) {
        this.navEle.parentNode.scrollLeft = active.left + active.width / 2 - this.navEle.parentNode.offsetWidth / 2

        const pre = this.navEle.querySelector(`.nav-item.active`)

        if (pre) {
          pre.classList.remove('active')
        }

        const cur = this.navEle.querySelector(`.nav-item[data-key='${newValue}']`)

        cur.classList.add('active')
        cur.focus()

        if (this.init && oldValue !== null) {
          this.dispatchEvent(
            new CustomEvent('change', {
              detail: {
                key: this.activeKey,
                index: active.index,
                label: active.label
              }
            })
          )
        }
      }
    }
  }

  handleSlotChangeEvent() {
    const slots = this.slotsEle.assignedElements()

    let html = ''

    const size = this.size ? `size="${this.size}"` : ''

    slots.forEach((item, index) => {
      if (item.tagName === 'Y-TAB-PANE') {
        if (item.key === null) {
          item.key = index
        }

        const icon = item.icon ? `icon="${item.icon}"` : ''
        const disabled = item.disabled !== null ? 'disabled' : ''
        const active = item.key === this.activeKey ? 'active' : ''

        html += `<y-button class="nav-item ${active}" ${size} ${icon} ${disabled} data-key=${item.key}>${item.label}</y-button>`
      }
    })

    this.navEle.innerHTML = html

    this.initTab()

    this.activeKey = this.activeKey === null ? slots[0].key : this.activeKey

    this.init = true
  }

  handleNavClickEvent(e) {
    const item = e.target.closest('y-button')

    if (item) {
      this.activeKey = item.dataset.key
    }
  }

  handleNavKeydownEvent(e) {
    switch (e.code) {
      case 'ArrowLeft':
        e.preventDefault()
        this.handleMove(-1)
        break
      case 'ArrowRight':
        e.preventDefault()
        this.handleMove(1)
        break
    }
  }

  initTab() {
    const items = this.navEle.querySelectorAll('.nav-item')

    Array.from(items).forEach((item, index) => {
      this.tabNavItemInfo[item.dataset.key] = {
        index: index,
        width: item.offsetWidth,
        left: item.offsetLeft,
        label: item.textContent
      }
    })
  }

  updateLabel(key, label) {
    const nav = this.navEle.querySelector(`.nav-item[data-key='${key}']`)

    if (nav) {
      nav.innerHTML = label
      this.initTab()
    }
  }

  updateDisabled(key, disabled) {
    const nav = this.navEle.querySelector(`.nav-item[data-key='${key}']`)

    if (nav) {
      nav.disabled = disabled
    }
  }

  handleMove(index) {
    const cur = this.navEle.querySelector(`.nav-item.active`)

    if (index > 0 && cur.nextElementSibling) {
      this.activeKey = cur.nextElementSibling.dataset.key
    }
    if (index < 0 && cur.previousElementSibling) {
      this.activeKey = cur.previousElementSibling.dataset.key
    }
  }

  handleTheme() {
    const theme = window.localStorage.getItem('theme')

    this.theme = theme && theme === 'dark' ? theme : ''
  }
}

if (!customElements.get('y-tab')) {
  customElements.define('y-tab', YTab)
}
