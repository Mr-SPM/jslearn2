# Redux
redux适用场景：  
+ 用户的使用方式复杂
+ 不同身份的用户有不同的使用方式
+ 多个用户间可以协作
+ 与服务器有大量交互，使用WebSocket
+ View要从多个来源获取数据  

从组件角度看:
+ 某个组件的状态需要共享
+ 某个状态需要在任何地方都可以拿到
+ 一个组件需要改变全局状态
+ 一个组件需要改变另一个组件的状态

## 设计思想
1. Web应用是一个状态机，视图与状态一一对应
2. 所有的状态保存在一个对象里面

## 基本概念和API
### Store
Store 就是一个保存数据的容器。整个应用只能有一个。
Redux 提供 **createStore**函数来生成Store。接受一个函数作为必选参数，用于返回store对象。而可选的第二参数可以设置整个应用的状态初始值，这个值会覆盖下面方法Reducer的默认初始值。
```js
import {createStore} from 'redux';
const store  = createStore(fn)
```

### State
State 就是某个时间点上的Store数据集合快照。
Redux 提供**getState**函数用来获取当前的state。一个state严格对应一个view。

### Action
State变化会导致View变化。而State的变化是由View变化导致，所以View需要使用Action发出通知，表示State需要变化。
Action是一个对象，其中**type**是必须的，表示Action的名称。其他属性可以自由设置。
下面是一个Action的例子
```js
const action = {
    type: 'ADD',
    payload: 'some thing need to be added'
}
```
> Action描述当前发生的事，改变State的唯一办法就是使用Action。他会把数据搬送到Store。

### Action Creator
View要发送多少种消息，就会有多少种Action。所以可以定义一个创建Action的函数作为Action创造器。
```js
const ADD = 'Add';
function addCreator(payload) {
    return {
        type: Add,
        payload
    }
}
const action = addCreator('some thing need to be added')
```
**上面那种方法，如果我有多种action type 那我还是需要创建多个action生成函数，那么我可不可以去创建一个函数动态生成各种类型的Action Creator**，下面是我的代码尝试(利用ES6对象的解构赋值):
```js
// 必填参数type,data作为自由配置数据，可不填。
function actionCreators(type, data) {
    return {
        type,
        ...data
    }
}
```

### store.dispatch()
改方法是View 发出Action 的唯一方法。接受一个Action对象作为参数。

### Reducer
Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。
> 注意： Reducer实际运用中，store.dispatch()会触发Reducer，所以Store需要知道Reducer函数。所以在store生成的时候，需要将Reducer传入createStore方法。那么，初始化store的方法也需要写在reducer的方法中。所以代码会像下面的例子那样：
```js
// 初始state
const defualtState = {
    // ...
}
// reducer 定义
const reducer = (preState = defualtState,action)=> {
    switch(action.type) {
        case anyType : (preState,action) => {
            // 各种操作，比如
            const newState = Object.assign({},preState,action.payload);
            // 或者
            const newState = {...preState,...action.payload};
            return newState;
        }
        // 初始化的情况，直接返回初始化state作为store
        defualt: return state
    }
}
```
> 注意：最好把State对象设成只读。要得到新的State唯一的办法就是生成一个新的对象。  

### store.subscribe()
该方法用于设置监听函数，一旦state发生变化，就自动执行这个函数。  
```js
import { createStore } from 'redux';
const store = createStore(reducer);
// 该方法会返回一个注销函数。调用这个函数就可以解除监听。
const destory = store.subscribe(listener);
destory();
```

## Store的实现
Store 提供的方法：
+ store.getState()
+ store.dispatch()
+ store.subscribe()

```js
import { createStore } from 'redux';
let { subscribe, dispatch, getState } = createStore(reducer);
```

## Reducer的拆分
Redux 提供了一个**combineReducers**函数，用于Reducer的拆分。只要定义各个子reducer函数，然后用这个函数将它们合成一个大的Reducer。
```js
import { combineReducers } from 'redux';

const chatReducer = combineReducers({
  chatLog,
  statusMessage,
  userName
})

export default todoApp;
```
> 注意，这个写法有一个前提，就是State属性名必须和子Reducer同名。如果不同的话，请采用下面那种方法：  
```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
// 等同于
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
```

## 项目中的用法
可以把所有的子Reducer放在一个文件内，然后统一引入
```js
import { combineReducers } from 'redux'
import * as reducers from './reducers'

const reducer = combineReducers(reducers)
```

# 流程
下面梳理整个redux实现流程
1. View触发action,store.dispatch()
2. store调用Reducer，返回新的state
3. store.subscribe()监听到state变化，触发回调，（渲染view）