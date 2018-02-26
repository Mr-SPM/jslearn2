# Shimming

> webpack 编译器(compiler)能够识别遵循 ES2015 模块语法、CommonJS 或 AMD 规范编写的模块。然而，一些第三方的库(library)可能会引用一些全局依赖（例如 jQuery 中的 $）。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 shimming 发挥作用的地方。
> shimming 另外一个使用场景就是，当你希望 polyfill 浏览器功能以支持更多用户时。在这种情况下，你可能只想要将这些 polyfills 提供给到需要修补(patch)的浏览器（也就是实现按需加载）。

## shimming 全局变量

### ProvidePlugin

> 把模块作为我们应用程序中的一个全局变量，而不必到处 import 或 require 。任何时候，当 identifier 被当作未赋值的变量时，module 就会自动被加载，并且 identifier 会被这个 module 输出的内容所赋值。（模块的 property 用于支持命名导出(named export)）。

```js
new webpack.ProvidePlugin({
  identifier: 'module1'
  // ...
});
// eg 使用jQuery
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
});
// 使用库的某一属性
new webpack.ProvidePlugin({
  identifier: ['module1', 'property1']
  // ...
});
// lodash Map
new webpack.ProvidePlugin({
  _map: ['lodash', 'map']
});
```

### 细粒度 shimming

> 一些传统的模块依赖的 this 指向的是 window 对象。当模块运行在 CommonJS 环境下这将会变成一个问题，也就是说此时的 this 指向的是 module.exports
> 可以通过使用 imports-loader 覆写 this

```js
module: {
     rules: [
       {
         test: require.resolve('index.js'),
         use: 'imports-loader?this=>window'
       }
     ]
   },
```

### 全局 exports

> 我们可以使用 exports-loader，将一个全局变量作为一个普通的模块来导出。

### 加载 polyfills

载入 polyfills 的方法，以 babel-polyfill 举例

1.

```js
npm install --save babel-polyfill
// index.js
import 'babel-polyfill';
```

这种方式，在主 bundle 中引入 polyfills，会使那些使用现代浏览器的用户下载体积很大，但却不需要的脚本文件。

2. 让我们把 import 放入一个新文件，并加入 whatwg-fetch polyfill：

```js
npm install --save whatwg-fetch
import 'babel-polyfill';
// 新增 polyfills.js
// polyfills.js
import 'babel-polyfill';
import 'whatwg-fetch';
// webpack.config.js
entry: {
    polyfills:'./src/polyfills.js',
    index: './src/index.js'
}
// 之后再根据需要来确定是否要引入polyfills
```

3. 深度优化
   > 使用 babel-preset-env 来转译那些你浏览器中不支持的特性，参考 babel 教程。

```js
{
    test: /\.js$/,
    loader: 'babel-loader',
    include: [resolve('src'), resolve('test')]
},
```
