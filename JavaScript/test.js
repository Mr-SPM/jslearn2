function toggleMouseArea(moduleName) {
    let area = document.getElementById(moduleName);
    if (area.style.display === 'none') {
        area.style.display = '';
    } else {
        area.style.display = 'none';
    }
}
var base = {
    // 组建化继承
    extendClass: function (father, obj) {
        if (father == null && obj == null) {
            return false;
        }

        if (father.constructor == Function && obj.constructor == Object) {
            for (item in obj) {
                father.prototype[item] = obj[item];
            }
            father.thisClass = father.prototype;
        }
    },
    extendObj: function (base, extend) {
        if (base == null && obj == null) {
            return false;
        }

        if (base.constructor == Object && extend.constructor == Object) {
            for (item in extend) {
                base[item] = extend[item];
            }
        }
        return base;
    }
}
var testItems = {
    num: 1,
    obj: {
        name: "cwj",
        age: 24
    },
    func: function () {
        cosole.log("test func!")
    },
    array: [1, 3, 2, 10, 5],
    str: "admin",
    reg: new RegExp("\d", "i")
}
var ObjLearn = function () {
    this.forinTest = function (items) {
        if (items.constructor == Object) {
            for (item in items) {
                console.log(`key:${item} ,value:${items[item]}`)
            }
        } else if (items.constructor == Array) {
            for (item in items) {
                console.log(item);
            }
        } else {
            console.log(item.constructor);
            return false;
        }
    }
    //删除属性 只删除二者联系
    this.deleteItem = function (base, name) {
        delete base[name];
        console.log(base)
    }
    this.testhasOwnProperty = function (base, name, type) {
        //校验是否是可枚举自有属性
        return base.propertyIsEnumerable(name);
        //校验是否是自由属性
    }
    this.getOwnPropertyDescription = function (obj, name) {
        return Object.getOwnPropertyDescriptor(obj, name);
    }
    this.classof = function (obj) {
        if (o == null) return "Null";
        if (o == undefined) return 'Undefined';
        return Object.prototype.toString.call(o).slice(8, -1);
    }
};
var arrayLearn = {
    testforeach: function (array) {
        array.forEach((value, index, array) => {
            console.log(value + index);
        })
    },
    funcs: function (array, type) {
        //1 join 2 split 3  reverse 4 sort 5 concat  6 slice  7 splice 
        var result;
        var start = 0;
        var length = 2;
        var end = 3;
        var insertArray = ['a', 'b'];
        switch (type) {
            case 1:
                result = array.join(',');
                break;
            case 2:
                result = array.split(',');
                break;
            case 3:
                result = array.reverse();
                break;
            // item - next >0 asc <0 esc
            case 4:
                result = array.sort(function (item, next) {
                    return item - next;
                });
                break;
            case 5:
                result = array.concat([1, 3]);
                break;
            case 6:
                result = array.slice(start, end);
                break;
            case 7:
                result = array.splice(start, length, insertArray);
            default:
                result = "error!";
        }
        console.log(result);
    },
    es6: function (array, type) {
        // 1 map 2 filter 3 every 4 some 5 reduce 6 reduceRight
        var result;
        switch (type) {
            case 1:
                result = array.map((v) => v++);
            case 2:
                result = array.filter((v) => v > 5);
            case 3:
                result = array.every((v) => v > 5);
            case 4:
                result = array.some((v) => v > 5);
            case 5:
                var orgin = 0;
                result = array.reduce((v, orgin) => {
                    return v + orgin;
                });
        }
    },
    hashArray: function (array) {
        let hash = {};
        let result = [];
        for (let i = 0; i < array.length; i++) {
            if (!hash[array[i]]) {
                hash[array[i]] = true;
                result.push(array[i]);
            }
        }
        return result;
    }
}
var timeoutLearn = {};
timeoutLearn.setIntervalTest = function (time) {
    this.i = 0;
    var _this = this;
    this.f = setInterval(
        function () {
            _this.i++;
            console.log(_this.i);
            if (_this.i == time) {
                clearInterval(_this.f);
            }
        }, 1000
    );
}
base.extendClass(ObjLearn, timeoutLearn);
var t = new ObjLearn();
//  修复数组实验
function repairArray(array, num) {
    let temp = array[0] - num;
    let startList = [];
    let repairList = [];
    let falselist = array.filter((v) => {
        if (v == temp + num) {
            temp = v;
            return false;
        } else {
            startList.push(Math.ceil((temp) / num))
            var tempArray = [];
            for (let i = temp + num; i < v; i += num) {
                tempArray.push(i)
            }
            repairList.push(tempArray);
            temp = v;
            return true;
        }
    });
    for (let i = 0; i < startList.length; i++) {
        for (let j = repairList[i].length; j > 0; j--) {
            array.splice(startList[i], 0, repairList[i][j - 1]);
        }
    }
    console.log(falselist, array);
}
// 闭包实验
var dd = function () {
    this.x = 0;
    this.y = 1;
    this.getX = function () {
        return this.x;
    }
    this.getY = function () {
        return this.y;
    }
};
var test = new dd();
// bind 测试
function sum() {
    return this.num;
}
var sumc = sum.bind(testItems);

// 类和构造函数
function ClassTest(obj) {
    for (item in obj) {
        this[item] = obj[item];
    }
}
ClassTest.prototype = {
    consoleObj: function () {
        console.log(this);
    },
    fuck: function () {
        console.log(`fuck ${this.str}`);
    }
}
var newClass = new ClassTest(testItems);

// 延长作用域链
// try ,catch 语句的catch 块
// with 语句
var objtest = {
    withTest: function () {
        var qs = '?debug=true';
        with (location) {
            var href = href + qs;
        }
        return href;
    },
    // 块级作用域test ,使用var声明的变量会自动被添加到最接近的环境中
    scopeTest: function () {
        for (var i = 0; i < 10; i++) {
            continue;
        }
        for (let j = 0; j < 10; j++) {
            continue;
        }
        console.log(i); // 10 
        console.log(j); //error j is not defined; 
    },
    // 没有用var 声明的变量会自动添加到全局环境中
    varTest: function () {
        var sumIn = 1 + 1;
        sum = 1 + 1;
    },
    // 性能，垃圾回收
    rabbishRecycle: function () {
        var rabbish = {
            name: 'test'
        };
        //将对象主动设置为null来'解除引用'
        rabbish = null;
    }
}

//  chapter 5 引用类型
//  对象是某个引用类型的实例，新对象是使用 new 操作符后跟一个构造函数来创建的。
//  构造函数本身就是一个函数，只不过该函数是出于创建新对象为目的而定义的。
//  Array对象  instanceof 的局限在于他假定只有一个全局执行环境，如果网页中包含多个框架，那么就存在
function CwjClass() {
    this.array = [1, 2, 3, 4, 5];
    this.arrayToString = function (array) {
        if (array) {
            this.array = array;
        }
        console.log('toString' + this.array.toString());
        console.log('valueOf' + this.array.valueOf());
        //如果是undefined 默认会加','
        console.log('join' + this.array.join('-'));
    };
    this.isArray = function () {
        var array = [];
        if (array instanceof Array) {
            console.log(' instanceof 的局限在于他假定只有一个全局执行环境，如果网页中包含多个框架，那么就存在两个以上不同版本的数组构造函数！')
        }
        if (Array.isArray(array)) {
            console.log('EMCAScript5新增方法确定到底是不是数组！不管在哪个全局环境中')
        }
    };
    //时间类
    if (Date.now) {
        this.date = Date.now();
    } else {
        this.date = +new Date();
    }
    // 简略的format
    this.timeformat = function (time) {
        var temp = new Date(time);
        return temp.toLocaleString();

    };
    this.f = function () {
        function sum(n1, n2) {
            console.log(n1 + n2);
        }
        sum(1, 1); // 2
        var sum1 = sum;
        sum1(1, 2); // 3 
        sum = null;
        sum1(1, 3); // 4
        console.log('函数是对象，函数名是指针!')
    };
    //函数声明和函数表达式
    this.f2 = function () {
        console.log(typeof say);
        say('hi'); // 正常运行，因为解析器会优先读取函数声明，并使其在执行任何代码之前可用。（变量提升）
        if (typeof say2 == 'function') {
            say2('hi'); // 此时say2虽然会变量提升，但是还未被赋值，是个undefined
        } else {
            console.log('say还未被赋值')
        }

        function say(str) {
            console.log(str);
        }
        var say2 = function (str) {
            console.log(str);
        }
    };
    //函数借用 使用 call()（或 apply()）来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。
    this.callOrApply = function (scopeName) {
        console.log(scopeName);
        console.log(this);
    };
    // bind test
    this.bindTest = function (obj) {

        return this.callOrApply.bind(obj);
    }
    this.mathForEach = function () {
        console.log(Math);
    }
}
var cc = new CwjClass();
// chapter 6 面向对象的程序设计
// 组合使用构造函数模式和原型模式
function OOtest(name, age) {
    this._name = name;
    this._age = age;
    this.commonArray = [1, 2];

    //调用用构造函数时会为实例添加一个指向最初原型的
    //[[Prototype]]指针，而把原型修改为另外一个对象就等于切断了构造函数与最初原型之间的联系。
    //请记住：实例中的指针仅指向原型，而不指向构造函数。
}
OOtest.prototype = {
    constructor: OOtest, //重写原型，补回constructor
    getDescription: function () {
        console.log(Object.getOwnPropertyDescriptor(this, 'age'))
    },
    mathForEach: function () {
        // 遍历对象所有属性，包括不可枚举
        console.log(Object.getOwnPropertyNames(Math));
    },
    objectKeys: function (obj) {
        console.log(Object.keys(this));
    }

}
var oo = new OOtest('cwj', 24);
var oo1 = new OOtest('fd', 23);
//  访问器属性
Object.defineProperty(oo, 'age', {
    get: function () {
        return this._age;
    },
    set: function (newValue) {
        this._age = '现在变成了：' + newValue;
    }
})
// 继承
function SuperType() {
    this.property1 = true;
}
SuperType.prototype.getSuperProperty = function () {
    console.log(this.property1);
}

function SubType() {
    this.property2 = false;
}
SubType.prototype = new SuperType();
SubType.prototype.getSubProperty = function () {
    console.log(this.property2);
}
var subInstance = new SubType();

//  借用构造函数(伪造对象或经典继承)
// 在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象，
// 因此通过使用 apply()和 call()方法也可以在（将来）新创建的对象上执行构造函数
function SuperType1() {
    this.colors = ['red', 'blue', 'green'];
}

function SubType1() {
    // 继承了SuperType1
    SuperType1.call(this);
}
var instance1 = new SubType1();
var instance2 = new SubType1();
instance1.colors.push('black'); // 不会影响instance2.colors

// 组合继承。采用了上面2个继承方式的集合
function SuperType2(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}
SuperType2.prototype.getName = function () {
    console.log(this.name);
}

function SubType2(name, age) {
    SuperType2.call(this, name);
    this.age = age;
}

SubType2.prototype = new SuperType2();
SubType2.prototype.getAge = function () {
    console.log(this.age);
}
SubType2.constructor = SubType2;
var instance3 = new SubType2('cwj', 24);
instance3.colors.push('white');
var instance4 = new SubType2('fd', 23);

// 原型式继承
function object(o) {
    function F() { };
    F.prototype = o;
    return new F();
}
// 寄生式继承
// 缺点：新增的函数无法复用
function createAnother(origin) {
    var clone = object(origin);
    clone.sayHi = function () {
        console.log('hi');
    }
    return clone;
}

// 组合寄生式继承
function inheritPrototype(subType, superType) {
    var prototype = Object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

function SuperType3(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

SuperType3.prototype.sayHi = function () {
    console.log('hi');
}

function SubType3(name, age) {
    SuperType3.call(this, name);
    this.age = age;
}
inheritPrototype(SubType3, SuperType3);

// window 对象
// window 对象的删除
var age = 24;
window.color = 'red';
// 在IE<9 时 delete 全局对象属性都会抛出错误
delete window.age; //false;   //原因是 var 定义的属性[[configurable]] 被设置为false
delete window.color; //true;

// top 对象指向最高层的框架，也就是浏览器窗口
// parent 对象始终指向当前框架的直接上层框架
// self 对象指向window。引入目的是为了与上面2个对象对应起来

// 框架集引用：window.frames[0]; window.frames['frameName'] 

// 窗口位置  screenX 和 screenY 是在FF中使用
var leftPos = window.screentLeft || window.screenX;
var topPos = window.screenTop || window.screenY;
// 移动窗口 在浏览器中可能会被禁用，eg： Opera 和IE7+
window.moveTo(100, 100); //移动到新位置的x,y坐标值
window.moveBy(0, 100); // 从窗口向下移动100像素
window.moveBy(-50, 0); //窗口向左移动50像素

// 窗口大小
// innerHeight,innerWidth, outerHeight,outerWidth 表示窗口的尺寸不一
// 页面视口大小
function getWindowSize() {
    var pageHeight = window.innerHeight;
    if (typeof pageWidth != 'Number') {
        if (document.compatMode == 'CSS1Compat') {
            return {
                pageHeight: document.documentElement.clientWidth,
                pageWidth: document.documentElement.clientHeight
            }
        } else {
            return {
                pageHeight: document.body.clientWidth,
                pageWidth: document.body.clientHeight
            }
        }
    }
    return {
        pageHeight: pageHeight,
        pageWidth: window.innerWidth
    }
}
// 改变窗口大小 resizeTo , resizeBy  在浏览器中可能会被禁用，eg： Opera 和IE7+

// 导航和打开窗口 window.open()
// target 可以是窗口或者框架名，或者是特殊的窗口名 _self,_parent,_top,_blank 
// features 配置项 fullscreen 窗口是否最大化 ，height 新窗口高度， left 新窗口的左坐标， location 是否在地址栏显示url，可能会被禁用 ，menubar 菜单栏， resizable ， scrollbars 是否允许拖动,status 状态栏,toolbar 工具栏,top 上坐标，width 宽度
function windowOpen(url, target, features) {
    var windowName = window.open(url, target, features);
    return windowName;
}
// 关闭窗口
function windowClose(windowName) {
    windowName.close();
}
// 检测浏览器屏蔽函数
function testBroswerBlock(url) {
    var blocked = false;
    try {
        var newWin = window.open(url);
    } catch (ex) {
        blocked = true;
    }
    if (blocked) {
        window.alert('oh no,浏览器屏蔽了我们的弹出窗，请检查修改浏览器相关设置！')
    }
}


// 间歇调用和超时调用
// setTimeOut() 第一个参数可以传入字符串，这样的默认会调用一次eval函数，影响性能，不推荐使用。
function TimeoutTest() {
    var test = setTimeout(function () {
        console.log('test');
    }, 1000)
    //cleartTimeout(test);
}


// 系统对话框
var dialog = {
    alert: function (str) {
        window.alert(str);
    },
    promt: function (str) {
        var inp = window.prompt(str);
        // 返回用户输入值
        console.log(inp);
    },
    comfirm: function (str) {
        var defaultstr = '默认输入项';
        var flag = window.confirm(str, defaultstr);
        if (flag) {
            // 点击确认执行 fn
        } else {
            // 点击取消执行 fn
        }
    }

}

// window 对象结束

// location 对象

// location 属性 hash,host 服务器和端口号，hostname 不含端口号的服务器，href 完整url，pathname url中的目录和（或）文件名 ， port 端口号 ，protocol 协议，search 查询字符串

// 查询字符串对象化
function searchToObj(search) {
    if (search.length > 0) {
        var str = search.substring(1);
        var queryList = str.split('&');
        var temp;
        var obj = {};
        for (let i = 0, l = queryList.length; i < l; i++) {
            temp = queryList[i].split('=');
            obj[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
        }
        return obj;
    }
    return null;
}

// 位置操作
var locationT = {
    assign: function (url) {
        // 立即打开新URL并在浏览器历史记录中生成一条记录
        location.assign(url);
        return;
        //与下面2种方法相同
        window.location = url;
        location.href = url;
    },
    replace: function (url) {
        //不会生成历史记录
        window.replace(url);
    },
    reload: function () {
        window.reload();
    }
}

// history 对象
var historyT = {
    go: function (num) {
        //也可以传入字符串
        history.go(num);
    },
    backOrForward: function (type) {
        if (type) {
            history.forward();
        } else {
            history.back();
        }
    }

}
// location 对象结束

// DOM
// 操作节点
var elementT = {
    appendChild: function (node, element) {
        node.appendChild(element);
    },
    insertBefore: function (element, node) {
        node.insertBefore(element, null); // 在node最后插入一个element
        node.insertBefore(element, node.firstChild); // 在node中插入第一个子节点
        node.insertBefore(element, node.lastChild); //在node最后一个子节点前插入
        // 第二个参数为参照节点
    },
    replaceChild: function (node, newNode) {
        //替换节点   被替换的节点仍然还在文档中，但没有了自己的位置
        node.replaceChild(newNode, node.lastChild);
    },
    //移除节点
    removeChild: function (node, target) {
        return node.removeChild(target);
    },
    //其他方法   所有节点都有的功能
    cloneNode: function (node, type) {
        // type true/false 是否执行深复制
        // 深复制复制节点及其整个子节点树   浅复制值复制其本身
        return node.cloneNode(type);
    },
    normalize: function (node) {
        //找到空文本节点删除，或者合并相邻的文本节点
        node.normalize();
    }

}

// Document 类型
// 特征   nodeType  9 , nodeName   '#document',  nodeValue null,  parentNode null, ownerDocument null
//  document.body 在js代码中出现频率非常高，所以定义变量
var body;
var msg;
window.onload = function () {
    body = document.body;
    if (document.compatMode == 'CSS1Compat') {
        console.log('标准模式！');
    } else {
        console.log('混杂模式！');
    }
    msg = document.getElementById('message');
    // 本地用会有跨域问题
    //frames['richedit'].document.designMode = 'on';

}

// 通常浏览器将 <!DOCTYPE> 标签堪称一个与文档其他部门不同的实体，可通过
var doctype = document.doctype // 取得引用，IE8- document.doctype 为null，因为会把标签解释为 注释，IE9+和FF 会把该标签当作文档的一部分

// 文档信息
// 输出文档信息
function outputDocumentInfo() {
    var originalTitle = document.title;
    document.title = 'new'; //并不会修改<title>元素
    var url = document.url; //url
    var domain = document.domain; // 域名
    var referrer = document.referrer; //取得来源页url
    console.log(`title:${originalTitle}\n url:${url}\n domain:${domain}\n referrer:${referrer}`);
}

// 查找元素
var searchTool = {
    id: function (id) {
        // 在IE 7-中，表单元素[input,textarea,button,select]的name也会被id选择匹配
        return document.getElementById(id);
    },
    tag: function (tagName) {
        // return NodeList
        // 传入 * 默认通配符，可以渠道所有元素，而IE 中则会返回 注释节点，因为IE将注释节点实现为元素（element）
        return document.getElementsByTagName(tagName);
    },
    name: function (name) {
        // 只有 HTMLDocument类型才有的方法
        // 最长用的情况是取得单选按钮；为了确保发送给浏览器的值正确无误，他们的具有相同的name。但ID可以不同
        return document.getElementsByName(name);
    },
    specialCollections: function (type) {
        var collections = ['anchors', 'applets', 'forms', 'images', 'links'];
        if (collections.indexOf(type) != -1) {
            return document[type];
        } else {
            console.log('没有这个特殊方法，别搞笑！');
        }
    }
}
// 文档写入
var documentIO = {
    // write会直接覆盖掉原来的body
    write: function (str, type) {
        if (type) {
            document.write(str);
        } else {
            document.writeln(str);
        }
    },
    openClose: function (type) {
        if (type) {
            window.open();
        } else {
            window.close();
        }
    }
}

// Element 类型 用于表现XML和HTML元素
//  nodeType 1,nodeName 标签名， nodeValue null, parentNode 可能是Document 或 Element， 

// HTML 元素
// 取得特性
// 任何元素的特性和也都可以通过DOM元素本身的属性来访问，只不过只有公认的（非自定义的）特性才会以属性的形式添加到DOM对象中[IE除外]。
// 通过属性获取的style特性会返回一个对象，通过getAttribute()访问的时，返回CSS文本。onclick这类的事件，属性访问会返回一个函数，相反则会返回响应代码的字符串。
// 由于这些差别，开发情况下不推荐使用 getAttribute,除非是获取自定义特性
var htmlT = {
    // 不区分大小写
    getAttribute: function (element, attribute) {
        return element.getAttribute(attribute);
    },
    // setAttribute() 在IE7-中存在一些异常行为
    // 通过这个方法设置class和style或者 事件处理程序特性时都无效
    // 推荐使用属性来设置特性
    setAttribute: function (element, attribute, value) {
        element.setAttribute(attribute, value);
    },
    // 不常用
    removeAttribute: function (element) {
        element.removeAttribute();
    }

}

// attributes属性 并不好用
// Element 类型是使用attributes属性的唯一一个DOM节点类型。

// 创建元素 并不会插入到文档树中
htmlT.createElement = function (tagName) {
    var ele = document.createElement(tagName);
    return ele;
}

// 元素子节点
//  非IE浏览器中，标签之间的空白符会产生多余的 文本节点

// 文本节点 Text类型
// nodeType 3, nodeName "#text", nodeValue为节点所包含的文本，parentNode 是一个Element ,没有子节点
var TextT = {
    createTextNode: function (str) {
        if (!str) {
            str = '<strong>这是一个</strong>例子';
        }
        // 作为参数的文本会按照HTML或XML的格式进行编码
        return document.createTextNode(str);
    },
    // 如果文本节点在文档数中，那么对文本节点的修改会立即获得反应
    ways: {
        appendData: (text, str) => {
            // 将str添加到节点的末尾
            text.appendData(str);
        },
        deleteData: (text, offset, count) => {
            // 从offset指定的位置开始删除count个字符
            text.deleteData(offset, count);
        },
        insertData: (text, offset, str) => {
            // 从offset指定的位置开始插入str
            text.insertData(offset, str);
        },
        replaceData: (text, offset, count, str) => {
            text.replaceData(offset, count, str);
        },
        splitData: (text, offset) => {
            text.splitData(offset);
        },
        substringData: (text, offset, count) => {
            text.substringData(offset, count);
        }
    }
}

// Comment类型 注释
// nodeType 8,nodeName  "#Comment", nodeValue 是注释的内容， parentNode 可能是Document或Element ,不支持子节点
// 继承自和Text 相同的基类，除了splitText() 之外的所有字符串操作方法

// CDATASection类型 XML文档的 CDATA区域，与Comment类似
// nodeType  4

// DocumentType 类型 
// 并不常通用，仅有FF,Safari,Opera 支持 ,nodeType 10,nodeName 的值为 doctype的名称

// DocumentFragment 类型
// DOM规定文档片段是一种“轻量级”的文档
// nodeType 11,nodeName "#document-fragment", nodeValue null, parentNode null,
// 文档片段继承了Node 的所有方法，通常用于执行那些针对文档的DOM操作。如果将文档中的节点添加到文档片段中，就会从文档数中移除该节点，添加到文档片段的新节点同样也不属于文档树。
// 为了避免类似子节点的重复抄作DOM，影响性能
// 下面function 为在body 最后添加一个ul 列表的实现
function fragInsert(array) {
    let ul = document.createElement('ul');
    let frag = document.createDocumentFragment();
    frag.appendChild(ul);
    let li;
    for (let i = 0, l = array.length; i < l; i++) {
        li = document.createElement('li');
        li.textContent = array[i];
        frag.firstChild.appendChild(li);
    }
    body.appendChild(frag);
}

// Attr 类型  元素的特性，nodeType 2,
// 属性有 name ，value , specified   并不建议直接访问特性节点

// DOM 操作技术  
// 动态脚本  
// IE将 script 和  style 视为特殊标签，不允许访问其子节点

// 操作表格
var table = {
    prototypes: ['caption', 'tBodies', 'tFoot', 'tHead', 'rows'],
    functions: '不多作追溯'
}
//  一个创建表格的function ,并在最后删除该表格
function tableTest(tableName, heads, rows) {
    var table = document.createElement('table');
    var thead = table.createTHead();
    var tBody = table.createTBody();
    thead.insertRow(0);
    thead.rows[0].textContent = heads;
    for (let i = 0, l = rows.length; i < l; i++) {
        tBody.insertRow(i);
        tBody.rows[i].textContent = rows[i];
    }
    body.appendChild(table);
    var n = rows.length;
    (function (n) {
        let timeFunc = setInterval(function () {
            n--;
            tBody.deleteRow(n);
            if (n == 0) {
                body.removeChild(body.getElementsByTagName('table')[0]);
                clearInterval(timeFunc);
                return;
            }

        }, 1000);
    }(n));
}

// DOM 结束

// DOM拓展
// 选择符API [ie8+,ff3.5+,safari3.1+,chrome,opera10+]
searchTool.querySelector = function (target) {
    return document.querySelector(target);
}
searchTool.querySelectorAll = function (target) {
    return document.querySelectorAll(target);
}
searchTool.matchesSelector = function (target) {
    // 检测是否能被上述2种方法找到，return true,false
    // 不好用 DOM2
    return document.matchesSelector(target);
}

// 类相关的扩充 
searchTool.className = function (target) {
    return document.getElementsByClassName();
}
// classList 属性
// 操作类名时， 需要通过className 属性更改，之前是操作字符串，现在扩充几种方法 [add(value),contains(value),remove(value),toggle(value)]

// 焦点管理
searchTool.focus = function () {
    return document.activeElement;
}
// focus 方法，可以让元素获得焦点

// HTMLDocument 的变化
// readyState 属性  2种状态，loading,complete
// 兼容模式 compatMode 标准模式 CSS1Compat ,混杂模式 BackCompat 检测参考 上面的onload 
// head 属性
// 字符集属性
document.charset = 'utf-8';
// 自定义属性 以 data- 为前缀，之后可以通过dataset来访问

// 插入标记
// innerHTML 属性  在写模式下，innerHTML 会根据指定的值创建DOM树，然后用这个DOM树完全替换调用元素原先的所有子节点。
// IE和 Opera 会把标签转换为大写形式，其他则保留
// 在大多数浏览器中 innerHTML 写入 script 会被拒绝 ，ie8-可以，但是需满足 （1. 指定defer属性。必须位于有作用域之后。
// 使用innerHTML最好实现进行 文本无害化处理

// outerHTML 在写模式下，outerHTML 会根据指定的值创建DOM树，然后用这个DOM树完全替换调用元素。

// insertAdjacentHTML() 2个参数，插入位置和要插入的html文本
// beforebegin  afterbegin beforeend afterend 

// 内存和性能问题 
// 元素和事件处理程序，在元素删除之后，事件处理程序并没有一并删除，使用 innerHTML ,outerHTML和 insertAdjacentHTML() 时，最好先收工删除要被替换的元素的所有事件处理程序和js对象。这些方法创建html元素时会创建一个HTML解析器（浏览器级别,性能好）。避免多次创建。

// scrollIntoView() 方法
// IE,FF.Safari,Opera, chrome亲测也支持
// 不传入参数，或者传入true,窗口会与视口顶部平齐，如果传入false则会尽可能全部出现在视口中(元素的底部会与视口顶部平齐)。

// 专有拓展
// 文档模式
// children 属性，用于处理IE9之前与其他浏览器在处理文本节点中的空白符时的差异。 只返回元素中同样还是元素的子节点。
// contains()  检测元素节点是不是调用该该方法的元素的子节点。
// 插入文本  innerText , outerText 不作赘述 FF不支持
// 滚动 scrollIntoViewIfNeeded(alignCenter) ,scrollBylines(lineCount), scrollByPages(pageCount),

// DOM拓展结束

// DOM2和DOM3
// 'DOM2级核心'为不同的DOM类型引入了一些与XML命名空间有关的方法。这些变化只在使用XML或XHTML文档时才有用；对于html文档没有实际意义。
// DOM2和DOM3结束

// 事件
// 在HTML中指定事件处理程序有2个缺点 1: HTML元素一出现在页面上就触发相应的时间，但当时的时间处理程序有可能尚不具备执行条件 2.这样拓展事件处理程序的作用域链在不同的浏览器中会导致不同结果。 还有就是HTML与JavaScript代码紧密耦合。
// DOM0级事件处理程序  例子
var btn = document.getElementById('myBtn');
btn.onclick = function () {
    alert(this);
}
btn.onclick = null; // 删除事件处理程序

// DOM2级事件处理程序
// 方法：addEventListener ,removeEventListener , 都接受3个参数 （要处理的事件名，作为事件处理程序的函数，一个布尔值）布尔值为true表示在驳火阶段调用事件处理程序，false表示在冒泡阶段调用事件处理程序,如果不需要在时间到达目标之前截获他的时候，尽量使用冒泡阶段调用事件处理程序，获得最大限度的兼容性
//  例子 好处是可以添加多个事件处理程序，按顺序触发
btn.addEventListener('click', function () {
    alert(this);
}, false);
// addEventListener添加的事件处理程序只能用removeEventLisener()来移除。
btn.removeEventListener('click', function () {
    alert(this);
}, false) // 并没有效果。因为add和remove的第二个参数虽然看似相同但其实是2个不同的匿名函数,可以按下面那种方法操作
var fun = function () {
    alert('this');
}
btn.addEventListener('click', fun, false);
btn.removeEventListener('click', fun, false); // 生效
// IE 事件处理程序 
//  attachEvent(),detachEvent() 2个参数 ，（事件处理程序名称，事件处理函数）
// attachEvent 和DOM0级方法的主要区别在于事件处理程序的作用域，attachEvent() 事件处理程序会在全局作用域中运行，this === window
//btn.attachEvent('onclick', fun);
//btn.detachEvent('onclick', fun);

/* 事件对象 event 生命周期：只有在事件处理程序执行期间存在，结束就销毁
 包含属性 bubbles 事件是否冒泡，cancelable, currentTarget 正在处理事件的那个元素,defaultPrevented 是否调用了preventDefault() DOM3级事件中新增，detail , eventPhase 事件处理程序阶段  1.捕获阶段 2 处于目标 3 冒泡阶段  preventDefault() 取消事件的默认行为，stopImmediatePropagation(), stopPropagation() 取消时间的进一步捕获或冒泡， target 事件的目标 , trusted true：浏览器生成，false: js 创建生成  , type 被触发的事件类型, view 与事件关联的抽象视图 
 */
// 事件冒泡测试，可取消冒泡
var father = document.getElementsByClassName('content')[0];
father.onclick = function () {
    msg.textContent = '儿子被点击了！';
};
father.children[0].onclick = function () {

    msg.textContent = '我被点击了！而且不告诉爸爸！';
    event.stopPropagation();
};
father.children[1].onclick = function () {
    msg.textContent = '我被点击了！告诉爸爸！';
};
/* IE中的事件对象 
    在使用DOM0级方法添加事件处理程序时，event对象作为window对象的一个属性存在。 var event = window.event;
    使用attachEvent() 添加时，会有一个event 对象作为参数传入事件处理程序函数中 function(event){...};
    所有事件对象都会包含下列属性和方法
    cacelBubble  默认为false,设置为true 可以取消冒泡
    returnValue  默认值为true ,设置会false就可以取消事件的默认行为
    srcElement   事件的目标
    type  
    因为事件处理程序的作用域会根据指定的不同方式而改变，所以不能认为this会始终等于事件目标，所以使用 srcElment 比较好
*/

// 事件类型
/* UI事件 表示元素已经被用户操作激活，dom3中废弃。不建议使用 */
/* 焦点事件 下面是使用input的例子
    focusin 等价focus但冒泡, focusout blur的通用版本
    DOMFocusIn,DOMFocusOut 废弃 
*/
var myInput = document.getElementById('myFocus');
myInput.onblur = function () {
    console.log('失去焦点时出发，不冒泡！所有浏览器支持');
};
myInput.onfocus = function () {
    console.log('我获得了焦点！所有浏览器支持');
}
/* 鼠标与滚轮事件 
    下面展示了DOM3事件定义的9个鼠标事件
*/
var clickArea = document.getElementById('clickArea');
clickArea.onclick = function () {
    this.textContent = '我被点击了！';
}
clickArea.ondblclick = function () {
    this.textContent = '我被双击了！';
}
clickArea.onmousedown = function () {
    this.textContent = '鼠标点击在我上面了！';
}
clickArea.onmouseup = function () {
    this.textContent = '释放了鼠标按钮！';
}
clickArea.onmouseenter = function () {
    //在 over 之后，不冒泡
    this.textContent = '鼠标移动到了元素范围内！';
}
clickArea.onmouseleave = function () {
    // 在 out 之后，不冒泡
    this.textContent = '鼠标移动到了元素范围外！';
}
clickArea.onmousemove = function () {
    this.textContent = '鼠标在元素范围内移动！';
}
clickArea.onmouseout = function () {
    this.textContent = '鼠标位于元素上方，然后用户将其移入了另一个元素时触发';
    //console.log(event.relatedTarget);
}
clickArea.onmouseover = function () {
    this.textContent = '鼠标位于元素外部，然后用户将其另一个移入时触发';
    //console.log(event.relatedTarget);
}
// 客户区坐标位置,页面坐标位置，屏幕坐标位置
document.body.onclick = function () {
    clickArea.textContent = `鼠标当前位于 x:${event.clientX} y:${event.clientY}\n\r 鼠标当前位于页面 x:${event.pageX} y:${event.pageY} \n\r 鼠标当前位于屏幕 x:${event.screenX} y:${event.screenY}`;
    var array = [];
    if (event.shiftKey) {
        array.push('shift');
    }
    if (event.ctrlKey) {
        array.push('ctrl');
    }
    if (event.altKey) {
        array.push('alt');
    }
    if (event.metaKey) {
        array.push('meta');
    }
    clickArea.textContent += array.join(',');
}
// 页面中长点击移动
var currentX = 0;
var currentY = 0;
document.body.onmousedown = function () {
    currentX = event.pageX;
    currentY = event.pageY;
    console.log(event.button);
}
document.body.onmouseup = function () {
    document.getElementById('mouseXY').textContent = `鼠标移动了 x:${event.pageX - currentX} y:${event.pageY - currentY}`;
    currentX = event.pageX;
    currentY = event.pageY;
}

/* 鼠标滚轮事件mousewheel  wheelDelta 是120的倍数 */
document.onmousewheel = function (event) {
    document.getElementById('mouseWheel').textContent = event.deltaY * event.wheelDelta;
}
/* 键盘与文本事件
    对键盘事件的支持主要遵循的是DOM0级
    keyup->keypress->keyup
    textInput 是对keypress 的补充，在文本插入文本框之前触发
    DOM3级变化 新增属性key和 char
    key : 是一个字符串，在按下某个字符键时，key的值就是响应的文本字符，按下非字符键时，key值是相应的键名。char在字符键时和key一致，非字符键时为null
    由于存在跨浏览器问题，不推荐使用key char keyIndentifier
*/
var keyCtn = document.getElementById('keyCtn');
keyCtn.onkeydown = function () {
    keyCtn.value += event.keyCode;
}
keyCtn.onkeypress = function () {
    keyCtn.value += 'press中';
}
keyCtn.onkeyup = function () {
    keyCtn.value += event.keyCode + '释放';
}
keyCtn.ontextInput = function () {
    keyCtn.value += event.data;
}
/* 复合事件
    DOM3级事件中新添加的一类事件，用于处理IME（输入法编辑器）的输入序列
    compositionstart , compositonupdate,compositionend,
 */
/* 变动事件
    DOM2级 变动事件是为了XML或 HTML DOM设计的，并不指定于某种语言
    DOMSubstreeModified:DOM结构中任何变化时触发
    DOMNodeRemoved:在节点从其父节点中被移除时出发
    DOMNodeInsertedIntoDocument
    DOMNodeRemovedFromDocument
    DOMAttrModified
    DOMCharacterDataModified 文本节点值发生变化
*/
// 检测 是否支持变动事件 document.implementation.hasFeature('MutationEvents','2.0')
document.getElementsByClassName('indent')[0].addEventListener('DOMNodeRemoved', function () {
    msg.innerHTML = 'DOM被改变了！';
});

/* HTML5事件 
 */
// 阻止右键默认操作
document.getElementsByClassName('footer')[0].addEventListener('contextmenu', function () {
    event.preventDefault();
    msg.textContent = '尾巴被右键了一下！';
}, false);
window.onbeforeunload = function () {
    if (window.confirm('真的要关闭页面吗？')) {
        window.close();
    } else {
        return;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // 不例会图片，js,css或其他资源是否已经下载完毕，支持用户在页面下载的早期添加事件处理程序
    // 可以在window或document中添加，但他的实际目标是document
    console.log('DOM树加载完毕！')
});

// uninitialized 未初始化，loading , loaded,interactive 交互, complete 
document.onreadystatechange = function () {
    console.log(document.readyState);
}
    // pageshow 和 pagehide 例子为pageshow， pagehide 正好相反
    (function () {
        // showCount 会在刷新是重置，但是如果是前进\后退时则会缓存
        var showCount = 0;
        window.onpageshow = function () {
            //虽然绑定在window，但实际目标是document
            showCount++;
            msg.textContent = '页面完全加载完毕！' + showCount;

        }
    }());
// hashchange 事件 当url参数列表变化时触发
window.onhashchange = function () {
    msg.textContent = `old URL: ${event.oldURL}  new URL: ${event.newURL}`
}
/* 设备事件  */
/*  deviceorientation  属性
    alpha  围绕z轴旋转时，y轴的度数差   左右旋转
    beta   围绕x轴旋转时，z轴的度数差   前后旋转
    gamma  围绕y轴旋转时，z轴的度数差   扭转设备
    absolute 布尔值，表示设备是否返回一个绝对值
    compassCalibrated  布尔值，表示设备的指南者是否校准过
*/
// window.ondeviceorientation = function () {
//     msg.textContent = '设备方向变化';
// }
/* 检测设备是否移动 devicemotion
    acceleration {x: y: z:} 各轴上的加速度，不考虑重力
    accelerationIncludingGravity {x: y: z:}  考虑重力
    interval  以毫秒表示的时间值，常量
    ratationRate {alpha, beta, gamma}  表示方向
 */
// window.ondevicemotion = function () {
//     msg.textContent = '设备正在移动！';
// }
/* 触摸与手势事件
    touchstart
    touchmove
    touchend
    touchcancel
    这些事件都会冒泡，也都可以取消。均兼容DOM的方式实现
    event属性 ：  包括了鼠标事件中常见的属性(bubbles,cancelable,view , clientX , clientY ,screenX,screenY,detail,altKey,shiftKey,ctrlKey,metaKey)
    新增 跟踪触摸的属性   touches , targetTouchs, changeTouches
    Touch对象包含属性 clientX,clientY ,identifier,pageX,pageY,screenX,screenY,target
    手势事件 当2个手指触摸屏幕时就会触发
    gesturestart, gesturechange, gestureend
 */
var touchClientY = 0;
var deviceCtn = document.getElementById('deviceCtn');
deviceCtn.addEventListener('touchstart', function () {
    event.preventDefault();
    touchClientY = event.touches[0].clientY;
    //console.log(event);
});
deviceCtn.addEventListener('touchend', function () {
    event.preventDefault();
    deviceCtn.textContent = "老子被移动了" + (event.changedTouches[0].clientY - touchClientY);
    //touchClientY = event.changedTouches[0].clientY;
    //console.log(event);
});
/*  内存和性能
    1.每个函数都是对象，会占用内存。
    2.必须事件指定所有事件处理程序从而导致的DOM访问次数，会延迟整个页面的交互就绪时间
    下面提供一些方式提升性能
 */
/* 事件委托
    事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件，下面举例
    document对象很快可以访问，并且在页面生命周期的任何时间点上添加事件处理程序（无需等待DOMContentLoaded 或者load事件）
 */
document.getElementById('myDelegation').addEventListener('click', function () {
    switch (event.target.id) {
        case 'one':
            msg.textContent = 'one 被点击！';
            break;
        case 'two':
            msg.textContent = 'two 被点击！';
            break;
        case 'three':
            msg.textContent = 'three 被点击！';
            break;
        default:
            msg.textContent = '= =  被点击！';
    }
}, false);
/* 移除事件处理程序
    1.removeChild() 和 replaceChild() 
    2.innerHTML 替换
    DOM虽然改变删除，但是没有删除dom对应的事件处理程序。最好手动删除，可以使用onunload 事件处理程序进行移除
 */


/* 模拟事件
    document 对象上使用 createEvent() 创建event对象，这个方法接受一个参数，即要创建的事件类型的字符串。
    DOM2                       DOM3
    UIEvents                   这边去掉s
    MouseEvents
    MutationEvents
    HTMLEvents
    模拟事件的最后一步就是触发事件， dispatchEvent()
    传入event对象就好，下面举个模拟鼠标点击事件function
 */
document.getElementById('fakeEvent').onclick = function () {
    var fake = document.createEvent('MouseEvent');
    fake.initMouseEvent('click', false, false, document.defaultView, 0, 100, 100);
    clickArea.dispatchEvent(fake);
    // 键盘模拟，不提倡模拟keypress  , keyCode 无法模拟
    // var fake = document.createEvent('KeyboardEvent');
    // fake.initKeyboardEvent('keydown', true, true, document.defaultView, 'a', 0, 'Shift', 0);
    // keyCtn.dispatchEvent(fake);

}
// 事件结束

/* 表单脚本
    表单是由<form>元素来表示的，在js中，对应的则是HTMLForm-Element 类型（继承了HTMLElement），下面是它独有的属性和方法
    acceptCharset:服务器能够处理的字符集
    action:接受请求的URL
    elements:表单所中所有控件的集合
    enctype:请求的编码类型
    length:表单中控件的数量
    method: 要发送的HTTP请求类型
    name: 表单的名称
    reset():将所有表单域重置为默认值
    submit():提交表单
    target: 用于发送求情和接受响应的窗口名称
    获取引用方式：1.getElementById()  2. document.forms
    提交表单：<input> <button> 将type 设置为 “submit”, 图像按钮则是 input  type 设置为'image'
    重置表单： <input> <button> 将type 设置为 "reset"
    表单字段共有的属性：
    disabled form name readOnly tabIndex 当前字段的切换（tab）序号 type 当前字段的类型（“checkbox”，“radio”等），value 
    每个表单字段都有2个方法，focus()和blur()
    HTML5为表单新增了一个autofocus属性
    共有的表单字段事件  blur change focus 
 */
// 初始化表单监听
function initFormElement() {
    var myForm = document.getElementById('myform');
    console.log(myForm.elements);
    // myForm.elements['name']  可以通过元素的name获取引用
    var formInput = document.getElementById('formInput');
    formInput.onblur = function () {
        msg.textContent = '表单Input失焦';
    };
    formInput.onchange = function () {
        msg.textContent = '表单Input失焦，value 改变';
    };
    formInput.onfocus = function () {
        msg.textContent = '表单Input聚焦';
        formInput.style.backgroundColor = "yellow";
    };
    formInput.onselect = function () {
        //IE8 不支持  但有另外一种解决方案
        if (!document.selection) {
            msg.textContent = '选中了' + formInput.value.substring(formInput.selectionStart, formInput.selectionEnd);
        } else {
            msg.textContent = '选中了' + document.selection.createRange().text;
        }
    };
    // 过滤输入
    formInput.onkeypress = function () {
        if (!event.ctrlKey) {
            if (/\d/.test(String.fromCharCode(event.keyCode))) {
                event.preventDefault();
            }
        }
    };
};
var initFormBtn = document.getElementById('initFormBtn');
initFormBtn.onclick = function () {
    this.textContent = "表单监听已初始化！";
    this.setAttribute('disabled', 'true');
    initFormElement();
}

/* 文本框脚本
    input size设置文本框能够显示的字符数，value 初始值，maxlength 可接受的最大字符数
    textarea 指定文本框大小 rows,cols
 */
var updateBtn = document.getElementById('updateInput');
updateBtn.onclick = function () {
    // 修改input并选中
    let input = document.getElementById('formInput');
    input.value = 'input已被设置！';
    input.setAttribute('maxlength', 1);
    // 选择文本
    input.select();
    // 选择部分文本
    input.setSelectionRange(1, 3);
    /* IE8方案
    var range = input.createTextRange();
    range.collapse(true);
    range.moveStart('dddd', 0);
    range.moveEnd('dddd', 2);
    range.select();
    */
    // 修改area
    let area = document.getElementById('formArea');
    area.value = 'area被顺带修改了！';
    area.rows = 1;
    area.cols = 30;
}
/* 操作剪贴板
    要访问剪贴板事件期间的数据，可以使用clipboardData 对象（在IE中是window对象的属性，而在其他浏览器中是event属性，所以大多数浏览器只有在处理剪贴板事件时clipboardData对象）
    方法： getData() 接受一个参数 IE中 （text,url） 其他浏览器是 MIME类型 ，可用用text 代表 'text/plain'
          setData()   第一个参数也是数据类型（但是其他浏览器需要写成‘text/plain’），第二个则是文本
          clearData()
 */
function initJTB() {
    let input = document.getElementById('formInput');
    input.onbeforecopy = function () {
        msg.textContent = '我要开始复制了！';
    };
    input.oncopy = function () {

        msg.textContent = '复制了！' + (event.clipboardData ? event.clipboardData.getData('text') : window.clipboardData.getData('text'));
    };
    input.onbeforecut = function () {
        msg.textContent = '我要开始剪切了！';
    };
    input.oncut = function () {
        msg.textContent = '剪切了！' + (event.clipboardData ? event.clipboardData.getData('text') : window.clipboardData.getData('text'));;
    };
    input.onbeforepaste = function () {
        msg.textContent = '我要开始黏贴了！';
    };
    input.onpaste = function () {
        msg.textContent = '黏贴了！' + (event.clipboardData ? event.clipboardData.getData('text') : window.clipboardData.getData('text'));;
    };

}
document.getElementById('myclipboard').onclick = initJTB;

/*自动切换焦点 下面例子当输入框输入值等于maxLength时自动切换 */
document.getElementById('autoChangeInput').onkeyup = function () {
    if (event.target.value.length == event.target.maxLength) {
        //document.getElementById('formInput').focus();  这种是写死的,比较蠢
        let form = event.target.form;
        for (let i = 0, l = form.elements.length; i < l - 1; i++) {
            if (form.elements[i] == event.target) {
                form.elements[i + 1].focus();
                return;
            }
        }
    }
}

/* HTML5约束验证API （FF4+,Safari5+,Chrome,Opera10+）
// 必填字段 例： <input type="text" name="username" required>  会组织表单提交并在字段下方弹出帮助框
// 新增输入类型 email url number 等
// 输入模式  在文本字段新增 pattern 属性， 值为一个正则表达式，用于匹配文本框中的值 亲测兼容性并不好  检测浏览器是否支持  "pattern" in document.createElement('input');
 */
// 检验有效性 checkValidity() 所有表单字段都有这个方法 下面举例
/* validity对象输出错误类型举例
    customError 如果设置了setCustomValidity()，则为true,否则为false
    patternMismatch,rangeOverflow,rangeUnderflow,stepMismtach,tooLong,typeMismatch,valid 其他的都是false则返回true,valueMissing required没有值
    禁用验证 novalidate 告诉表单不校验
*/
var h5input = document.getElementById('h5input')
h5input.onblur = function () {
    if (!h5input.checkValidity()) {
        h5input.value = `输入值不符合pattern:${h5input.getAttribute('pattern')} 校验`;
        h5input.select();
        // 输出错误
        console.log(h5input.validity);
    }
}

/* 选择框脚本 select option
    option 对象
    index label selected text value
    选择框的change事件出发，只需要选中了选项就会触发
    获取选择项，遍历options selected
    下面举例
    
 */
function initSelectT(event, optionArray) {
    if (!optionArray) {
        optionArray = ['初始1', '初始2', '初始3', '初始4', '初始5',]
    }
    var select = document.createElement('select');
    select.multiple = true; // 是否允许多项选择
    select.innerHTML = '<option>初始option</option>';
    for (let i = 0, l = optionArray.length; i < l; i++) {
        let newOption = document.createElement('option');
        newOption.value = optionArray[i];
        newOption.textContent = optionArray[i];
        select.add(newOption, select.firstChild[0]);
    } // 1 新增option   2 相关项relOption 之前
    let index = 0; // 给定位置的选项
    select.remove(index);
    select.selectedIndex = 0; // 如果没有选中项 值为-1
    select.size = 4; // 选择框中可见的行数
    select.value == optionArray[0]; // true 没有选中时是空字符串，一个或多个的时候显示第一个 
    console.log(select.options);
    document.body.appendChild(select);
}
document.querySelector('#initSelect').onclick = initSelectT;
/* 表单序列化 */
/* 富文本编辑框
    这一技术的本质就是在页面中嵌入一个包含空HTML页面的iframe,通过设置designMode属性，这个空白的HTML页面可以被编辑，而编辑对象则是该页面的<body>元素的HTML代码，只有在页面完全加载之后才能设置这个属性。onload设置
    具体属性不作赘述，感觉没什么卵用
 */
/* 使用Canvas绘图 IE9+
    <canvas>由几组API构成，但并非所有的浏览器都支持所有这些API，除了具备基本绘图能力的2D上下文，<canvas>还建议了一个名为WebGL的3D上下文。但是支持不够好。
 */
var mycanvas = document.getElementById('mycanvas');
document.getElementById('paintBtn').onclick = paint;
// 检测canvas支持
function paint() {
    if (mycanvas.getContext) {
        let context2d = mycanvas.getContext('2d');
        //console.log(context2d);
        /* 2D上下文
        填充和描边 fillStyle,strokeStyle
         */

        // 绘制蓝色矩阵
        context2d.fillStyle = "#0000ff";
        context2d.fillRect(0, 0, 20, 20);
        // 红色半透明矩阵
        context2d.fillStyle = 'rgba(255, 0, 0, 0.5)';
        context2d.fillRect(10, 10, 30, 3
        // 交界处黑色描边修改lineWidth 和 lineCap 线条末端形状
        context2d.strokeStyle = "black";
        context2d.strokeRect(10, 10, 10, 10);
        // 10秒后清除重叠矩形
        setTimeout(function () {
            mycanvas.getContext('2d').clearRect(10, 10, 10, 10);
        }, 10000);
        /* 绘制路径
            arc(x,y,radius,startAngle,endAngle,counterclockwise是否按顺时针放下计算)
            arcTo(x1,y1,x2,y2,radius) 从上一点开始绘制一条弧线
            bezierCurveTo(c1x,c1y,c2x,c2y,x,y) 从上一点开始绘制一条取现，到(x,y)为止，并已(c1x,c1y)和(c2x,c2y)为控制点
            lineTo(x,y) 从上一点开始绘制一条直线，到(x,y)为止
            moveTo(x,y) 将绘图游标移动到(x,y),不画线
            quadraticCurveTo(cx,cy,x,y) 从上一点开始绘制一条二次曲线，到(x,y)为止，并以(cx,cy)作为控制点
            rect(x,y,width,height):从(x,y)开始绘制一个矩形
            closePath() 绘制一条连接到路径起点的线条
            fill()
            stroke()
            clip() 在路径上创建一个剪切区域
         */
        context2d.beginPath();
        context2d.moveTo(30, 30);
        context2d.lineTo(70, 0);
        context2d.strokeStyle = 'green';
        context2d.lineWidth = 5;
        context2d.stroke();
        context2d.closePath();

        // 画一个三角形
        context2d.rotate(Math.PI / 3);
        context2d.beginPath();
        context2d.moveTo(70, 0);
        context2d.lineTo(40, 30);
        context2d.lineTo(100, 30);
        context2d.closePath();
        context2d.fillStyle = 'blue';
        context2d.fill();
        context2d.rotate(-Math.PI / 3);
        // 画一个圆
        context2d.beginPath();
        context2d.arc(50, 50, 50, 0, 2 * Math.PI, false);
        context2d.closePath();
        context2d.fillStyle = 'rgba(100,200,100,0.7)';
        // 这个是变换，看下面注释
        context2d.scale(1.5, 1);
        context2d.fill();
        console.log(context2d.isPointInPath(100, 100));
        /* 绘制文本   fillText() strokeText()  (文本字符串，x,y)
        属性 font  文本样式、大小、字体
        textAlign  start、end、left、right、center
        textBaseLine  top、hanging、middle、alphabetic、ideographic、bottom
        */
        context2d.font = 'bold 18px YaHei';
        context2d.textAlign = 'start';
        context2d.textBaseLine = 'top';
        context2d.fillStyle = 'black';
        context2d.fillText('Hello World', 50, 50);
        context2d.lineWidth = 1;
        context2d.strokeText('Hello Myself', 50, 100);
        /* 变换
        rotate(angle) scale(scaleX,scaleY)  tranlate(x,y) transform(m1_1,m1_2,m2_1,m2_2,dx,dy) 直接修改变换矩阵，方法是乘以如下矩阵
        m1_1 m1_2 dx
        m2_1 m2_2 dy
        0    0    1
        setTransform(m1_1,m1_2,m2_1,m2_2,dx,dy) 将矩阵变换为默认状态，然后再调用transform 
         */
        /* 绘制图像 drawImage(image,x,y,width 可选,height 可选)
         */
        context2d.shadowColor = 'grey';
        context2d.shadowOffsetX = 5;
        context2d.shadowOffsetY = 5;
        context2d.shadowBlur = 10;
        let img = document.images[0];
        context2d.drawImage(img, 0, 0, 40, 40);
        context2d.shadowOffsetX = 0;
        context2d.shadowOffsetY = 0;
        context2d.shadowBlur = 0;
        /* 阴影
        shadowColor shadowOffsetX shadowOffsetY shandowBlur 模糊的像素数，看上面的图片
        兼容性并不是很好 IE ,FF4,Opera11兼容的最好
         */
        /* 渐变
        createLinearGradient(x1,y1,x2,y2)     createRadialGradient(x1,y1,radius1,x2,y2,radius2)
        addColorStop(0-1,color);
         */
        let linearGradient = context2d.createLinearGradient(30, 30, 60, 60);
        linearGradient.addColorStop(0, 'black');
        linearGradient.addColorStop(0.5, 'white');
        linearGradient.addColorStop(1, 'black');
        context2d.fillStyle = linearGradient;
        context2d.fillRect(30, 30, 30, 30);
        //let imageData = context2d.getImageData(0, 0, 30, 30);  注意跨域
        // data[0-3]  red green blue alpha
        /* 合成 globalAlpha  0-1的值，指定所有绘制的透明度 
        globalComposition-Operation  表示后绘制的图形怎么样与先绘制的图形结合
        source-over,source-in,source-out,source-atop,destination-over,destination-in,destination-out,destination-atop,lighter,copy,xor
        */
        /* WebGL 太复杂，不赘述 */
    }
}

/* HTML5 脚本编程 */
/* 跨文档消息传递cross-document messaging XDM    ie8+
postMessage(message,origin) 
message 最好是用字符串形式发送，如果想传json之类的结构化数据，最好先进行JSON.stringify()
第二个参数对保障安全通信非常重要，可以防止浏览器把消息发送到不安全的地方。如果origin不匹配文档来源域，则postMessage()什么都不做
接收到XDM信息的时候，会触发window 对象的message事件。这个事件是以异步形式触发的，触发message处理程序的事件对象包含
data origin source 发送消息的文档的window对象代理  3个部分组成
*/
// window.onmessage = function (event) {
//     if (event.orgin == 'xxx') {
//         // 处理 event.data
//         event.source.postMessage('received', 'yyy');
//     }
// }

/* 原生拖放事件
    拖动某元素时，依次触发：dragstart drag dragend
    被拖动到一个有效的放置目标上时：依次触发 dragenter, dragover, dragleave 或 drop
    dataTransfer 对象 为了实现在拖放操作时实现数据交换 
    getData() setData() 
    dropEffect    none、move、copy、link
    effectAllowed   uninitialized、none、move、copy、link、copyLink、copyMove、linkMove、all 
    
 */
// 拖拽区块设置data
document.getElementById('dragitem').ondragstart = function () {
    event.dataTransfer.setData('text', '我来啦！');
};
// 自定义放置目标，将不允许放置的目标改为允许
document.getElementById('dragtarget').ondragenter = function () {
    event.preventDefault();
};
document.getElementById('dragtarget').ondragover = function () {
    console.log(event.dataTransfer.getData('text'));
    event.preventDefault();
};
/* 媒体元素
属性：autoplay, buffered,bufferedBytes,bufferingRate,bufferingRate,bufferingThrottled,controls,currentLoop,currentSrc,currentTime,defaultPlaybackRate,
duration,ended,loop,muted,networkState,paused,playbackRate,played,readyState,seekable,seeking,src,start,totalBytes,videoHeight,videoWidth,volume
事件：abort,canplay,canplaythrough,canshowcurrentframe,dataunavailable,durationchange,emptied,empty,ended,error,load,loadeddata,loametadata,loadsstart,pause,play,playing,progress,ratechange,seeked,seeking,stalled,timeupdate,volumechange,waiting
检测解码器支持情况： canPlayType() 返回值： probably ,maybe ,""
 */

/* 历史状态管理
现代Web应用中，用户的每次操作不一定会打开一个全新的页面，因此‘后退’和‘前进’按钮就也失去了作用，为了解决这个问题，首选使用‘hashchange’ 事件。HTML5通过更新history对象为管理历史状态提供了方便
histroy.pushState({状态对象},新状态的标题，可选的相对URL)
该方法会把新的状态信息加入历史状态栈，浏览器地址栏也会变成新的相对URL，但是浏览器并不会真的向服务器发送请求，即使状态改变之后查询
location.href 也会返回与地址栏中相同的地址。
replaceState({状态对象},新状态的标题) 
 */

/* 错误处理与调试
try-catch 语句  错误类型：Error EvalError RangeError ReferenceError SyntaxError TypeError URIError
// 调试技术 console对象 error 错误消息，info 消息性消息记录，log 一般消息，warn 警告消息
// 抛出错误 throw new Error('one error')
 */

/* JavaScript与XML 不作赘述 */

/* JSON 序列化对象  JSON.stringify() JSON.parse() */

/* Ajax 与 Comet
    XMLHttpRequest对象
    XHR的用法 open(tpye,URL,isAsynchronous)
    send(data) data:如果不需要通过请求主体发送数据，则必须传入null。
    收到服务器响应之后，响应的数据会自动填充XHR对象的属性
    responseText:作为响应主体被返回的文本
    responseXML:如果响应的内容类型是‘text/xml’或'application/xml'，这个属性中将包含着相应数据的XML DOM文档
    status:响应的HTTP状态
    statusText:HTTP状态的说明
    建议通过status来决定下一步的操作，不要依赖statusText,因为后者在跨浏览器使用时不太可靠。响应主体的内容都会保存到responseText属性中，二人对于非XML数据而言，responseXML属性的值将为null
    通过检测XHR对象的readyState属性，0 尚未open().1 启动,2 发送， 3 接收 ，4 完成。每次readyState属性的值变化都会触发一次readystatechange事件
    // 请求
    GET请求 传入URL末尾的查询字符串必须经过正确的编码 encodeURIComponent()
    POST请求 需要send() 传入某些数据，由于XHRR最初的设计是为了处理XML，因为可以在此传入XML DOM文档，传入的文档经过序列化之后将作为请求主题被提交到服务器。
    默认情况下，服务器对POST请求和提交Web表单的请求并不会一视同仁。我们可以使用XHR来模仿表单提交
*/
// XHR模仿表单提交
function fakeSubmit(url, data) {
    let xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    return xhr;

}
// 辅助添加URL末尾的添加查询字符串参数
function addURLParam(url, name, value) {
    url += (url.indexOf('?') == -1 ? '?' : '&');
    url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
    return url;
}
// 初始化XHR
function initXHRObject() {
    let xhr = new XMLHttpRequest();
    xhr.open('post', 'http://xxx.com/test', false);
    let data = {
        name: '测试数据',
        value: '123'
    };
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 || xhr.status <= 300 || xhr.status == 304) {
                console.log(xhr);
            } else {
                console.log('接口出错！');
            }
        }
    };
    /* HTTP头部信息
    Accept,Accept-Charset,Accept-Encoding,Accept-Language,Connection,Cookie,Host,Referer,User-Agent
    配置方法： setRequestHeader(name,value)设置自定义的请求头部信息
    getResponseHeader(name);
    */
    xhr.setRequestHeader('MyHeader', 'MyValue');
    xhr.timeout = 2000;
    xhr.ontimeout = function () {
        // 取消请求
        xhr.abort();
    }

}

/* XMLHttpRequest 2级
// FormData 类型 支持类型FF4+,Safari 5+, Chrome,Android 3+
 */
function initFormData() {
    let data = new FormData();
    if (data) {
        // 键值对
        data.append('name', 'cwj');
        // 表单元素
        data.append(document.forms[0]);
        //创建了FormData 实例后可以直接传给XHR 的send()方法
    }
}
/* 超时设定 timeout属性
如果超过配置的时间后，会调用 ontimeout 
 */
/* overrideMimeType()
用于重写XHR响应的MIME类型，比如服务器返回的MIME类型是‘text/plain’，但数据中实际包含的是XML。responseXML属性中仍然是null,通过调用overrideMimeType()方法，可以保证把响应当作XML而非纯文本来处理
 */
/* 进度事件
loadstart,progress,error,abort,load,loadend
target 属性指向XHR对象实例
progress事件，包含额外属性 lengthComputable 进度信息是否可用,position 已经接受的字节数,totalSize 根据Content-Length 响应头部确定的预期字节数
 */
/* 跨源资源共享 CORS Cross-Origin Resource Sharing
    CORS背后的基本思想就是使用自定义的HTTP头部让浏览器与服务器进行沟通，从而决定请求或响应是应该成功还是失败。
    比如一个简单的使用GET或者POST发送的请求，他没有自定义的头部，而主题内容是text/plain，在发送该请求时，需要给他附加一个额外的Origin头部，包含请求页面的源信息（协议\域名和端口）
    Origin:http://www.baidu.com
    如果服务器认为这个请求可以接受，就在Access-Control-Allow-Origin头部回发相同的源信息（公共资源。可以回发‘*’）
    Access-Control-Allow-Origin:http://www.baidu.com
    如果没有这个头部，或者有这个头部但源信息不匹配。浏览器就会驳回请求。
    *请求和响应都不包含cookie
    // IE对CORS的实现 XDR类型 XDomainRequest
    cookie 不会随请求发送和响应，只能设置请求头部信息中的Content-Type，不能访问响应头部信息，只支持GET/POST
    XDR对象Open只支持2个参数，只能是异步请求
    // 其他浏览器对CORS的实现，使用标准的XHR对象并在open()方法中传入绝对URL即可
    限制：不能使用setRequestHeader() 设置自定义头部
            不能发送和接收 cookie
            调用getAllResponseHeaders()总会返回空字符串
    带凭据的请求： withCredentials: true
    如果服务器接受带凭据的请求，会用下面的HTTP头部响应：Access-Control-Allow-Credientials:true
    其他跨域技术
    图像Ping：最长用于跟踪用户点击页面或动态广告曝光次数
             缺点：只能给GET，无法访问服务器响应文本
    JSONP(JSON with padding):
        JSONP由2部分组成：回调函数和数据，回调函数是响应到来时应该在页面中调用的函数。回调函数的名字一般是在请求中指定的。而数据就是传入回调函数中的JSON数据
        http://freegeoip.net/json/?callback=handleResponse
        JSONP是通过动态<script>元素来使用的，使用时可以为src属性指定一个跨域URL，因为JSONP是有效的JavaScript代码，所以在请求完成后，即在JSONP响应加载到页面中以后，就会立即执行
        缺点：如果其他域不安全，此时除了完全放弃JSONP调用之外，没有办法追究；其次，要确定JSONP请求是否失败并不容易
 */
// JSONP 举例
function testJSONP() {
    let script = document.createElement('script');
    script.src = 'http://freegeoip.net/json/?callback=handleResponse';
    document.body.appendChild(script);
}
// JSONP 回调
function handleResponse(response) {
    console.log(response);
};

/* Comet
    服务器向页面推送数据的技术，适合处理体育比赛分数和股票报价等
    实现方式：长轮询：页面发送一个服务器请求，然后服务器一直保持连接打开，直到有数据可发送。发送完数据之后，浏览器关闭连接，随即又发起一个到服务器的新请求（优势在于浏览器都支持）
    流： 浏览器向服务器发送一个请求，然后服务器保持连接打开，然后周期性的向浏览器发送数据
    在Firefox,Safari,Opera和Chrome中，通过侦听readystatechange事件以及检测 readyState是否为3，就可以利用XHR对象实现HTTP流
    // 服务器发送事件 SSE 用于创建到服务器的单向连接，服务器通过这个连接可以发送任意数量的数据。服务器响应的MIME类型必须是text/event-stream
 */
function initSSE() {
    var source = new EventSource('myevents.php');
    /* 属性 readyState： 0 正连接到服务器 1 打开了连接 2 关闭了连接 
    事件 open message error 
    服务器发回的数据以字符串的形势保存在event.data中
     */
    source.onmessage = function () {
        console.log(event.data);
    }
    source.close();
    // 通过id：前缀可以给特定的事件指定一个关联的ID，设置了ID之后，EventSource 对象会跟中上一次触发的事件。如果连接断开，会向服务器发送一个包含名为 Last-Event-ID的特殊HTTP头部请求，以便服务器知道下一次该触发哪个事件
};
/* Web Sockets
只能通过连接发送纯文本数据，对于复杂的数据结构，需要发送前进行序列化
 */
function initWebSockets() {
    // ws 未加密协议，wss 加密协议， 必须传入绝对路径，不受同源策略影响
    let socket = new WebSocket('ws://www.example.com/sever.php');
    /* 属性：OPENING(0) OPEN(1) CLOSING(2) CLOSE(3)
    没有readystatechange事件
     */
    let data = {
        name: 'cwj'
    };
    socket.send(JSON.stringify(data));
    socket.onmessage = function (event) {
        console.log(event.data);
    };
}

/* 高级技巧
 */
// 安全的类型检测 由于原生数组的构造函数名与全局作用域无关，因此使用toString()就能返回一直的值
function isArray(value) {
    // 检测原生函数或正则表达式，JSON类似 [object Function] [object RegExp]
    return Object.prototype.toString.call(value) == '[object Array]';
}
/* 作用域安全的构造函数
    如果没有用new ，属性会被映射到window 上
    所以需要校验this对象确实是正确类型的实例
*/
function SaveClass(key, value) {
    if (this instanceof SaveClass) {
        this.key = key;
        this.value = value;
    } else {
        return new SaveClass(key, value);
    }
}
/* 惰性载入函数 主要处理浏览器差异多个if
    一旦一次判断之后，修改该函数。避免重复判断if
 */
function LasyLoad() {
    if (typeof XMLHttpRequest == 'undefined') {
        LasyLoad = function () {
            return new XMLHttpRequest();
        };
    } else if (typeof ActiveXObject != 'undefined') {
        LasyLoad = function () {
            if (typeof arguments.callee.activeXString != 'string') {
                // ...
            }
        }
    } else {
        LasyLoad = function () {
            throw new Error('No XHR object available.');
        }
    }
}
/* 函数绑定
可以在特定的this环境中以指定参数调用另一个函数，该技巧常常和回调函数与事件处理程序一起使用，以便在将函数作为变量传递的同时保留代码执行环境。
 */
let handler = {
    message: 'Event Handled',
    handleClick: function (event) {
        console.log(this.message);
    }
}
// 需要创建闭包保存环境，这样会令代码难于理解和调试
document.getElementById('myBtn').onclick = function (event) {
    handler.handleClick(event);
}

// 所以实现了一个函数叫bind,bind() 创建了一个闭包，闭包使用apply()调用传入的函数，并给apply() 船体context对象和参数。注意这里使用的arguments对性爱那个是内部函数的，而非bind()的
function bind(fn, context) {
    return function () {
        return fn.apply(context, arguments);
    }
}
// 所以上述事件处理程序绑定可以改为
document.getElementById('myBtn').onclick = bind(handler.handleClick, handler);

/* 函数柯里化 */
/* 防篡改对象*/
let tamperProofObject = {
    name: '防篡改对象！'
}
// 禁止给对象添加属性和方法
Object.preventExtensions(tamperProofObject);
// 密封 seal 不能删除属性和方法
Object.seal(tamperProofObject);
// 冻结 freeze  如果定义[[Set]] 函数，访问器属性仍然是可写的
Object.freeze(tamperProofObject);

/* 离线应用与客户端储存 */
// 离线检测
console.log(navigator.onLine ? '有网' : '断网');
/* 应用缓存 appcache
Appcache 就是从浏览器的缓存中分出来的一块缓存区。要想在这个缓存中保存数据，可以使用一个 描述文件(manifest file),列出要下载和缓存的资源 举例
CACHE MANIFEST 
#Comment
file.js
file.css
要将描述文件与页面关联起来，可以在<html>中的manifest属性中指定这个文件的路径
<html manifest ="offline.manifest"> MIME类型必须是 text/cache-manifest 文件拓展名现在推荐是 appcache
虽然应用缓存的意图是确保离线时资源可用，但也相应的API让你知道它都在做什么。这个API的核心是applicationCache对象，这个对象有一个属性status常量，表示应用缓存的如下当前状态
0 无缓存，1 限制，应用缓存未得到更新 2 检查中，正在下载描述文件并检查更新 3 下载中 4 更新完成 5 废弃
事件: checking error noupdate  downloading progress updateready cached
*/

/* 数据存储
cookie 当设定了一个cookie后，再给创建他的域名发送请求时，都会包含这个cookie。 这个限制确保了储存在cookie中的信息只能让批准的接受者访问，而无法被其他域访问
cookie 的构成
名称：不区分大小写
值：必须经过URL编码
域：cookie对于哪个域是有效的。所有向该域发送的请求中都会包含这个cookie信息。这个值可以包含子域 
路径： 对于指定域中的那个路径，应该向服务器发送cookie
失效时间： 表示cookie何时应该被删除的时间戳，默认是会话结束时即将所有cookie删除，不过也可以自己设置删除时间，GMT格式(Wdy,DD-Mon-YYYY HH:MM:SS GMT)
安全标志：指定后，cookie只有在使用SSL连接的时候才发送到服务器
  */
var cookieUtil = {
    get: function (name) {
        let cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if (cookieStart > -1) {
            let cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    set: function (name, value, expires, path, domain, secure) {
        let cookieText = '';
        if (name && value && name.length != 0 && name.length == value.length) {
            for (let i = 0, len = name.length; i < len; i++) {
                cookieText += (encodeURIComponent(name[i]) + '=' + decodeURIComponent(value[i]) + ';');
            }
            cookieText = cookieText.substring(0, cookieText.length - 1);
            if (expires instanceof Date) {
                cookieText += ';expires=' + expires.toGMTString();
            }
            if (path) {
                cookieText += ';path=' + path;
            }
            if (domain) {
                cookieText += ';domain=' + domain;
            }
            if (secure) {
                cookieText += ';secure';
            }
            document.cookie = cookieText;
            document.getElementById('message').textContent = 'cookie设置成功！';
        } else {
            throw new Error('Set Cookie Faild!Please check your arguments')
        }
    },
    unset: function (name, path, domain, secure) {
        this.set([''], [''], new Date(0), path, domain, secure);
    }
}
/* Storage类型
clear() getItem(name) key(index) removeItem(name) setItem(name, value) */
/* IndexedDB
Indexed DataBase API是在浏览器中保存结构化数据的一种数据库
IndexedDB设计的操作完全是异步进行的。因此大多数操作会以请求方式进行，但这些操作会在后期执行。
IndexedDB 最大的特色是使用对象保存数据，而不是用表来保存数据
*/
let database;

function initDB() {
    //浏览器都使用提供商前缀 所以获取indexedDB时需要下面那段代码
    let indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
    // 打开数据库，如果不存在则会创建该数据库,默认是没有版本号的，最好一开始就为数据库指定一个版本号
    let dbResult = indexedDB.open('test', 2);
    dbResult.onerror = function (event) {
        /* errorCode  UNKNOW_ERR(1) 意外错误
                      NON_TRANSIENT_ERR
                      NOT_FOUNT_ERR
                      CONSTRAINT_ERR
                      DATA_ERR
                      NOT_ALLOWED_ERR
                      TRANSACTION_INACTIVE_ERR
                      ABORT_ERR
                      READ_ONLY_ERR
                      TIMEOUT_ERR
                      QUOTA_ERR                   
        */
        throw new Error('something bad had happened while trying to open:' + event.target.errorCode);
    }
    dbResult.onsuccess = function (event) {
        database = event.target.result;
    }
    dbResult.onupgradeneeded = function (event) {
        database = event.target.result;
        let users = [];
        let responses = [];
        for (let i = 0; i < 5; i++) {
            let userTemp = {};
            userTemp.name = `name${i}`;
            userTemp.value = i;
            users.push(userTemp);
        }
        let store = database.createObjectStore('users', {
            keyPath: 'name'
        });
        for (let i = 0; i < users.length; i++) {
            let res = store.add(users[i]);
            res.onerror = function () {
                throw new Error('something bad had happened while trying to open:' + event.target.errorCode);
            };
            res.onsuccess = function () {
                console.log('成功添加user' + i);
            };
            responses.push(res);
        }
    }
}
// 事务以get举例 
/* add() put() get() delete()  clear() */
function getDataToDB(tableName, key) {
    let IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    // 第二个参数是事务类型 0只读，1读写 2 改变
    let transaction = database.transaction(tableName, 'readonly');
    let req = transaction.objectStore(tableName).get(key);
    req.onerror = function (event) {
        throw new Error('something bad had happened!');
    }
    req.onsuccess = function (event) {
        console.log(event.target.result);
    }
    transaction.onerror = function () {
        throw new Error('something bad had happened!');
    }
    transaction.oncomplete = function () {
        // 整个事务都完成了
        console.log('transaction completed!')
    }
}
// 使用游标查询
function userCursor(tableName) {
    let IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    // 第二个参数是事务类型 0只读，1读写 2 改变
    let transaction = database.transaction(tableName, "readwrite");
    let store = transaction.objectStore(tableName);
    // 开启游标
    let req = store.openCursor();
    req.onsuccess = function (event) {
        /* IDBCursor  direciton ：表示游标移动的方向，默认值是IDBCursor.NEXT(0) 表示下一项
        IDBCursor.NEXT_NO_DUPLICATE(1)   PREV(2) PREV_NO_DUPLICATE
        key 对象的键  value 实际的对象 primaryKey 游标使用的键 
        可以调用update() delete() continue(key) advance(count)
        */
        let cursor = event.target.result;
        let changeItem = cursor.value;
        changeItem.value = 'new value';
        let updateReq = cursor.update(changeItem);
        updateReq.onsuccess = function (event) {
            console.log('update success!');
        }
        updateReq.onerror = function (event) {
            console.log('update faild!');
        }
        console.log(cursor);
    }
    req.onerror = function () {
        throw new Error('something bad had happened!');
    }
}
// 对象拼接字符串
function obj2searchURL(obj) {
    if (obj && typeof obj == 'object') {
        var str = '?'
        for (var item in obj) {
            str += item + '=' + obj[item]+'&';
        };
        return encodeURIComponent(str.trimEnd('&'));
    } else {
        throw new Error('you params is not an object')
    }
}