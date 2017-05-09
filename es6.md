# 标题

## 二级标题

###   12312312312

>神说要有光
* 编号
* 123

代码
```js
var a= 1;
```
[链接](http://www.baidu.com)
![图片]()

## 数组的扩展
* Array.from() 将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）。
```js
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};
let arr = Array.from(arrayLike);
Array.from({length: 3}) // [undefined, undefined, undefined]
```
* Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。
```js
Array.from(arrayLike,x => x+x);
// 等同于
Array.from(arrayLike).map(x => x+x);
```
* Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种Unicode字符，可以避免JavaScript将大于\uFFFF的Unicode字符，算作两个字符的bug。

## Array.of()
* Array.of方法用于将一组值，转换为数组。这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```
* 数组实例的copyWithin()

它接受三个参数。
target（必需）：从该位置开始替换数据。
start（可选）：从该位置开始读取数据，默认为0。如果为负值，表示倒数。
end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
```js
Array.prototype.copyWithin(target, start = 0, end = this.length)
[1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]
```
