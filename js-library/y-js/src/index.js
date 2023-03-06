/**
 * 一个简单的封装基础库
 */
;(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    global.myLibrary = factory()
  }
})(this, function () {
  'use strict'

  var myLibrary = {}

  /**
   * 获取元素
   * @param {String} selector 选择器
   * @param {Object} context 上下文
   * @returns {Object} 元素
   */
  myLibrary.getElement = function (selector, context) {
    context = context || document
    return context.querySelector(selector)
  }

  /**
   * 获取元素集合
   * @param {String} selector 选择器
   * @param {Object} context 上下文
   * @returns {Object} 元素集合
   */
  myLibrary.getElements = function (selector, context) {
    context = context || document
    return context.querySelectorAll(selector)
  }

  /**
   * 绑定事件
   * @param {Object} element 元素
   * @param {String} eventType 事件类型
   * @param {Function} callback 回调函数
   */
  myLibrary.addEvent = function (element, eventType, callback) {
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
  myLibrary.removeEvent = function (element, eventType, callback) {
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
  myLibrary.getStyle = function (element, property) {
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
  myLibrary.addClass = function (element, className) {
    if (!myLibrary.hasClass(element, className)) {
      element.className += ' ' + className
    }
  }

  /**
   * 移除类名
   * @param {Object} element 元素
   * @param {String} className 类名
   */
  myLibrary.removeClass = function (element, className) {
    if (myLibrary.hasClass(element, className)) {
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
  myLibrary.hasClass = function (element, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    return element.className.match(reg)
  }

  return myLibrary
})
