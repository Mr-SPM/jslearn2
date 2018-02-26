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
