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

## CSS组合选择符
- 后代选取器(以空格分隔)  
  
- 子元素选择器(以">"分隔）  
  选择直接子元素，孙子就不行。
- 相邻兄弟选择器（以"+"分隔）  
  选择紧接在另一元素后的元素，且二者有相同父元素。  
  适用范围：在子元素之间增加属性（间隔、border）等。
- 普通兄弟选择器（以"~"分隔）  
  选取所有指定元素之后的相邻兄弟元素

# SASS配置
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