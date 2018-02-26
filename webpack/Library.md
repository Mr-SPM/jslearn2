# Library
> 除了打包应用程序代码，webpack 还可以用于打包 JavaScript library。以下指南适用于希望流水线化(streamline)打包策略的 library 作者。
## 创建一个library，基本配置
* 不打包第三方库，而是使用 **externals** 来 require 用户加载好的库。
```js
// 以代码需要第三方库lodash举例
module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js'
   },
   externals: {
     lodash: {
       commonjs: 'lodash',
       commonjs2: 'lodash',
       amd: 'lodash',
       root: '_'
     }
    }
};
```
*注意，如果你计划只是将 library 用作另一个 webpack bundle 中的依赖模块，则可以将 externals 指定为数组。*
## 外部拓展的限制
> 对于从一个依赖目录中，调用多个文件的 library，无法通过在 externals 中指定 library 目录的方式，将它们从 bundle 中排除。你需要逐个排除它们，或者使用正则表达式排除。
```js
// 正则举例
externals: [
  // Everything that starts with "library/"
  /^library\/.+$/
]
```
## 暴露library
```js
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
+     library: 'webpackNumbers',
      // 暴露方式 var ,this,window,UMD
+     libraryTarget: 'umd'
    },

```
## 最终步骤
> 遵循生产环境指南中的步骤，来优化生产环境下的输出。那么，我们还需要通过设置 package.json 中的 main 字段，添加生成 bundle 的文件路径。
```json
{
  ...
  "main": "dist/webpack-numbers.js",
  ...
}
// or
{
  ...
  // module 是一个提案，此提案允许 JavaScript 生态系统升级使用 ES2015 模块，而不会破坏向后兼容性。
  "module": "src/index.js",
  ...
}
```