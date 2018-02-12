# Babel是一个JavaScript编译器
> Babel 通过语法转换器支持最新版本的 JavaScript 。这些插件允许你立刻使用新语法，无需等待浏览器支持。  
从宏观角度看，它将运行代码分为3个阶段: 解析，转换，及生成(与其他编译器相同)。   
初始阶段，Babel 并没有做任何事情。它基本上就相当于 const babel = code => code;，先解析代码，然后再次生成相同的代码。  
你可以为 Babel 添加一些插件让其去做任何事情(插件会影响 Babel 的第 2 阶段，转换)。
## 插件
1. Presets   
### Official Presets 公用插件  
- **env** 根据你支持的环境自动决定适合你的 Babel 插件的 Babel preset。它使用了 compat-table。
    1. 安装  
```shell
npm install --save-dev babel-preset-env
```
    2. 使用,没有选项的默认行为讲运行所有transform
```json
{
  "presets": ["env"]
}
```
    3. 选项
        - targets 支持一个运行环境的对象
        - targets.node 如果需要编译当前node版本
        - targets.browsers 指定浏览器
        - spec 对在这个 preset 中支持它们的插件启用更符合规范，但可能较慢的方式。
        - loose 允许它们为这个 preset 的任何插件启用”loose” 转换。
        - modules 启用将ES6模块语法转换为另一种模块类型。"amd" | "umd" | "systemjs" | "commonjs" | false， 默认为 "commonjs".
        - debug 将使用的目标浏览器/插件和在 数据插件版本 中指定的版本用 console.log 输出。
        - include 总是包含的一系列插件
        - exclude 总是移除的数组插件
        - useBuiltIns 一种将polyfill应用于 babel-preset-env 中的方法 (通过 “babel-polyfill”)。
#### 举例
```json
{
  "presets": [
    ["env", {
      "targets": {
        "chrome": 52,
        "browsers": ["last 2 versions", "safari 7"]
      },
      "modules": false,
      "loose": true,
      "debug": true,
      "include": ["transform-es2015-arrow-functions", "es6.map"],
      "exclude": ["transform-regenerator", "es6.set"]
    }]
  ]
}
```
### State-X 实验阶段Presets  
- Stage 0 稻草人
- Stage 1 提案
- Stage 2 初稿
- Stage 3 候选
- Stage 4 完成  
推荐使用 stage-2 Presets 
2. 转译 Plugin  
转译 plugin 将启用相应的语法 plugin ，因此你不必同时使用两者。
### runtime 插件 避免全局污染
>Externalise references to helpers and builtins, automatically polyfilling your code without polluting globals(外部引用helpers和内置函数，自动填充代码而不会污染全局)  
   * WHY  
Babel对常用的函数使用非常小的辅助（内置的垫片比较少），例如_extend。默认情况下它将会添加到每个引用的文件。这种重复有时候是非常没必要的。特别是你的应用分散在很多文件中。  
这是transform-runtime插件之所以产生的原因：所有的这些辅助（垫片）将会引用babel-runtime来避免编译时重复。runtime将会编译到你的build中。  
另一个目的是，这个转换器为你的代码创建了一个沙盒环境。如果你使用babel-polyfill并且把它内置提供promise,set,map这样的对象或功能，他们将会污染全局环境。也许在一个应用中或者命令行工具中没问题，但是如果你的代码是个库，你想发布给其他人使用，因为使用的人可能在各种各样的执行环境中，所以可能导致错误，不能执行。  
转换器transformer会将这些内置（垫片）设置别名到core-js中，因此你可以不使用require来无缝的使用（垫片中的对象和方法）。
  * 选项  
    - helpers 是否将内联的Babel帮助器（classCallCheck，extends等）替换为对moduleName的调用，默认为true
    - polyfill 是否将新的内置（Promise，Set，Map等）转换为使用非全局污染的polyfill。默认为true
    - regenerator 是否将生成器函数转换为使用不会污染全局作用域的再生器运行时。 默认为true
    - moduleName 设置导入helpers时使用的模块的名称/路径。默认"babel-runtime"
    ```js
    import extends from 'babel-runtime/helpers/extends';
    ```
总的来说，你可以使用内置的一些东西例如Promise,Set,Symbol等，就像使用无缝的使用polyfill,来使用babel 特性，并且无全局污染、极高代码库适用性。

3. 混合 Plugin
### external-helpers 外部 helpers
> Babel 有一些 helper 函数，如果需要的话，它将被放置在生成的代码的顶部，所以在整个文件中不会内联多次。如果你有多个文件，这可能会成为一个问题，特别是把文件发送到浏览器。gzip 缓解了大部分问题，但仍然不理想。  
你可以告诉 Babel 不要在你的文件的顶部放置任何声明，相反只需在外部 helper 中引用他们。  
#### 获取外部Helpers
* 你需要使用 babel-cli 来构建 helpers. 
```
npm install babel-cli --save-dev
```
* 使用下列语句来输出这个文件
```js
// option 
// global(node) 
// umd(用UMD封装helpers用以兼容浏览器，CommonJS和AMD) 
// var 输出变量babelHelpers(var babelHelpers = {}),helpers被赋值给他，这种输出格式适合进一步的处理。 
./node_modules/.bin/babel-external-helpers [options] > helpers.js
```
#### 注入外部helpers
- node
```js
require("babel-core").buildExternalHelpers();
```
- 浏览器
```html
<script type="application/javascript" src="your-path-to/babel/external-helpers.js"></script>
```
```
npm install --save-dev babel-plugin-external-helpers
```
4. 语法 Plugin
这些 plugin 允许 Babel 解析特定类型的语法(不转译)。
5. [开发Plugin](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)