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
ng-include 作为自定义元素使用时具备3个配置参数  
1.src  src='xxx.html' 注意使用单引号静态的定义一个文件，如果是"xxx",这样的话字符串会被当作JavaScript表达式进行计算，src设置可以通过计算得到  
2.onload  指定一个在内容被加载时调用计算的表达式  
3.autoscroll  指定在内容被加载时AngularJS是否应该滚动到这部分视图所在的区域  
**ng-include 也可作为属性使用**  

2.4.5 有条件地交换元素 ng-switch
```html
<div ng-switch on="item.key">
    <span ng-switch-when="one">one</span>
    <span ng-switch-default>default</span>
</div>
```

2.4.6 隐藏未处理的内联模版绑定表达式 ng-cloak 
> 解决方式：1. 坚持使用ng-bind  2.使用ng-cloak

## 使用元素与事件指令
2.5 使用元素指令
* ng-if  从DOM中添加或移除元素
* ng-class (ng-class-even/ng-class-odd)  
```html
<div ng-class = "{'className': true/false }"
```
* ng-hide/ng-show 在DOM中显示或隐藏元素
* ng-style 设置一个或多个CSS属性 
```html 
<div ng-style ="{'background-color':item.color}"></div>
```

2.6 处理事件
* ng-blur
* ng-change
* ng-click
* ng-copy/ng-cut/ng-paste
* ng-dbclick
* ng-focus
* ng-keydown/ng-keypress/ng-keyup
* ng-mousedown/mouseenter/mouseleave/mousemove/mouseover/mouseup
* ng-submit 
#### 创建自定义事件指令
```js
myApp.directive('myEventDirective',function(){
    return function(scope,element,attrs){
        // element是一个jqLite对象，下面的操作是使用jquery同名的on方法注册了touch事件处理函数
        element.on('touchstart touchend',function(){
            console.log('I have been touched !');
        })
    }
})
```

2.7 管理特殊属性  
2.7.1 管理布尔属性
> 例如 disabled 只要存在，不管属性有没有值，就可产生效果  
对此angular内置了一些布尔属性指令 1.ng-checked 2.ng-disabled 3. ng-open 4. ng-readonly 5. ng-selected  

2.7.2 管理特殊属性 
>ng-href    ng-src  
ng-srcset 在img上设置srcset属性，允许为显示不同大小和像素密度而指定多个图片，浏览器的支持很有限

# 三、使用表单
3.1 数据双向绑定 ng-model
> 除了显式的在作用域中设置属性，也可隐式地创建在html中使用ng-model绑定属性，当表单元素值改变时，该属性才会被创建。 （并不提倡这种方法）  
**angular.isDefined()** 可以检查属性是否被创建

3.2 校验表单
> 要想获得AngularJS的最佳校验效果，必须为表单元素设置一些属性，name属性，通过name属性的值可以访问变量值  
禁用浏览器所支持的校验并启用angular校验功能，需要在表单元素上增*novalidate* 属性
#### 表单指令所定义的校验变量和 如果符合则会加到的这个类
$pristine   ng-pristine 没有与元素/表单产生交互，返回true
$dirty  ng-dirty 产生过交互
$valid  ng-valid 校验通过
$invalid    ng-invalid 校验无效
$error  提供校验错误的详情信息

3.3 使用表单指令属性
#### input
* ng-model/ng-change/ng-minlength/ng-maxlength/ng-required
* ng-pattern 设置一个表达式，元素内容必须匹配该正则表达式
#### 复选框checkbox
* ng-model/ng-change
* ng-true-value / ng-false-value  指定当元素被勾选或取消勾选时所绑定的表达式的值
#### 文本区textarea
* 与input类似
#### 选择列表select
```html
    <!--标签 for 项目 in 数组-->
    <select ng-model='uiModel.selected' ng-options="item.value for item in items"> 
        <option value="">默认选项</options>
    </select>
    <!--所选属性 as 标签 for 项目 in 数组-->
    <select ng-model='uiModel.selected' ng-options="item.key as item.value for item in items">  
    </select>
    <!--创建选项组-->
    <select ng-model='uiModel.selected' ng-options="item.value group by item.type for item in items">  
    </select>
```

# 四、使用控制器和作用域
>控制器是通过AngularJs的Module对象所提供的controller方法创建出来的。controller方法的参数是新建控制器的名字和一个将被用于创建控制器的函数。这个函数应被理解为构造器，但是更愿意称其为工厂函数，因为创建AngularJS组建所需的许多方法调用通常都被表示为使用一个函数（工厂函数）创建另外一个函数（工人函数）  
工厂函数能够使用依赖注入特性来声明对AngularJS服务的依赖。
```js
// 定义一个简单的控制器
myApp.controller('myController',function($scope){
    $scope.value = '定义作用域属性';
    $scope.way = function(){
        console.log('定义作用域方法');
    }
    $scope.broadcast =function(){
        $scope.$emit('tellFather',[{key:'告诉爸爸'}]);
        $scope.$broadcast('tellChildren',[{key:'告诉儿子们'}]);
    }
    // 一个事件监听
    $scope.$on('FireEvent',function(event,args){
        console.log('监测到了FireEvent！');
    })
});
```
```html
<div ng-controller = "myController">视图1</div>
<!--控制器复用-->
<div ng-controller = "myController">视图2</div>
```
4.1 作用域之间的通信
![通信图](images/4_1.png)
* $broadcast(name,args) 向当前作用域下的所有子作用域发送一个事件。
* $emit(name,args) 向当前作用域的父作用域发送一个事件，直至跟作用域
* $on(name,handler) 注册一个事件处理函数，在函数在特定的事件被当前作用域收到时将会被调用

4.2 使用服务调解作用域事件
> AngularJS中的习惯是使用服务来调解作用域之间的通信
```js
myApp.service('broadcastService',function($rootScope){
    this.setMessage:function(message){
        $rootScope.$broadcast('messageEvent',message);
    }
})
```

4.3 使用控制器继承
4.4 使用多控制器 **对应用中的每一个主要视图都创建一个新的控制器**

## 显示的更新作用域
* $apply(expression)    向作用域应用变化
* $watch(expression,handler)    注册一个处理函数，当expression表达式所引用的值变化时，触发handler    
* $watchCollection(object,handler)  当指定的object对象的任一属性变化时，触发handler


# 五、使用过滤器
5.1 内置过滤器
5.1.1 过滤单个数据的值
* currency 后面添加了一个冒号，然后添加一个字符串表示想替换成的符号
```html
{{price | currency:"￥"}}
```
* date
```html
{{now | date:'yyyy/MM/dd HH:mm:ss'}}
```
* json
* number number过滤器会自动在千分位处插入逗号
```html
{{price | number:2}}
```
* uppercase/lowercase

5.1.2 过滤集合
* limitTo 限制项目数量 冒号后面可以是固定值也可以是scope属性,如果值是负数，则会从数组倒序取值，不必担心数组越界
```html
    <li ng-repeat="item in items | limitTo:5/limitVal">item.value</li>
```
* filter 选取项，用于从数组中选取一些对象，选取条件可以指定为一个表达式，或者一个用于匹配属性值的map对象，或者一个函数。
```html
    <li ng-repeat="item in items | filter:{key:'type'}">item.value</li>
```
* orderBy 对项目排序。 + - 对应正序倒序
```html
    <li ng-repeat="item in items | orderBy:'-value'">item.value</li>
```
```js
 // 函数排序
 $scope.myOrderBy = function(item){
     // item.xx小于5的会默认排在最前端
     return item.xx < 5 ? 0: item.price;
 }
```

5.1.3 链式过滤器
```html
<li ng-repeat="item in items | orderBy:'-value' | limitTo: 5">item.value</li>
```

**5.2 创建自定义过滤器**
> 过滤器是由Module.filter方法创建的，该方法接收2个参数：待创建的过滤器名称和一个工厂函数，用于创建执行实际工作的工人函数。
```js 
myApp.filter('myFilter',function(){
    return function(value){
        return '过滤：' +value ;
    }
})
```
5.2.1 创建过滤器集合
```js
myApp.filter(...)
.filter(...)
```
**5.3 $filter**
```js
var myfilter = $filter('filterName');
myfilter(data,args...);
```

# 六、创建自定义指令
6.1 定义指令
> 使用Module.directive来创建指令，参数是新指令的名称和一个用于创建指令的工厂函数
```js
myApp.directive('myDirective',function(){
    return function(scope,element,attrs){
        // ...
    }
})
```
6.2 定义复杂指令
* compile 指定一个编译函数
* controller 为指令创建一个控制器函数
* link  为指令制定一个链接函数
* replace 指定模版内容是否替换指令所应用到的元素
* require 声明对某个控制器的以来
* restrict 指定指令如何被使用
* scope 为指令创建一个新的作用域或者一个隔离的作用域
* template 指定一个将被插入到HTML文档的模版
* templateUrl 指定一个将被插入到HTML文档的外部模版
* transclude 指定指令是否被用于包含任意内容
6.2.1 从作用域获取数据
