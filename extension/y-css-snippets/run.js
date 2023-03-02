const fs = require('fs')

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
  const snippets = {}

  list.forEach((item) => {
    const prefix = item.match(/^\.[\w\.\,\-]*/i)[0] || ''
    const values = item.match(/(?<=\{)([\s\S]*?)(?=\})/gi)[0] || ''

    snippets[prefix] = {
      prefix: prefix,
      body: prefix,
      description: values
    }
  })

  if (snippets) {
    Utils.handleWriteFile({ path: output, content: JSON.stringify(snippets, null, 2) })
  }
})
