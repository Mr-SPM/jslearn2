# KOA 框架

## 利用 koa-router 分层。实现后台模块区分

1. koa-router 安装,实例化

```js
var Router = require('koa-router');
// 实例化，划重点，prefix用做接口前缀，作为代码分层
let rt = new Router({
  prefix: '/prefix'
});
```

2. 代码分层  
   1-- index.js 主入口
   1-- app  
   2--- controller  
   3---- user.js 实际定义功能的模块  
   2--- users.js 该文件作为衔接接口和实际方法定义之间的 map 文件
3. 层次分工介绍

```js
// index.js 主入口
const Koa = require('koa');
const app = new Koa();
// 获取分模块router
const users = require('./app/users.js');
app.use(users.routes());

// users.js
var Router = require('koa-router');
var koaBody = require('koa-body'); // 敲黑板：用于接受post,json等数据
const ft = require('./controller/user.js');
// import ft from './controller/user.js';
let rt = new Router({
  prefix: '/user'
});
rt.post('/update', koaBody(), ft.update);
rt.get('user', ft.userInfo);
// 输出
module.exports = rt;
// user.js
const update = ctx => {
  //todo
};
const userInfo = ctx => {
  //todo
};
module.exports = { update, userInfo };
```

## 静态文件处理 koa-static
```js
const serve = require('koa-static');
const staticFiles = serve(path.join(__dirname));
app.use(staticFiles);
```

## 异常处理
一般来说处理错误的请求会选择将页面重定向到指定的error页面，如果对每个模块都写一个try-catch块，这样会比较麻烦，所以选择在最外层的中间件负责所有中间件的处理。
```js
// 异常handler
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    ctx.response.status = 404;
    ctx.response.redirect('/error.html');
  }
};
app.use(handler);
```
### todo
后端做异常处理会往往会记录本次出错log。这个后续补充。