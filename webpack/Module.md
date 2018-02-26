# 模块方法
# import()
```js
import('path/to/module') -> Promise
```
> 动态地加载模块。调用 import() 之处，被作为分离的模块起点，意思是，被请求的模块和它引用的所有子模块，会分离到一个单独的 chunk 中。
> import 规范不允许控制模块的名称或其他属性，因为 "chunks" 只是 webpack 中的一个概念。幸运的是，webpack 中可以通过注释接收一些特殊的参数，而无须破坏规定：
```js
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
);
```
#### webpackModel选项
* lazy   
默认：为每个 import() 导入的模块，生成一个可延迟加载(lazy-loadable) chunk。
* lazy-once  
生成一个可以满足所有 import() 调用的单个可延迟加载(lazy-loadable) chunk。此 chunk 将在第一次 import() 调用时获取，随后的 import() 调用将使用相同的网络响应。注意，这种模式仅在部分动态语句中有意义，例如 import(`./locales/${language}.json`)，其中可能含有多个被请求的模块路径。
* eager  
不会生成额外的 chunk，所有模块都被当前 chunk 引入，并且没有额外的网络请求。仍然会返回 Promise，但是是 resolved 状态。和静态导入相对比，在调用 import（）完成之前，该模块不会被执行。
* weak  
尝试加载模块，如果该模块函数已经以其他方式加载（即，另一个 chunk 导入过此模块，或包含模块的脚本被加载）。仍然会返回 Promise，但是只有在客户端上已经有该 chunk 时才成功解析。如果该模块不可用，Promise 将会是 rejected 状态，并且网络请求永远不会执行。当需要的 chunks 始终在（嵌入在页面中的）初始请求中手动提供，而不是在应用程序导航在最初没有提供的模块导入的情况触发，这对于通用渲染（SSR）是非常有用的。

# CommonJS
## require
> 以同步的方式检索其他模块的导出。由编译器(compiler)来确保依赖项在最终输出 bundle 中可用。
```js
require(dependency:String)
// eg
var $ = require("jquery");
```
## require.resolve
> 以同步的方式获取模块的 ID。由编译器(compiler)来确保依赖项在最终输出 bundle 中可用。
*webpack 中模块 ID 是一个数字（而在 NodeJS 中是一个字符串 -- 也就是文件名）。*
```js
require.resolve(dependency:String)
```
## require.cache
多处引用同一个模块，最终只会产生一次模块执行和一次导出。所以，会在运行时(runtime)中会保存一份缓存。
```js
var d1 = require("dependency");
require("dependency") === d1
delete require.cache[require.resolve("dependency")];
require("dependency") !== d1
```
## require.ensure
**require.ensure() 是 webpack 特有的，已经被 import() 取代。**
> 给定 dependencies 参数，将其对应的文件拆分到一个单独的 bundle 中，此 bundle 会被异步加载。当使用 CommonJS 模块语法时，这是动态加载依赖的唯一方法。意味着，可以在模块执行时才运行代码，只有在满足某些条件时才加载依赖项。
```js
require.ensure(dependencies: String[], callback: function(require), errorCallback: function(error), chunkName: String)
// eg
var a = require('normal-dep');

if ( module.hot ) {
  require.ensure(['b'], function(require) {
    var c = require('c');

    // Do something special...
  });
}
```
webpack支持以下参数：
* denpendencies  
字符串构成的数组，声明 callback 回调函数中所需的所有模块。
* callback  
只要加载好全部依赖，webpack 就会执行此函数。require 函数的实现，作为参数传入此函数。当程序运行需要依赖时，可以使用 require() 来加载依赖。函数体可以使用此参数，来进一步执行 require() 模块。
* errorCallback  
当 webpack 加载依赖失败时，会执行此函数。
* chunkName   
由 require.ensure() 创建出的 chunk 的名字。通过将同一个 chunkName 传递给不同的 require.ensure() 调用，我们可以将它们的代码合并到一个单独的 chunk 中，从而只产生一个浏览器必须加载的 bundle。  
*虽然我们将 require 的实现，作为参数传递给回调函数，然而如果使用随意的名字，例如 require.ensure([], function(request) { request('someModule'); }) 则无法被 webpack 静态解析器处理，所以还是请使用 require，例如 require.ensure([], function(require) { require('someModule'); })。*
