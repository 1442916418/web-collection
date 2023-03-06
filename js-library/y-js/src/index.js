/**
 * 一个简单的封装基础库
 */
;(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    global.$ = factory()
  }
})(this, function () {
  'use strict'

  var $ = {}

  /**
   * 获取元素
   * @param {String} selector 选择器
   * @param {Object} context 上下文
   * @returns {Object} 元素
   */
  $.getElement = function (selector, context) {
    context = context || document
    return context.querySelector(selector)
  }

  /**
   * 获取元素集合
   * @param {String} selector 选择器
   * @param {Object} context 上下文
   * @returns {Object} 元素集合
   */
  $.getElements = function (selector, context) {
    context = context || document
    return context.querySelectorAll(selector)
  }

  /**
   * 绑定事件
   * @param {Object} element 元素
   * @param {String} eventType 事件类型
   * @param {Function} callback 回调函数
   */
  $.addEvent = function (element, eventType, callback) {
    if (element.addEventListener) {
      element.addEventListener(eventType, callback, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventType, callback)
    } else {
      element['on' + eventType] = callback
    }
  }

  /**
   * 移除事件
   * @param {Object} element 元素
   * @param {String} eventType 事件类型
   * @param {Function} callback 回调函数
   */
  $.removeEvent = function (element, eventType, callback) {
    if (element.removeEventListener) {
      element.removeEventListener(eventType, callback, false)
    } else if (element.detachEvent) {
      element.detachEvent('on' + eventType, callback)
    } else {
      element['on' + eventType] = null
    }
  }

  /**
   * 获取元素样式
   * @param {Object} element 元素
   * @param {String} property 属性
   * @returns {String} 元素样式
   */
  $.getStyle = function (element, property) {
    if (getComputedStyle) {
      return getComputedStyle(element, null)[property]
    } else {
      return element.currentStyle[property]
    }
  }

  /**
   * 添加类名
   * @param {Object} element 元素
   * @param {String} className 类名
   */
  $.addClass = function (element, className) {
    if (!$.hasClass(element, className)) {
      element.className += ' ' + className
    }
  }

  /**
   * 移除类名
   * @param {Object} element 元素
   * @param {String} className 类名
   */
  $.removeClass = function (element, className) {
    if ($.hasClass(element, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      element.className = element.className.replace(reg, ' ')
    }
  }

  /**
   * 是否包含类名
   * @param {Object} element 元素
   * @param {String} className 类名
   * @returns {Boolean} 是否包含类名
   */
  $.hasClass = function (element, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    return element.className.match(reg)
  }

  /**
   * 请求
   * @param {String} path 路径
   * @param {String} method 请求方法(默认 GET)
   * @param {Object | String} data 请求参数(默认为空)
   * @returns JSON 数据
   */
  $.requests = function (path, method, data) {
    if (!path) {
      throw new Error('$.requests path is undefined.')
    }

    method = method || 'GET'
    method = method.toUpperCase()

    data = data || {}

    var requestHeader = {
      headers: {
        'content-type': 'application/json'
      },
      method
    }

    if (method === 'GET') {
      if (typeof data !== 'string') {
        var esc = encodeURIComponent

        var queryParams = Object.keys(data)
          .map(function (k) {
            return esc(k) + '=' + esc(data[k])
          })
          .join('&')

        if (queryParams) {
          path += '?' + queryParams
        }
      }
    } else {
      requestHeader.body = JSON.stringify(data)
    }

    return fetch(path, requestHeader).then(function (response) {
      return response.json()
    })
  }

  return $
})
