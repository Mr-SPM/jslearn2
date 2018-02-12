#nodejs 处理 excel

1. 安装 node-xlsx 模块

```js
const xlsx = require('node-xlsx');
const fs = require('fs');
```

2. parse(path)读取文件

```js
// 读写excel
let buffer = xlsx.parse(filePath);
```

3. build()构筑要写入文件

```js
var target = xlsx.build([
  {
    name: 'sheet1',
    data: buffer[0].data
  }
]);
```

4. 利用 fs 模块，写入文件内

```js
fs.writeFileSync(filePath, target);
```
