# 词法结构
1. 保留字
# 类型、值和变量
> JavaScript 的数据类型分为两类
 1. 原始类型（primitive type)[数字，字符串，布尔值] **不可变**
 2. 对象类型（object type） **可变**   特殊对象：数组Array ， 函数 Function , 三种有用的类：日期 Date，正则 RegExp ， 错误 Error
 3. 特殊原始值 （null , undefined）
> JavaScript 采用词法作用域（lexical scope）,不在函数中声明的变量称作全局变量（global variable），在函数中声明的变量具有函数作用域（function scope），并且只在函数内可见
## 数字
> JavaScript不区分整数值和浮点数值，所有数字均用浮点数值表示  
十进制，十六进制（0x）
> 传统算数运算符 ： +，-，*，/，%
```
// 遍历math 类所有方法
Object.getOwnPropertyNames(Math)
// 特殊
console.log(0/0) //NaN
```
> 二进制浮点数和四舍五入：**尽量使用整数表示**
## 原始类型
> 字符串、数字和布尔值的属性都是只读的，并且不能给他们定义新属性
``` js
// 原始类型添加属性
var str='test';
str.temp = 't';
vat t = str.temp; // t undefind, str.temp = undefind
```
> 包装对象和直接量的区别
``` js
var num1 = 1;
var num2 = new Number(1);
num1 == num2 //true
num1 === num2 //false
```
##　全局对象
> 通常将对象称为引用类型（reference type），对象值都是引用，对象的比较是引用的比较，当且仅当他们引用同一个基对象时，才相等
## 类型转换
### 显示类型转换
``` 最简单方法
Number('3')   // 3
String(false)  // 'false'
Boolean([])  // true
Object(3)  // new Number(3)
```
## 函数作用域
> 花括号内的每一段代码都具有各自的作用域，而且变量在声明他们的代码段之外是不可见的，成为块级作用域（block scope） JavaScript 没有块级作用域，取而代之使用函数作用域（function scope）
# 声明提前（hoisting）
> JavaScript函数里声明的所有变量（但不涉及赋值）都被“提前”至函数体的顶部。
# 作为属性的变量
> 通过var 声明一个变量时，创建的属性是不可配置的，无法通过 delete 运算符删除。  
在非严格模式中给一个未声明的变量赋值会自动创建一个全局变量，并且是可配置的。
# 作用域链
> 
1. 在JavaScript的最顶层代码中，作用域链由一个全局对象组成。
2. 在不包含嵌套函数的函数体内，作用域链上有2个对象，第一个是定义函数参数和局部变量的对象，第二个是全局对象。
3. 在一个嵌套函数体内，作用域链上至少有三个对象。

# 表达式和运算符
##　原始表达式
> 包含 常量或直接量、关键字和变量
## 调用表达式
> 严格模式定义的函数在调用时将使用undefined作为this的值，而非严格模式将指向window
## 严格相等运算符
>
1. 两个值都是null或者都是undefined，则他们不相等（实际chrome 测试恰恰相反）
2. NaN 和任何值都不相等，包括他自身
3. 两个引用值指向同一个对象、数组、函数，则他们相等。如果指向不同的对象，则他们是不等的，尽管两个对象具有完全一样的属性

## eval()
> **严格模式下，执行代码段只可查询或局部变量，但不能在局部作用域中定义新的变量或函数**  
1个参数 ，如果传入的参数不是字符串，他直接返回这个参数。如果是字符串，他会把字符串当成JavaScript代码进行编译（parse），如果编译失败则抛出一个语法错误（SyntaxError）异常。如果编译成功，则开始执行这段代码，并返回字符串中最后一个表达式或语句的值。

# 语句
##　声明语句
> var , function
## for/in 语句
> 目的：更方便的遍历对象属性成员，也可枚举数组索引
## 标签语句
identifier :statement 
通过给语句定义标签，就可以在程序的任何地方通过标签名引用这条语句。

# 对象
## 属性特性（property attribute）
1. 可写（writable）
2. 可枚举（enumerable）
3. 可配置（configurable） 
``` js
// 获取属性特性描述
Object.getOwnPropertyDescriptor(o,'data_prop');
//定义属性特性
Object.defineProperty(o,'pi',{
    writable:false,
    configurable:false,
    enumerable:false,
    value:3.14
});
// 定义多个属性,默认值是false或 undefined
Object.defineProperties({}, {
    height: {
        value: 10,
        writable:true
    },
    width: {
        value: 5
    },
    pi: {
        value: 3.14,
        writable: false
    },
    area: {
        get: function () {
            return this.height * this.width;
        },
        enumerable: false,
        configurable: false
    }
})
```
## 对象可拓展性
``` js
//可拓展性检测
Object.isExtensible(o);
// 设置为不可拓展
Object.preventExtensions(o);
//设置为不可拓展，并且将所有自有属性都设置为不可配置的
Object.seal(o);
//冻结  +全部设置为只读
Object.freeze(o);
```
## 对象直接量
> ES5（以及ES3的一些实现）中，保留字可以用做不带引号的属性名  
> ES3中使用保留字作为属性名必须使用引号引起来。 
**最后一个属性后的逗号将忽略，IE中则报错**
## 检测属性
``` js
var obj = {x:1}
// 区分存在的属性和存在但值为undefined的属性
'toString' in obj //true 
// 检测是自有属性
obj.hasOwnProperty('x')  //true
// 自由且可枚举
obj.propertyIsEnumerable('x') //true
// ES新增 
// Object.keys()   返回可枚举的自有属性的名称数组
// Object.hasOwnPropertyNames()  返回所有自有属性的名称
```
## getter 和 setter
> 由getter 和 setter “定义的属性称做存取器属性” ，不具有可写性。
``` js
var o = {
    // 普通数据属性
    data_prop: 1,
    // 存取器属性都是成堆定义的函数
    get accessor_prop() {
        return this.data_prop;
    },
    set accessor_prop(value) {
        this.data_prop = '新' + value;
    }
}
```
> 注意在这段代码中getter 和setter 里this 关键字的用法。JavaScript 把这些函数当作对象的方法来调用。this 指向表示这个点的对象。  
> **存取器属性是可以继承的**

## 序列化对象
```
//对象序列化
JSON.stringify(o);
JSON.parse('{"x":1}');
```

# 数组
> 如果算法依赖于遍历的顺序，最好不要使用for/in而用常规的for循环
``` 数组方法遍历
Object.getOwnPropertyNames(Array.prototype)
```
> ES5 新增数组方法  
> forEach,map,filter,every,some,reduce,reduceRight,indexOf,lastIndexOf
## 数组类型
ES 新增方法:
```
var newArray=[];
Array.isArray(newArray); // true
```

# 函数
> 函数声明语句并非真正的语句，ECMAScript规范只是允许他们作为定级语句。他们可以出现在全局代码里，或者内嵌在其他函数中，但他们不能出现在循环、条件判断，或者try/catch/finally以及with 语句中。而函数定义表达式可以出现在任何地方。
## 函数调用
- 作为函数
- 作为方法
- 作为构造函数
- 通过call() 和apply() 方法间接调用
## this 
> this 是一个关键字，不是变量，也不是属性名。JavaScript 的语法不允许给this 赋值。  
> this 没有作用域限制，嵌套的函数不会从调用它的函数中继承this。如果嵌套函数作为方法调用，其this的值指向调用他的对象。如果嵌套函数作为函数调用，其this值不是全局对象（非严格模式）就是undefined（严格模式下）。  
> 如果想访问这个外部函数的this 值，需要将this 的值保存在一个变量里。
```
// 嵌套函数调用外部函数this eg
var o = {
    m: function () {
        var self = this;
        console.log(this === o);  //true
        f();

        function f() {
            console.log(this === o); //false
            console.log(self === o); // true
        }
    }
}
o.m();
```
## 构造函数调用
> 没有形参的构造函数调用都可以省略圆括号  new Object === new Object()
## 可变长的实参列表
> 当调用函数的时候传入的实参个数超过了函数定义时形参个数时，没有办法直接获得未命名值的引用。参数对象可以解决这个问题。在函数体内，标识符**arguments**是指向实参对象的引用，实参对象是一个类数组对象，可以通过数字下标访问传入函数的实参值。*这种函数也称为（不定实参函数）*
```
// 实参和形参不匹配情况
function f(x) {
    if (arguments.length == 1) {
        return true;
    } else {
        for (let i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
}
```
> 非严格模式中，修改arguments 会影响到实参对象 ，而严格模式中，他变成了一个保留字。严格模式中的函数无法使用arguments作为形参名或局部变量名，也不能给arguments 赋值。

## callee 和 caller 属性
> 严格模式中，对这两个属性的读写操作会产生一个类型错误。    
> 非严格模式中，callee 属性指代当前正在执行的函数。caller是非标准的，指代调用当前正在执行的函数的函数  *在一个函数调用另一个函数时，被调用函数会自动生成一个caller属性，指向调用它的函数对象。如果该函数当前未被调用，或并非被其他函数调用，则caller为null*  
## 闭包
``` 
// 闭包
function counter() {
    var n = 0;
    return {
        count: function () {
            return n++;
        }
        reset: function () {
            n = 0;
        }
    };
}
var c = counter();
var d = counter();
c.count();   // 0
d.count();  // 0
c.reset();  
c.count();  // 0
d.count();  // 1
// 每次调用counter() 都会创建一个新的作用域链和一个新的私有变量。
```
## bind()方法 （将函数绑定至某个对象）
```
function f(y) {
    return this.x + y;
}
var o = {
    x: 1
};
var g = f.bind(o);     // 调用g()来调用o.f()
g(2); // 3
// '柯里化'
var sum = function(x,y){
    return  x+y;
}
var succ= sum.bind(null,1);   //把1绑定到x
succ(2);    // 传入2作为实参y
function f(y,z) {
    return this.x + y + z;
}
var g = f.bind({x:1},2) // 绑定this 和y
g(3) // 6
```

# BOM
## window对象