const { Utils } = require('../../ui-library/y-ui/run.js')

const entry = '../../ui-library/y-css/dist/index.css'
const output = './snippets/snippets.code-snippets'

Utils.handleOpenAndReadFile(entry, (data) => {
  if (!data) return

  /**
   * Delete media
   */
  data = data.replace(/\@media[\s\S]*?\}\}/gi, '')

  /**
   * Class styles
   *
   * @example
   *   .m-10{margin:10px}
   *   .mt-10,.my-10{margin-top:10px}
   */
  const list = data.match(/\.([\w\.\,\-]*)\{([\s\S]*?)\}/gi)
  const reg = /\,/g
  const prefixReg = /^\.[\w\.\,\-]*/i
  const valueReg = /(?<=\{)([\s\S]*?)(?=\})/gi

  const snippets = new Map()

  const handleSnippets = (prefix, values) => {
    if (!prefix) return

    const name = prefix.substring(1)

    if (!snippets.has(name)) {
      snippets.set(name, {
        prefix: prefix,
        body: name,
        description: values
      })
    }
  }

  list.forEach((item) => {
    const prefix = item.match(prefixReg)[0] || ''
    const values = item.match(valueReg)[0] || ''

    if (prefix && values) {
      if (prefix.includes(',')) {
        const prefixList = prefix.split(',')

        prefixList.forEach((pre) => {
          handleSnippets(pre, values)
        })
      } else {
        handleSnippets(prefix, values)
      }
    }
  })

  if (snippets.size) {
    Utils.handleWriteFile({ path: output, content: JSON.stringify(Object.fromEntries(snippets), null, 2) })

    setTimeout(() => {
      snippets.clear()
    })
  }
})
