const crypto = require('crypto');

try {
  crypto.createHash('md4');
} catch (e) {
  const origCreateHash = crypto.createHash;
  crypto.createHash = (alg, opts) => {
    return origCreateHash(alg === 'md4' ? 'md5' : alg, opts);
  };
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
       preload: 'src/preload.js'  //make sure you have this line added
    }
  }
})

