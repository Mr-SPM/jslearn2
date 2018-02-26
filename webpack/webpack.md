# Webpack
## 使用配置文件
> 大多数项目会需要很复杂的设置，这就是为什么 webpack 要支持配置文件。这比在终端(terminal)中输入大量命令要高效的多，所以让我们创建一个取代以上使用 CLI 选项方式的配置文件：  
*创建一个webpack.config.js作为配置文件，如果该文件存在，则webpack命令会默认选择使用它。*
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

## NPM脚本
> 考虑到用 CLI 这种方式来运行本地的 webpack 不是特别方便，我们可以设置一个快捷方式。在 package.json 添加一个 npm 脚本(npm script)：
```json
{
  ...
  "scripts": {
    "build": "webpack"
  },
  ...
}
```
实际webpackdemo项目中，往往npm run build 会调用js去执行打包程序
```js
{
  ...
  "scripts": {
    "build": "node build/build.js"
  },
  ...
}
```
```js
// build.js
'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'
// loading指示
const ora = require('ora')
// rimraf 包的作用：以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除
const rm = require('rimraf')
const path = require('path')
// 用于控制样式
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('building for production...')
spinner.start()
// 删除原有文件，成功后执行webpack命令
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})

```

# 后续的功能暂不介绍。