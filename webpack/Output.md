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