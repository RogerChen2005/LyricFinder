const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
})

// module.exports = {
//   devServer: {
//       open: true, //自动打开浏览器
//       host: 'localhost',
//       port: 8080,
//       https: false,
//       //以上的ip和端口是我们本机的;下面为需要跨域的
//       proxy: {//配置跨域
//           '/api': {
//               target: 'http://localhost:3030',//填写你们真实的后台接口
//               ws: true,
//               changOrigin: true,//允许跨域
//               pathRewrite: {
//                   '^/api': ''//请求的时候使用这个api就可以
//               }
//           }
          
//       }
//   }
// }

