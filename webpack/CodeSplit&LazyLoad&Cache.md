# 代码分离
有三种常用的代码分离方法：
* 入口起点：使用**entry**配置手动地分离代码。
* 防止重复： 使用**CommonsChunkPlugin** 去重和分离chunk。
* 动态导入：通过模块的内联函数调用来分离代码。

## 入口起点
```js
entry: {
  index: './src/index.js',
  another: './src/another-module.js'
}
```
### 存在问题
* 如果入口 chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中。
* 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

## 防止重复
>[CommonsChunkPlugin](https://doc.webpack-china.org/plugins/commons-chunk-plugin) 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
> CommonsChunkPlugin 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。
### 配置
```js
new webpack.optimize.CommonsChunkPlugin(options)

// options
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) -> boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。


  children: boolean,
  // 如果设置为 `true`，所有  公共chunk 的子模块都会被选择

  deepChildren: boolean,
  // If `true` all descendants of the commons chunk are selected

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}
```
## webpackdemo中的 webpack.prod.conf.js解析
```js
// 分离所有来自node_modules中的js文件生成 vendor.js
// split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // node_modules内部的所有必需模块被提取到vendor
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 将webpack的 runtime 和 manifest 提取到该文件中，以防止更新应用程序包时更新vendor
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // 使用代码拆分功能，一个 chunk 的多个子 chunk 会有公共的依赖。为了防止重复，可以将这些公共模块移入父 chunk。这会减少总体的大小，但会对首次加载时间产生不良影响。
    // 此实例从代码拆分块中提取共享块，并将它们捆绑在单独的块中，类似于vendor块
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
```
## 动态导入
第一种，也是优先选择的方式是，使用符合 ECMAScript 提案 的 **import()** 语法。第二种，则是使用 webpack 特定的 **require.ensure**。
### 配置项 chunkFilename
> 该配置项决定了非入口chunk的名称
```js
output: {
  filename: '[name].bundle.js',
  chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  path: path.resolve(__dirname, 'dist')
}
```
### import()
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

# 懒加载
## 代码分离后懒加载举例
```js
// print.js
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
}
// index.js
button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
  var print = module.default;
  print();
});
```
*注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。*

## [在VUE项目中使用懒加载](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
* 组件懒加载
```js
Vue.component('AsyncCmp', () => import('./AsyncCmp'));
//  使用本地注册
new Vue({
  // ...
  components: {
    'AsyncCmp': () => import('./AsyncCmp'),
    // 如果组件导入使用命名导出，则可以在返回的Promise上使用对象解构。例如，对于来自KeenUI的UiAlert组件：
      UiAlert: () => import('keen-ui').then(({ UiAlert }) => UiAlert)
  }
})
```
通过将导入函数包装到一个箭头函数中，Vue将只在需要时执行它，在那一刻加载模块。  
* Vue-router 懒加载
```js
const Login = () => import('./login')

new VueRouter({
  routes: [
    { path: '/login', component: Login }
  ]
})
```
* Vuex Module 懒加载
Vuex有一个registerModule方法，允许我们动态创建Vuex模块。我们可以使用它来延迟加载模块：
```js
const store = new Vuex.Store()

...

// Assume there is a "login" module we wanna load
import('./store/login').then(loginModule => {
  store.registerModule('login', loginModule)
})
```

# [缓存](https://doc.webpack-china.org/guides/caching/)
## 输出文件的文件名(Output Filenames)
> 通过使用 output.filename 进行文件名替换，可以确保浏览器获取到修改后的文件。[hash] 替换可以用于在文件名中包含一个构建相关(build-specific)的 hash，但是更好的方式是使用 [chunkhash] 替换，在文件名中包含一个 chunk 相关(chunk-specific)的哈希。  
```js
output: {
-     filename: 'bundle.js',
+     filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
```
### 利用CommonsChunkPlugin分离进阶
利用CommonsChunkPlugin我们能够能够在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中。
具体实现参考上面代码分离。最后实现的效果是:
* main bundle 会随着自身的新增内容的修改，而发生变化。
* vendor bundle 会随着自身的 module.id 的修改，而发生变化。
* manifest bundle 会因为当前包含一个新模块的引用，而发生变化。
**我们不希望vendor的hash发生变化，所以我们可以使用2个插件来解决这个问题**
1.  NamedModulesPlugin  
将使用模块的路径，而不是数字标识符。
2. HashedModuleIdsPlugin(推荐用于生产环境构建)   
keep module.id stable when vender modules does not change