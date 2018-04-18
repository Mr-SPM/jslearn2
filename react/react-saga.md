# React-saga
react-saga 是用于让程序副作用更简单去管理的库，更高效的去执行，让测试变得简单，并且更好的处理异常。
举例： 那些异步的东西比如数据获取data fetching 或者不纯(impure)的东西比如获取浏览器缓存  
一个saga在应用程序中是一个独立线程，他单独负责副作用。redux-saga是一个redux中间件，这意味着这个线程在主程序使用通常的redux action时被启动，暂停或者取消，他可以访问整个redux应用程序state,所以也可以dispatch redux actions。  
他使用ES6的Generators特性使异步流程更加容易去阅读，编写和测试。他可以让那些异步流程看起来像标准的同步JavaScript代码。（有点像 async/await,但是generators拥有一些我们需要的酷炫特性）  
你可能在已经使用了 redux-thunk 在你处理data fetch的时候，与redxu thunk 相反，你不会在回调地狱中被结束，你可以轻松测试异步流程并让你的action保持纯粹。  

# 开始使用

## 安装
```
$ npm install --save redux-saga
```
或
```
$ yarn add redux-saga
```
另外，你可以直接在HTML页面的&lt;script&gt;中使用提供的UMD版本。

## 使用例子
假设我们有一个UI界面上的一个按钮点击需要从一个远程服务器中去获取一些用户数据。（简短起见，我们只会展示action触发代码）
```js
class UserComponent extends React.Component {
  ...
  onSomeButtonClicked() {
    const { userId, dispatch } = this.props
    dispatch({type: 'USER_FETCH_REQUESTED', payload: {userId}})
  }
  ...
}
```
组件dispatches 一个简单的Object action 给 store。我们会创建一个Saga 去观察所有 USER_FETCH_REQUESTED actions 然后 触发一个API去fecth 用户数据
```js
// sagas.js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from '...'

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// 收到 USER_FETCH_REQUESTED actions 时将被触发
function* fetchUser(action) {
   try {
      const user = yield call(Api.fetchUser, action.payload.userId);
      yield put({type: "USER_FETCH_SUCCEEDED", user: user});
   } catch (e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message});
   }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
  每一个`USER_FETCH_REQUESTED` action将会开始 fetchUser
  允许并发获取数据
*/
function* mySaga() {
  yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

/*
  Alternatively you may use takeLatest.
  另外你可能使用takeLatest方法，此方法只会发出一个最新的请求。
  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.

*/
function* mySaga() {
  yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
}

export default mySaga;
```

运行我们的Saga，我们需要使用 redux-saga 中间件将Saga和我们的Redux Store连接。
```js
// main.js
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import reducer from './reducers'
import mySaga from './sagas'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

// then run the saga
sagaMiddleware.run(mySaga)

// render the application
```