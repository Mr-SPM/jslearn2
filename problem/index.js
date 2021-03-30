// curry
// 柯里化就是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

function curry(fn) {
  const length = fn.length;
  return function f() {
    if (length > arguments.length) {
      return f.bind(null, ...arguments);
    } else {
      return fn.apply(null, arguments);
    }
  };
}

// 实现new

function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype); // 创建一个基于fn的原型的对象作为新对象
  const res = fn.apply(obj, args); // 把函数的this 指向obj
  return res instanceof Object ? res : obj; // 如果函数有返回值则返回对应值，不然返回新对象
}

// 实现instanceOf

function instance_of(L, R) {
  let p = R.prototype;
  let o = L.__proto__;
  while (true) {
    // 遍历到了最底层
    if (o === null) {
      return false;
    }
    if (o === p) {
      return true;
    }
    // 取继承的原型
    o = o.__proto__;
  }
}

// jsonp
function jsonp(options) {
  // 创建script标签
  scriptNode = document.createElement('script');
  const url = `${options.url}?callback=${options.callback.name}`;
  scriptNode.src = url;
  scriptNode.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(scriptNode);
}

// 实现sleep函数
function sleep(timer) {
  return new Promise((resolve) => setTimeout(resolve, timeer));
}

// 实现call,apply es6
// 其实应该加对context的判断，非对象时，赋值window
Function.prototype.myCall = function (context, ...params) {
  const fn = Symbol();
  context[fn] = this;
  context[fn](params);
  delete context[fn];
};

Function.prototype.myApply = function (context, params) {
  const fn = Symbol();
  context[fn] = this;
  context[fn](...params);
  delete context[fn];
};
