const fs = require('fs')
const path = require('path')

const init = () => {
  handleOpenAndReadFile('.temp/css/neumorphism.css', (value) => {
    if (!value) return

    const componentsCSS = handleComponentsCSS(value)

    if (componentsCSS.size) {
      for (const [key, value] of componentsCSS) {
        if (key && value) {
          handleWriteFile({
            path: './src/components/' + key + '/styles.js',
            content: 'export default `' + value + '`'
          })
        }
      }
    }
  })
}

const handleComponentsCSS = (str) => {
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

const handleOpenAndReadFile = (filePath, callback) => {
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

const handleWriteFile = (v) => {
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

init()
