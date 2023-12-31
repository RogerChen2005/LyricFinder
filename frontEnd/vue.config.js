const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:"./",
  devServer:{
    proxy:"http://127.0.0.1:3030"
  }
})

