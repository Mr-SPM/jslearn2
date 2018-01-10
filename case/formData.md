# FormData
>XMLHttpRequest Level 2添加了一个新的接口FormData.利用FormData对象,我们可以通过JavaScript用一些键值对来**模拟一系列表单控件**,我们还可以使用XMLHttpRequest的send()方法来异步的提交这个"表单".比起普通的ajax,使用FormData的最大优点就是我们可以**异步上传一个二进制文件**.[参考链接MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData "MDN WebApi FormData")
---
# 简要
## 构造
```js
var formData = new FormData();
```
## 方法
1. append
2. delete
3. entries
4. get
5. getAll
6. has
7. keys
8. set
9. values
---