const md = require('marked')

module.exports = function (source) {
  this.cacheable()
  // source 是原始文件内容，html 是用 markdown-it 编译后的 html 内容
  const html = md.parse(source);
  const template = (
    `<template>
      <div class="markdown-body">
        ${html}
      </div>
    </template>`
  )
  return template
}