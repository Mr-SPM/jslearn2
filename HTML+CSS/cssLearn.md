# CSS学习
1. 选择器
+ id 选择器
```
<div id='test' >id 选择器 </div>
#test {font-size:18px;}
```
+ class 选择器
```
<div class='test' >class 选择器 </div>
.test {font-size:18px;}
或者  指定特定的HTML元素使用class
div..test {font-size:18px;}
```
2. background 简写属性数学
```
background-color  
background-image
background-repeat
background-attachment  控制浮动
background-position
```

使用sass或scss语法配置
安装sass依赖sass-loader和node-sass：

npm i sass-loader node-sass -D
安装之后，可能会出现node-sass安装失败的情况，原因和解决办法可以参考这里，可以通过在命令行直接运行下面的命令来解决：

SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass
然后在webpack.base.conf.js中添加相关配置：

{
    test: /\.s[a|c]ss$/,
    loader: 'style!css!sass'
}