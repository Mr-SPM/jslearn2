# 脏值检测对比 VirtualDOM

## angluar 脏值监测（digest 和 $apply）

当页面引用 angular 后，angularjs 会扩展标准的浏览器流程（比如在浏览器上某个 div 标签上面增加 click 事件回调），创建一个 angular 上下文（即运行在 angular 事件循环内的特定代码），这样的事件循环通常就叫做**$digest 循环**。  
该循环主要有 2 部分组成：

* $watch 列表
* $evalAsync 列表

## $watch 列表

> 当我们在视图上面的某个字段绑定给了$scope 的某个属性，为了更新视图，angular 需要追踪这个变化

```html
<input type="text" ng-model="name">
<p>{{name}}</p>
```

如何追踪这个变化，就是通过在$watch 列表中增加一个监控回调函数去实现的。注意：

1.  $scope 对象上的属性只会在其被用于视图时绑定。
2.  对于所有绑定给同一个$scope 对象的 UI 元素，只会添加一个$watch 到函数列表中。
3.  这些$watch 列表会在$digest 循环中通过“赃值检查”的程序解析

## 赃值检查

Angular 应用持续监测当前的值。angular 会遍历$watch 列表，如果值没有变化，则会继续遍历，而如果发生了变化，该应用会启用新的值并继续遍历$watch 列表。遍历完成后，**只要有任何的值发生变化，那么 angular 会再次进行一次$watch 循环，直到检测不到数值的变化。**

### 为什么再次进行循环遍历？（性能痛点）

因为当$scope 中的某个值而存在另一个值会根据该值进行更新，angluar 将检测不到这个更新，除非再次循环。

> 如果这个循环运行 10 次或者更多次，那么 angular 就会抛出一个异常，同时停止运行。因为如果不抛出异常，应用就有可能陷入无限循环当中。在未来的 Angular 中，这个框架会使用原生的浏览器规范的[Object.observe()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/observe)，这将大大加速脏值检测的过程。然而 Object.observe()这个方法已逐渐被各大浏览器废弃。

```
// 模拟脏值检测的过程
1. 进入$digest循环
2. 检测某属性（举例：email）是否是脏值isDirty true or false
3. 如果是true，更新该值，重新进入$digest循环。直到Dirty === false
4. 浏览器DOM重绘
```

### $watch

$scope 对象上的$watch 方法会给 angular 事件循环内的每个$digest 调用装配一个赃值检查。如果在表达式上检测到变化，angular 总是返回$digest 循环。  
$watch 函数本身接受 2 个必要参数和一个可选参数

* watchExpression 可以是一个作用域对象的属性，也可以是一个返回作用域对象的函数
* listner/callback 作为回调的监听器函数，他只会在 wacthExpression 的当前值与先前值不等时调用
* objectEquality（可选） 是一个进行比较的布尔值，是否严格相等。

> 注意： $watch 函数会给监听器返回一个注销函数。可以手动调用来取消该监控。  
> 监听函数会在初始化时被调用一次，而此时 newVal 和 oldVal 的值都是 undefined（并且是相等的）。所以$watch 函数可以像下面那样实现

```js
$scope.$watch('watchExpression', function(newVal, oldVal, scope) {
  if (newVal === oldVal) {
    // 初始化执行
  } else {
    // 之后发生变化执行
  }
});
```

### $watchCollection

此外，angular 还允许我们为对象的属性或者数组的元素设置浅监控。只要属性发生变化就触发监听器回调。  
使用$watchCollection 还可以检测对象或者数组合适发生了变化，以便确定对象或者数组中的条目是何时添加、移除或者移动的。它与$digest 循环中标准的$wacth 的行为一样，我们甚至可以把他当作标准的$watch
$watchCollection()接受 2 个参数

* obj 这个对象就是要监控的对象，如果传入字符串，它将被当作 angular 表达式求值。
* listner

```js
$scope.$watchCollection('names', function(newNames, oldNames, scope) {
  // 集合发生变化
});
```

> 该函数同样会返回注销函数.

### 页面中的$digest 循环

当在视图中绑定（已 ng-model 举例）了一个$scope 属性后，angular 会**设置一个隐式的监控器**。当用户输入一个字符到表单后，angular 上下文就会生效并开始遍历**$$watchers**($watch 列表)

### $evalAsync 列表

$evalAsync()方法是一种在当前作用域上调度表达式在未来某个时刻运行的方式。$digest
循环运行的第二个操作是执行$$asyncQueue。可以使用$evalAsync()方法访问这个工作队列。  
$digest 循环期间，贯穿脏值检查生命周期的每个循环之间的队列都是空的，这意味着使用
$evalAsync 来调用任何函数都会发生两件事情。

* 函数会在这个方法被调用的某个时刻之后执行。
* 表达式求值之后，至少会执行一次$digest 循环

$evalAsync()方法接受一个唯一参数

* expression 字符串/函数

这个表达式便是我们想要在当前作用域上执行的东西。

```js
$scope.$evalAsync('attribute', function(scope) {
  scope.foo = 'Executed';
});
```
> 注意： 指令直接调用$evalAsync(),他会在angular操作DOM之后，浏览器渲染之前运行。
控制器调用$evalAsync()，它也会在Angular操作DOM之后、浏览器渲染之前运行（永
远不要使用$evalAsync()来约定事件的顺序）。  
所以，在angular中，只要你想要在一个行为的执行上下文外部执行另一个行为，那么就应该使用$evalAsync()函数。  

### $apply
$apply()函数可以从Angular框架的外部让表达式在Angular上下文内部执行。例如，假设你
实现了一个setTimeout()或者使用第三方库并且想让事件运行在Angular上下文内部时，就必须
使用$apply()。  
$apply()函数接受一个可选的参数：
* expression 字符串/函数

> 注意：$apply 会直接调用$digest循环。

### 何时使用$apply
通常依赖于angular提供的可用于视图的任意指令来调用$apply()，比如所有的ng-[event]都会调用$apply()。此外一些内部服务也会调用，比如$http服务会在XHR请求触发更新返回值之后调用$apply。
而在我们使用第三方框架比如jQuery,datePicker，或者调用setTimeout()的时候都可以使用$apply()让Angular返回$digest循环。  


# VirtualDOM 设计原理
组成部分
* Vtree和DOM
* Vtree和DOM的映射
* DIFF函数
* PATCH处理方法

Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。可以类比 CPU 和硬盘，既然硬盘这么慢，我们就在它们之间加个缓存：既然 DOM 这么慢，我们就在它们 JS 和 DOM 之间加个缓存。CPU（JS）只操作内存（Virtual DOM），最后的时候再把变更写入硬盘（DOM）。

## 对比2棵树的差异
virtual DOM 只会对同一个层级的元素进行对比，所以复杂度就是O(n)。
深度优先遍历
参考:https://www.zhihu.com/question/29504639