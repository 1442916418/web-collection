const fs = require('fs')
const path = require('path')

class Utils {
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
}

class Build {
  constructor() {
    this.init()
  }

  init() {
    Utils.handleOpenAndReadFile('.temp/css/neumorphism.css', (value) => {
      if (!value) return

      const componentsCSS = Build.handleComponentsCSS(value)

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

      const matchStr = str.match(reg)

      matchStr.forEach((item) => {
        const matchTag = item.match(/\/\*! -([\w]+) \*/i)
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
    this.init()
  }

  init() {
    const name = this.name
    // 1. 新建 `src/components/${name}.js` 并写入默认代码
    // 2. 新建 `src/components/styles.js` 并写入默认代码，正则匹配替换代码片段变量
    // 3. 新建 `src/scss/neumorphism/components/_${name}.scss` 并写入默认代码，正则匹配替换代码片段变量
    // 4. 新建 `src/scss/neumorphism/mixin/_${name}.scss` 并写入默认代码，正则匹配替换代码片段变量
    // 5. `src\scss\neumorphism\_components.scss` 追加新建文件路径
    // 6. `src\scss\neumorphism\_mixin.scss` 追加新建文件路径
  }
}

const runType = process.env.RUN_TYPE
const name = process.env.RUN_TYPE_NAME

console.log('🚀 ~ file:', runType, name)

// Utils.handleOpenAndReadFile('./.vscode/template.code-snippets', (code) => {})

// if (runType === 'BUILD') {
//   new Build()
// }
// if (runType === 'NEW' && name) {
//   new NewComponent(name)
// }
