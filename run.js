const fs = require('fs')
const path = require('path')

class Utils {
  /**
   * Open and read file
   * @param {String} filePath path
   * @param {callback} callback callback function
   * @returns
   */
  static handleOpenAndReadFile(filePath, callback) {
    if (!filePath) return

    fs.open(filePath, 'r', (err, fd) => {
      if (err) {
        throw err
      }

      const result = fs.readFileSync(filePath, {
        encoding: 'utf8'
      })

      callback(result)
    })
  }

  /**
   * Write file
   * @param {Object} v params
   * @param {String} v.path path
   * @param {String} v.content content
   */
  static handleWriteFile(v) {
    if (!v.path) {
      throw new Error('\n utils handleWriteFile: 写入文件请传入路径')
    }

    let fileDir = v.path.split(path.sep).slice(0, -1)

    fileDir = path.join(...fileDir)

    if (fileDir && !fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir)
    }

    fs.writeFile(
      v.path,
      v.content,
      {
        encoding: 'utf8'
      },
      (err) => {
        if (err) {
          console.error(err)
          return
        }
        console.log(`🚀 ~ ${v.path} => 文件写入成功`)
      }
    )
  }

  /**
   * 同步地创建目录
   * @param {String} path path
   */
  static mkdir(path) {
    if (path && !fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  }

  /**
   * 首字母大写
   * @param {String} value 单词
   * @example
   *   upper => Upper
   * @returns 首字母大写单词
   */
  static capitalized(value) {
    return value.charAt(0).toLocaleUpperCase() + value.slice(1)
  }

  /**
   * 大驼峰命名法
   * @param {String} value 单词
   * @param {String} separator 分隔符
   * @example
   *   upper-camel-case => UpperCamelCase
   * @returns 大驼峰
   */
  static handleUpperCamelCase(value, separator) {
    separator = separator || '-'

    return value
      .split(separator)
      .map((val) => Utils.capitalized(val))
      .join('')
  }
}

class Build {
  constructor() {
    this.init()
  }

  init() {
    Utils.handleOpenAndReadFile('.temp/css/neumorphism.css', (value) => {
      if (!value) return

      const componentsCSS = this.handleComponentsCSS(value)

      if (componentsCSS.size) {
        for (const [key, value] of componentsCSS) {
          if (key && value) {
            Utils.handleWriteFile({
              path: './src/components/' + key + '/styles.js',
              content: 'export default `' + value + '`'
            })
          }
        }
      }
    })
  }

  handleComponentsCSS(str) {
    if (!str) return void 0

    const result = new Map()

    try {
      const reg = /(?<=^|\/)\s*\/\*![\s\S]*?\*\/\s*(?=$|\/)/gi

      str = str.replace('@charset "UTF-8";', '')

      const matchStr = str.match(reg)

      matchStr.forEach((item) => {
        const matchTag = item.match(/\/\*! -([\w-]+) \*/i)
        const tagName = matchTag[1] || 'default'

        item.replace(/\*\/([\s\S]*?)\/\*!/gi, function (con, p1) {
          if (tagName && p1) {
            result.set(tagName, p1)
          }
        })
      })
    } catch (error) {
      console.log(error)
      return result
    }

    return result
  }
}

class NewComponent {
  constructor(name) {
    this.name = name
    this.newName = name.toLocaleLowerCase()
    this.componentsTemplateCode = ''
    this.scssComponentsTemplateCode = ''
    this.scssMixinTemplateCode = ''

    this.init()
  }

  init() {
    const path = `src/components/${this.newName}`

    if (fs.existsSync(path)) {
      console.log(`🚀 ~ ${path} => 组件/路径已存在 \n`)
      process.exit(1)
    }

    this.handleTemplate()

    setTimeout(() => {
      this.handleNewComponent()
    }, 1000)
  }

  handleNewComponent() {
    const newName = this.newName

    // 1. 新建组件，并写入默认代码
    Utils.mkdir(`src/components/${newName}`)
    Utils.handleWriteFile({
      path: `src/components/${newName}/${newName}.js`,
      content: this.componentsTemplateCode
    })

    // 2. 新建组件样式，并写入默认代码，正则匹配替换代码片段变量
    Utils.handleWriteFile({
      path: `src/components/${newName}/styles.js`,
      content: 'export default ``'
    })

    // 3. 新建 scss 组件，并写入默认代码，正则匹配替换代码片段变量
    Utils.handleWriteFile({
      path: `src/scss/neumorphism/components/_${newName}.scss`,
      content: this.scssComponentsTemplateCode
    })

    // 4. 新建 scss 组件 mixin，并写入默认代码，正则匹配替换代码片段变量
    Utils.handleWriteFile({
      path: `src/scss/neumorphism/mixins/_${newName}.scss`,
      content: this.scssMixinTemplateCode
    })

    // 5. scss 组件，追加新建文件路径
    Utils.handleOpenAndReadFile('src/scss/neumorphism/_components.scss', (data) => {
      Utils.handleWriteFile({
        path: 'src/scss/neumorphism/_components.scss',
        content: `${data}@import 'components/${newName}';\n`
      })
    })

    // 6. scss mixin，追加新建文件路径
    Utils.handleOpenAndReadFile('src/scss/neumorphism/_mixins.scss', (data) => {
      Utils.handleWriteFile({
        path: 'src/scss/neumorphism/_mixins.scss',
        content: `${data}@import 'mixins/${newName}';\n`
      })
    })

    // 7. src/index.js，追加新建组件路径
    Utils.handleOpenAndReadFile('src/index.js', (data) => {
      Utils.handleWriteFile({
        path: 'src/index.js',
        content: `${data}import './components/${newName}/${newName}.js'\n`
      })
    })
  }

  handleTemplate() {
    Utils.handleOpenAndReadFile('.vscode/template.code-snippets', (code) => {
      if (code) {
        const data = JSON.parse(code)

        this.componentsTemplateCode = this.handleComponentsTemplateCode(data['Components template'])
        this.scssComponentsTemplateCode = this.handleScssComponentsTemplateCode(data['SCSS Components template'])
        this.scssMixinTemplateCode = this.handleScssMixinTemplateCode(data['SCSS Mixin template'])
      }
    })
  }

  handleComponentsTemplateCode(snippets) {
    if (!snippets) return ''

    let data = snippets.body.join('\n')

    const newName = Utils.handleUpperCamelCase(this.name)

    data = data
      .replace(/\$1/gi, `Y${newName}`)
      .replace(/\$2/gi, `y-${this.name.toLocaleLowerCase()}`)
      .replace(/\\\$0/gi, '')
      .replace(/\\(?=\$)/gi, '')

    return data
  }

  handleScssComponentsTemplateCode(snippets) {
    if (!snippets) return ''

    let data = snippets.body.join('\n')

    data = data
      .replace(/\$1/gi, this.name.toLocaleLowerCase())
      .replace(/\$0/gi, '')
      .replace(/\\(?=\$)/gi, '')

    return data
  }

  handleScssMixinTemplateCode(snippets) {
    if (!snippets) return ''

    let data = snippets.body.join('\n')

    data = data
      .replace(/\\$/gi, '')
      .replace(/\$1/gi, this.name.toLocaleLowerCase())
      .replace(/\$0/gi, '')
      .replace(/\\(?=\$)/gi, '')

    return data
  }
}

const runType = process.env.RUN_TYPE
const name = process.env.FILE_NAME

if (runType === 'BUILD') {
  new Build()
}
if (runType === 'NEW' && name) {
  new NewComponent(name)
}
