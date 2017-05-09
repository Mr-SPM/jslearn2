# 一、模块化基本介绍
## 模块化 angular.module(name,requires,config)
> name 新模块的名字 ，requires 该模块所依赖的模块集合（如果不指定该参数，则该方法的行为是去寻找name模块，而不是新建一个模块）， config 该模块的配置，通常不在第三参数进行配置，而是通过Module.config()方法  
**模块必须通过ng-app** 应用到html中 
## Module 对象成员方法
1. animation(name,factory) 支持动画
2. config(callback) 注册一个在该模块加载时对模块进行配置的函数
3. constant(key,value) 定义一个返回一个常量的服务
4. controller(name,constructor) 创建一个控制器
5. directive(name,factory) 创建一个指令
6. factory(name,provider) 创建一个服务
7. filter(name,factory) 创建一个进行数据格式化的过滤器
8. provider(name,type) 创建一个服务 
9. name 返回模块名称
10. run(callback) 注册一个在angularJs 加载完毕后用于对所有模块进行配置的函数
11. service(name,constructor) 创建一个服务
12. value(name,value) 定义一个返回一个常量的服务
> Module对象定义的方法返回的结果仍然是Module本身，使得能够使用*Fluent API*，进行多个方法调用
```js
var myApp =Angular.Module('MyApp',[]).controller('OneController',function($scope){
    console.log('模块1');
}).controller('TwoController',function($scope){
    console.log('模块2');
}).directive(...)
``` 
### 定义控制器 Module.controller(name,factory)
#### 依赖注入
> AngularJS 查找控制器中的参数，确定这是依赖于XXX组件，然后为其查找组件，并在控制器函数被调用时作为参数传递给工厂函数  
使用依赖注入的好处：Angular负责管理组件并在需要时提供给相应函数
1. 控制器应用于视图 ng-controller
### 定义指令 Module.directive(name,factory)
```js
myApp.directive('ExampleDirective',function(){
    // 工人函数
    return function(scope,element,attr){
        //... 
    }
})
```
> 当遇到HTML中的指令时AngularJS就会调用其中的工人函数   
element参数是一个jqLite对象

### 定义过滤取 Module.filter(name,factory)
```js
examApp.filter('StringFormat',function(){
    return function(str){
        if(str){
            return str.toString().substring(0,2);
        }
    }
})
```
1. 使用过滤器 
> 使用'|' 
```html
<p>{{'变成2个长度的字符串' | StringFormat}}</p>
```
> $filter  该服务允许访问我所有已定义的过滤器
```js
xxx.controller('xxController',function($filter){
    // 第一个括号内参数为filter名称
    $filter('StringFormat')('参数')
})
```
### 定义服务 service、factory、provider
#### Module.service()
```js
myApp.service('MyService',function(){
    // this 指代MyService实例对象
    // Angular代码在任何地方都可以通过该服务访问到本服务的属性和方法
    this.name = 'MyService';
    this.getName = function(){
        return this.name;
    };
    this.setName = function(value){
        this.name = value;
    }
})
myApp.controller('MyContorller',function($scope,MyService){
    // 即使controller定义在service之后，服务也会正常的被调用，并注入
})
```
#### Module.value()
> 用于创建返回固定值和对象的服务，意味着可以为任何值和服务使用依赖注入
```js
var now = new Data();
myApp.value('nowDate',now)
.service('DateService',function(now){
    this.getNow=function(){
        return now ;
    }
});
```

## **使用模块组织代码**
```js
angular.module('mainApp',['myApp']);
```
### 使用模块生命周期进行工作
1. Module.config()
    > 在当前模块被加载后调用  
    
    ```js
    mainApp.config(function(xxProvider,xxServiceProvider){
        
    })
    ```
2. Module.run()
    > 在所有模块被加载后调用

    ```js
    mainApp.run(function(){
        console.log('everything is be loaded! ')
    })
    ```

# 二、详细讲解
## 使用绑定和模版指令
2.1 使用数据绑定
* ng-bind 绑定一个元素的innerText属性
* ng-bind-html 使用一个元素的innerHTML属性创建数据绑定
* ng-bind-template 与ng-bind类似，但是允许在属性值中指定多个模版表达式
* ng-model 创建一个双向数据绑定
* ng-non-bindable 创建一个不会执行数据绑定的区域
> 使用指令，一般性建议将指令用做属性，因为较久版本的IE浏览器默认不支持自定义HTML元素

2.1.1  执行和禁止单向绑定
> ng-bind 指令受限于只能处理单个绑定数据表达式。如果需要创建多个数据绑定，就应该使用更加灵活的ng-bind-template
```html
<div ng-bind-template="First:{{todo[0]}}. Second:{{todo[1]}}"></div>
```
> 组织内联数据绑定 ng-non-bindable
```html
<!-- 如果这里没有ng-non-bindable AngularJS会试图绑定到名为data的模型属性 -->
<div ng-non-bindable>这里我不需要绑定数据{{data}}</div>
```

2.2 创建双向绑定 ng-model
```html 
<input type="text" ng-model="message" />
我输入的是{{ message}}
```
> 实际实现：当input元素的内容被修改时，AngularJS使用标准的JavaScript事件从input接受通知，并将这一变化通过$scope服务进行传播。

2.3 使用模版指令
* ng-cloak 使用一个CSS样式隐藏内敛绑定表达式，在文档第一次加载时会短暂地可见
* ng-include 向DOM中加载、处理和插入一段HTML
* ng-repeat 对数组或对象某个属性中的每个对象生成一个元素及其内容的若干新拷贝
* ng-repeat-start 表示含有多个顶层元素的重复区域的开始部分
* ng-repeat-end 表示含有多个顶层元素的重复区域的结束部分
* ng-switch 根据数据绑定的值修改DOM中的元素

2.4 重复生成元素 ng-repeat  
```html
<tr>
    <td ng-repeat="item in items">value :{{item.value}
    </td>
</tr>
```
2.4.1 重复操作对象
    
    * 可内嵌操作
    * 使用数据对象的键值进行工作 ( ng-repeat ="(key,value) in item")
    * 使用内置变量工作 1.$index  当前对象或属性的位置
                      2.$first,$middle,$last 集合中是否是第一，当中，最后
                      3.$even,$odd 集合中是否是奇/偶 
2.4.2 重复生成多个顶层元素
```html
    <table>
        <tbody>
            <tr ng-repeat-start="item in items">
                <td>this is item {{$index + 1}}</td>
            </tr>
            <tr>
                <td>The action is : {{item.action}}</td>
            </tr>
            <tr ng-repeat-end>
                <td>Item {{$index +1}} is {{$item.complete ? '' : 'not'}} complete</td>
            </tr>
        </tbody>
    </table>
```

2.4.3 使用局部视图工作 ng-include
> 该指令从服务器获取一段HTML片段，编译并处理其中包含的任何指令，并添加到DOM中去，这些片段被称为局部视图