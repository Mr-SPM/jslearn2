# redux 进阶
## 中间件
在redux1里面，我们考虑的都是同步情况，但是如果是一个异步操作，action发出以后，如果想要过一段时间再执行reducer就办不到了，所以这个时候需要有中间件来承担这个问题。  
所以这里中间件的定义就是对store.dispatch方法进行改造，在发出Action和执行Reducer这2步中间添加了一些功能。  

## 中间件的使用 applyMiddleware
```js
import { applyMiddleware, createStore } from 'redux';
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);
```
### applyMiddleware()
它是 Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行。
```js
// 源码
export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    var store = createStore(reducer, preloadedState, enhancer);
    var dispatch = store.dispatch;
    var chain = [];

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {...store, dispatch}
  }
}
```

## 异步操作的基本思路
同步操作只要发出一种 Action 即可，异步操作的差别是它要发出三种 Action。
- 操作发起时的 Action
- 操作成功时的 Action
- 操作失败时的 Action

所以相应的，异步操作的state也要进行改造，反应不同的操作状态。
```js
let state = {
  // ... 
  // 是否正在抓取数据
  isFetching: true,
  // 数据是否过时
  didInvalidate: true,
  // 最后一次更新的时间
  lastUpdated: 'xxxxxxx'
};
```
这样的话，整个异步操作的流程就是这样：  
1. 异步操作开始时送出Action，触发state更新为“正在操作”状态，view重新渲染
2. 操作结束后，再送出一个Action，触发State更新为“操作结束”，view再一次重新渲染  

> 这里有一个疑问，大部分异步操作，其实只是需要一个异步操作后的状态然后执行view的更新渲染。那如何去做到再异步操作后才去执行view渲染。减少不必要的渲染次数。

## 如何做到在异步操作之后再dispatch一个新的action？
下面代码距离，在react某个组件挂载之后，异步fetch数据
```js
class AsyncApp extends Component {
  componentDidMount() {
    const { dispatch, selectedPost } = this.props;
    // 这里的fetchPosts就是一个action creator
    dispatch(fetchPosts(selectedPost))
  }
```
官方action creator 举例
```js
// 官方异步action 举例
export function fetchFriends() {
    return dispatch => {
        dispatch({type:'FETCH_FRIENDS'});
        return fetch('http://localhost/api/friends').then(response => response.json()).then(json => {
            dispatch({type:'RECEIVE_FRIENDS',payload:json})
        })
    }
}
// 使用方法 
// 使用方法一
store.dispatch(fetchFriends('reactjs'));
// 使用方法二
store.dispatch(fetchFriends('reactjs')).then(() =>
  console.log(store.getState())
);
```
该action creator返回一个函数。这个函数执行后，先发出第一个action（**dispatch({type:'FETCH_FRIENDS'});**），然后进行异步操作，拿到结果后转成json格式，再发出一个action（**dispatch({type:'RECEIVE_FRIENDS',payload:json})**）。

这里有几个方面要注意：
1. 该creator与普通的action creator不同，返回的是一个函数。
2. 返回的参数是dispatch 这个react方法。
3. 在返回函数中，先发出一个action，表示开始
4. 异步操作结束后，再发出一个action表示结束。

> 这里有一个问题,Action由store.dispatch发送，而dispatch正常情况下，参数只能是一个对象而不是函数。  
所以这时候又需要一个中间件[**react-thunk**](https://github.com/gaearon/redux-thunk)。该中间件允许store.dispatch能够接受函数作为参数。

### react-thunk 
react-thunk 允许开发者写 action creators 返回一个函数来取代一个普通action对象。这个thunk可以用来延迟dispatch 一个 action,或者只在某个特定条件满足的情况下dispatch。其内部函数接受2个store方法作为参数**dispatch,getState**。上面的例子只用到了dispatch。上面的例子创建了一个异步action creator。下面再举一个满足特定条件才触发的action creator。
```js
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}
```

## redux-promise 中间件
延续上面的react-thunk允许了action creator 返回函数，那么我们可以考虑返回Promise对象。
```js
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import reducer from './reducers';

const store = createStore(
  reducer,
  applyMiddleware(promiseMiddleware)
); 
```
这个中间件允许store.dispatch方法可以接受一个Promise对象作为参数。
下面有2种方案：
```js
// 返回值是一个Promise
const fetchPosts = 
  (dispatch, postTitle) => new Promise(function (resolve, reject) {
     dispatch(requestPosts(postTitle));
     return fetch(`/some/API/${postTitle}.json`)
       .then(response => {
         type: 'FETCH_POSTS',
         payload: response.json()
       });
});

// payload是一个Promise
import { createAction } from 'redux-actions';

class AsyncApp extends Component {
  componentDidMount() {
    const { dispatch, selectedPost } = this.props
    // 发出同步 Action
    dispatch(requestPosts(selectedPost));
    // 发出异步 Action
    dispatch(createAction(
      'FETCH_POSTS', 
      fetch(`/some/API/${postTitle}.json`)
        .then(response => response.json())
    ));
  }
```
第二种方案需要从**react-actions**模块引入creatAction方法。  
```js
export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    return isPromise(action.payload)
      ? action.payload.then(
          result => dispatch({ ...action, payload: result }),
          error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          }
        )
      : next(action);
  };
}
```
如果 Action 本身是一个 Promise，它 resolve 以后的值应该是一个 Action 对象，会被dispatch方法送出（action.then(dispatch)），但 reject 以后不会有任何动作；如果 Action 对象的payload属性是一个 Promise 对象，那么无论 resolve 和 reject，dispatch方法都会发出 Action。