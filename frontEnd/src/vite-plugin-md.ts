import { marked } from 'marked'
import { compileTemplate } from 'vue/compiler-sfc'
import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'

export default function mdPlugin(): Plugin {
  return {
    name: 'vite-plugin-md',
    transform(code, id) {
      if (!id.endsWith('.md')) return
      const src = readFileSync(id, 'utf-8')
      const html = marked.parse(src)
      const template = `<div class="markdown-body">${html}</div>`
      const result = compileTemplate({
        source: template,
        filename: id,
        id
      })
      return {
        code: `${result.code}\nexport default { render: render }`,
        map: null
      }
    }
  }
}
