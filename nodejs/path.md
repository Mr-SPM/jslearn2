# 通过path模块操作文档目录
1. 安装
```js
const path  = require('path');
import path from 'path';
```
2. 方法示例
- path.join([...paths])  
  path.join() 方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径。长度为零的 path 片段会被忽略。 如果连接后的路径字符串是一个长度为零的字符串，则返回 。'.'表示当前工作目录，'..'表示上级目录
3. 解决问题
    - 目录跳转问题
```js
// 依靠nodejs自带属性 __dirname（获取当前文件目录）+ path.join()
let fileName = path.join(__dirname,'../target');
```