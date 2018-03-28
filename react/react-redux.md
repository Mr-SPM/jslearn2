# React-Redux
## UI组件
1. 只负责UI的呈现，不带有任何业务逻辑
2. 没有状态
3. 所有数据都是由参数（this.props）提供
4. 不适用任何redux的API

## 容器组件
1. 负责管理数据和业务逻辑，不负责UI的呈现
2. 带有内部状态
3. 使用Redux的API

> 如果一个组件既有UI又有业务逻辑，那么需要把它拆分成外面一个容器组件，内部包含一个UI组件。前者负责与外部的通信。将数据传给后者，二人后者渲染视图。所有的UI组件由用户提供，而容器组件则交给React-Redux自动生成。

## connect()
connect()方法用于从UI组件生成容器组件。  
一个完整的connect方法。下面举例
```js
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
```
一个完整的方法，需要具备
- 输入逻辑： 外部的数据（即state对象）如何转换为 UI 组件的参数
- 输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。

## mapStateToProps() 输入逻辑
它的作用就是一个从外部的state对象到UI组件的props对象的映射关系。  
作为函数，mapStateToprops执行后应该返回一个对象，里面的每一个键值对就是一个映射。
```js
const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```
mapStateToProps 会跟踪Store，每当state更新的时候，就会自动执行，重新计算UI组件的参数，从而触发UI组件的重新渲染。
mapStateToProps 的第一个参数总是state对象，第二参数可选，代表容器组件的props对象。
```js
const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}
```
connect方法可以省略mapStateToProps参数，那样的话，UI 组件就不会订阅Store，就是说 Store 的更新不会引起 UI 组件的更新。  


## mapDispatchToProps()
mapDispatchToProps是connect函数的第二个参数，用来建立 UI 组件的参数到store.dispatch方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。
如果mapDispatchToProps是一个函数，会得到dispatch和ownProps（容器组件的props对象）两个参数。

const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}
如果mapDispatchToProps是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数，会被当作 Action creator ，返回的 Action 会由 Redux 自动发出。
```js
const mapDispatchToProps = {
  onClick: (filter) => {
    type: 'SET_VISIBILITY_FILTER',
    filter: filter
  };
}
```  

## Provider组件
connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成 UI 组件的参数。

一种解决方法是将state对象作为参数，传入容器组件。但是，这样做比较麻烦，尤其是容器组件可能在很深的层级，一级级将state传下去就很麻烦。

React-Redux 提供Provider组件，可以让容器组件拿到state。
```js
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```
上面的代码，在根组件（APP）外面包了一层Provider组件，这样依赖，App的所有子组件就默认都可以拿到state了。  
下面是子组件获取store的方法。
```js
class VisibleTodoList extends Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  render() {
    const props = this.props;
    const { store } = this.context;
    const state = store.getState();
    // ...
  }
}

VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}
```

参考链接： [Redux入门教程-阮一峰](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html)