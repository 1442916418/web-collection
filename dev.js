const fs = require('fs')
const path = require('path')

const components = ['button']

const init = () => {
  components.forEach((item) => {
    handleOpenAndReadFile('./src/components/' + item + '/styles.css', (value) => {
      if (value) {
        handleWriteFile({
          path: './src/components/' + item + '/styles.js',
          content: 'export default `' + value + '`'
        })
      }
    })
  })
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
