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
