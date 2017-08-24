# 引入jQuery   
1. npm install jquery --save-dev 引入jQuery 
2. 在 *[webpack.base.conf.js](http://webpack.base.conf.js/)* 配置加入
```js
 var webpack=require('webpack');
```
2.1 在module.exports的里面加入
```js
plugins: [ new [webpack.optimize.CommonsChunkPlugin('common.js'),](http://webpack.optimize.commonschunkplugin%28%27common.js%27%29%2C/) 
new webpack.ProvidePlugin(
{ jQuery: "jquery",
 $: "jquery" })
]
```
3. 引入jQuery规则（import $ form 'jquery'）

# 引入bootstrap
1. npm install bootstrap --save
2. 主入口js中引入 
```js
import 'bootstrap/dist/css/bootstrap.css'
```
### bootstrap内涵字体文件，css，等文件，所以需要安装各类loader（style-loader，css-loader,url-loader）