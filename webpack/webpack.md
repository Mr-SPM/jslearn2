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

# 管理资源
## 加载CSS
> 加载CSS文件，需要在**module**中配置
1. 加载最简单的CSS文件
```
npm install --save-dev style-loader css-loader
```
```js
module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader'
         ]
       }
     ]
   }
```
2. 加载SCSS举例
```js
// 直接加载外部scss
module: {
     rules: [
       {
         test: /\.scss$/,
         use: [
           'style-loader',
           'sass-loader'
         ]
       }
     ]
   }
// vue内部支持sass等多种样式类型
module: {
     rules: [
       {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
     ]
   }
// vueLoaderConfig
// vue-loader.conf.js
'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
// utils.cssLoaders
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

```
3. [CSS分离](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin)  
使用插件 ExtractTextWebpackPlugin  
    * 安装
    ```
    npm install --save-dev extract-text-webpack-plugin
    ```
    * 用法
    ```js
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ```
    > 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

## 加载图片 & limit优化
加载图片,视频，字体文件等均可使用url-loader  
```js
{
    test: /\.(png|svg|jpg|gif)$/,
     // url limit 可以将limit以下的文件转换为base64，从而减少http请求，默认为不限制
    loader: 'url-loader?limit=8192&name=img/[name][hash:8].[ext]'
    
}
```

## 全局资源
> 上述所有内容中最出色之处是，以这种方式加载资源，你可以以更直观的方式将模块和资源组合在一起。无需依赖于含有全部资源的 /assets 目录，而是将资源与代码组合在一起。

# 管理输出

## HtmlWebpackPlugin
> 如果我们更改了我们的一个入口起点的名称，甚至添加了一个新的名称，会发生什么？生成的包将被重命名在一个构建中，但是我们的index.html文件仍然会引用旧的名字。我们用 HtmlWebpackPlugin 来解决这个问题。  

> HtmlWebpackPlugin 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。
* 安装  
```
npm install --save-dev html-webpack-plugin
```
* 使用  
```js
plugins: [
    new HtmlWebpackPlugin({
        title: 'Output Management'
    })
]
```
### [HtmlWebpackPlugin API详解](https://github.com/jantimon/html-webpack-plugin)
#### Configuration
* title 用于生成的HTML文档的标题。
* filename 要写入HTML的文件。默认为index.html。你也可以在这里指定一个子目录（例如：assets / admin.html）。
* template Webpack需要路径到模板。有关详细信息，请参阅文档。  
如果默认生成的HTML不能满足您的需求，您可以提供自己的模板。 最简单的方法是使用模板选项并传递一个自定义HTML文件。 html-webpack-plugin会自动将所有必要的CSS，JS，manifest和favicon文件注入到标记中。
* inject true | 'head'| 'body'| false将所有资源注入到给定的模板或templateContent中 - 传递true或“body”时，所有javascript资源都将放置在body元素的底部。 'head'将脚本放在head元素中。
* favicon 将给定的favicon路径添加到输出html。
* minify 
* hash
* cache
* showErrors
* chunks 允许您只添加一些块（例如，只有单元测试块）
* chunksSortMode
* excludeChunks
* xhtml 将链接标签呈现为自动关闭，符合XHTML标准。默认为false

#### 生成多个输出文件
```js
plugins: [
    new HtmlWebpackPlugin(), // Generates default index.html
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'test.html',
      template: 'src/assets/test.html'
    })
  ]
```

## 清理输出文件夹 clean-webpack-plugin 
* 安装
```
npm install clean-webpack-plugin --save-dev
```
* 使用
```js
/// 引用
const CleanWebpackPlugin = require('clean-webpack-plugin');
/// 配置
 plugins: [
    new CleanWebpackPlugin(['dist'])
],
```

## [Manifest](https://doc.webpack-china.org/concepts/manifest)
> 你可能会感兴趣，webpack及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。  

# 开发
## 使用source map
> 为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 b.js，source map 就会明确的告诉你。  
### devtool:不同的选项
这里我只介绍部分配置选项，和现在webpackdemo里面推荐的设置类型  
* eval 生成的代码  
每个模块都使用eval（）和// @ sourceURL执行。这很快。主要的缺点是它不能正确显示行号，因为它被映射到编译代码而不是原始代码（从加载程序没有源代码映射）。
* eval-source-map 原始来源  
每个模块用eval（）执行，并且一个SourceMap作为DataUrl添加到eval（）。 最初它很慢，但它提供了快速的重建速度并生成真正的文件。 行号被正确映射，因为它被映射到原始代码。 它产生了用于开发的最佳质量的SourceMaps。
* source-map 原始来源  
完整的SourceMap作为单独的文件发出。它为该包添加了一个引用评论，以便开发工具知道在哪里可以找到它。（您应该将您的服务器配置为不允许对普通用户访问源映射文件！）

## webpack-dev-server
> 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。
* 安装
```
npm install --save-dev webpack-dev-server
```
* 使用 & api解析
### devServer 
参考webpackdemo
* NPM脚本 webpack.dev.conf.js
```json
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "build": "node build/build.js"
  },
```
* 选项
```js
devServer: {
    // 当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息,可能的值有 none, error, warning 或者 info（默认值）。
    clientLogLevel: 'warning',
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过传入 true 启用：
    // 传入对象，比如使用rewrite选项可以进一步的控制
    /*
    historyApiFallback: {
  rewrites: [
    { from: /^\/$/, to: '/views/landing.html' },
    { from: /^\/subpage/, to: '/views/subpage.html' },
    { from: /./, to: '/views/404.html' }
  ]
}
    */
    historyApiFallback: true,
    // 启用 webpack 的模块热替换特性
    //webpack.HotModuleReplacementPlugin is required to fully enable HMR
    hot: true,
    // 一切服务都启用gzip 压缩
    compress: true,
    // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，需要指定主机ip
    host: HOST || config.dev.host,
    // 端口
    port: PORT || config.dev.port,
    // 如果设置为true,devServer将自动打开浏览器
    open: config.dev.autoOpenBrowser,
    // 当出现编译器错误或警告时，在浏览器中显示全屏叠加。默认情况下禁用。如果您只想显示编译器错误
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 此路径下的打包文件可在浏览器中访问。
    publicPath: config.dev.assetsPublicPath,
    // 如果你有单独的后端开发服务器 API，并且希望在同域名下发送 API 请求 ，那么代理某些 URL 会很有用。
    proxy: config.dev.proxyTable,
    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见。
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 与监视文件相关的控制选项。
    //webpack 使用文件系统(file system)获取文件改动的通知
    watchOptions: {
      // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。
      // Watch 在 NFS 和 VirtualBox 机器上不适用。
      poll: config.dev.poll
    }
  },
  plugins: [
    // DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 模块热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
```
### proxy详解
```js
// 请求到 /api/users 现在会被代理到请求 http://localhost:3000/api/users。
proxy: {
  "/api": "http://localhost:3000"
}
// 如果不想始终传递/api,则需重写路径
 "/api": {
    target: "http://localhost:3000",
    pathRewrite: {"^/api" : ""}
}
// 接受HTTPS，且使用了无效证书的后端服务器
"/api": {
    target: "https://other-server.example.com",
    secure: false
}
//有时你不想代理所有的请求。可以基于一个函数的返回值绕过代理。
// eg：对于浏览器请求，你想要提供一个 HTML 页面，但是对于 API 请求则保持代理。
 "/api": {
    target: "http://localhost:3000",
    bypass: function(req, res, proxyOptions) {
      if (req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
    }
  }
// 如果要代理多个指向同一目标的特定路径，可以使用具有上下文属性的一个或多个对象的数组
proxy: [{
  context: ["/auth", "/api"],
  target: "http://localhost:3000",
}]
```

# Tree Shaking
> tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。
```js
// src/math.js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
// src/index.js
// 未加载square
import { cube } from './math.js';

// bundle.js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export square */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
function square(x) {
  return x * x;
}

function cube(x) {
  return x * x * x;
}
// 仍然包含在bundle中，但没有被导入
```
## 精简输出 uglifyjs-webpack-plugin
* 安装
```
npm install --save-dev uglifyjs-webpack-plugin
```
* 配置
```js
plugins: [
   new UglifyJSPlugin()
]
```
注意，也可以在命令行接口中使用 --optimize-minimize 标记，来使用 UglifyJsPlugin。虽然，在这个特定示例中，可能看起来没有减少很多，但是，在具有复杂的依赖树的大型应用程序上运行时，tree shaking 或许会对 bundle 产生显著的体积优化。


# 生产环境构建
## 配置
> 开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。  
虽然，以上我们将生产环境和开发环境做了略微区分，但是，请注意，我们还是会遵循不重复原则(Don't repeat yourself - DRY)，保留一个“通用”配置。为了将这些配置合并在一起，我们将使用一个名为 webpack-merge 的工具。通过“通用”配置，我们不必在环境特定(environment-specific)的配置中重复代码。
### [webpack-merge](https://github.com/survivejs/webpack-merge)
> webpack-merge提供了一个合并函数，用于连接数组并合并创建新对象的对象。 如果遇到函数，它将执行它们，通过算法运行结果，然后将返回的值再次包含在函数中。 这种行为在配置webpack时特别有用，尽管它已经超越了它。 无论何时需要合并配置对象，webpack-merge都可以派上用场。 还有一个名为merge.smart的webpack特定合并变体，它能够考虑webpack特定的细节。
* 安装
```
npm install --save-dev webpack-merge
```
* 使用
```
// webpack.common.js
// webpack.dev.js
// webpack.prod.js
```

## 特定环境
>许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容。例如，当不处于生产环境中时，某些 library 为了使调试变得容易，可能会添加额外的日志记录(log)和测试(test)。其实，当使用 process.env.NODE_ENV === 'production' 时，一些 library 可能针对具体用户的环境进行代码优化，从而删除或添加一些重要代码。我们可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量：