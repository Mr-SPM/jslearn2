// 遍历math 类所有方法
Object.getOwnPropertyNames(Math)
// 原始类型添加属性
var str = 'test';
str.temp = 't';
vat t = str.temp; // t undefind, str.temp = undefind
var num1 = 1;
var num2 = new Number(1);
num1 == num2 //true
num1 === num2 //false

var obj = {
    x: 1
}
// 区分存在的属性和存在但值为undefined的属性
'toString' in obj //true 
// 检测是自有属性
obj.hasOwnProperty('x') //true
// 自由且可枚举
obj.propertyIsEnumerable('x') //true
// ES新增 
// Object.keys()   返回可枚举的自有属性的名称数组
// Object.hasOwnPropertyNames()  返回所有自有属性的名称

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
Object.getOwnPropertyDescriptor(o, 'data_prop');
//定义属性特性
Object.defineProperty(o, 'pi', {
    writable: false,
    configurable: false,
    enumerable: false,
    value: 3.14
});
// 定义多个属性
Object.defineProperties({}, {
    height: {
        value: 10,
        writable: true
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
});
//可拓展性检测
Object.isExtensible(o);
// 设置为不可拓展
Object.preventExtensions(o);
//设置为不可拓展，并且将所有自有属性都设置为不可配置的
Object.seal(o);
//冻结  +全部设置为只读
Object.freeze(o);

//对象序列化
JSON.stringify(o);
JSON.parse('{"x":1}');

Object.getOwnPropertyNames(Array.prototype);
var newArray = [];
Array.isArray(newArray); // true
// ES3 实现方法
var isArray = Function.isArray || function (o) {
    return typeof o === 'object' &&
        Object.prototype.toString.call(o) === '[object Array]'
}

// 嵌套函数调用外部函数this eg
var o = {
    m: function () {
        var self = this;
        console.log(this === o); //true
        f();

        function f() {
            console.log(this === o); //false
            console.log(self === o); // true
        }
    }
}
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
// 闭包
function counter() {
    var n = 0;
    return {
        count: function () {
            return n++;
        },
        reset: function () {
            n = 0;
        }
    };
}
var c = counter();
var d = counter();
c.count(); // 0
d.count(); // 0
c.reset();
c.count(); // 0
d.count(); // 1
// 每次调用counter() 都会创建一个新的作用域链和一个新的私有变量。

// bind

function f(y) {
    return this.x + y;
}
var o = {
    x: 1
};
var g = f.bind(o);   // 调用g()来调用o.f()
g(2); // 3

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