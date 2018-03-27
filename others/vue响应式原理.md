# VUE响应式原理

## 追踪变化
1. 当我们把一个JS对象传入VUE实例的data选项后，VUE会利用**Object.defineProperty**方法，给每个属性转为**getter/setter**。每个组件都会有一个Watcher实例对象，而当setter调用时，则会触发Watcher重新计算。
2. Watcher调用关联的组件渲染方法（Component Render Function）进行更新Virtual DOM Tree。
3. Virtual DOM 操作（DIFF,应用PATCH）。

> 注意:由于JavaScript的限制，并废除了Object.observe方法， 所以VUE无法检测到对象属性的添加和删除。而只有在初始化的时候VUE才会给data进行getter/setter配置，所以后续添加的属性无法获得响应式处理。不过，可以使用 **Vue.set(object, key, value)** 将响应属性添加到对象上。

## 异步更新队列
1. 如果同一个watch被多次触发，只会在事件队列中推入一个。在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部尝试对异步队列使用原生的 Promise.then 和 MessageChannel，如果执行环境不支持，会采用 setTimeout(fn, 0) 代替。  
例如，当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。  
2. Vue.nextTick(callback) 在数据变化完成DOM渲染后，执行回调函数。
```js
// 2种使用方式
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})

// 组件内实现，不需要全局VUE，
Vue.component('example', {
  template: '<span>{{ message }}</span>',
  data: function () {
    return {
      message: '没有更新'
    }
  },
  methods: {
    updateMessage: function () {
      this.message = '更新完成'
      console.log(this.$el.textContent) // => '没有更新'
      this.$nextTick(function () {
        console.log(this.$el.textContent) // => '更新完成'
      })
    }
  }
})
```