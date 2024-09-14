const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  outputDir:"static",
  devServer:{
    proxy:"http://127.0.0.1:3030"
    // proxy:"https://app.cast1e.top/lf"
  },  chainWebpack: config => {
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('vue-loader')
        .loader('vue-loader')
        .end()
      .use('md-loader')
        .loader(path.resolve(__dirname, 'src/loader/md-loader.js'))
        .end()
  }
})

