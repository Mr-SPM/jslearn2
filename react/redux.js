import { createStore } from 'redux';
const store = createStore(fn)

const action = {
    type: 'ADD',
    payload: 'some thing need to be added'
}

const ADD = 'Add';
function addCreator(payload) {
    return {
        type: Add,
        payload
    }
}
const action = addCreator('some thing need to be added')

// 我的尝试（动态action creator）
// 必填参数type,data作为自由配置数据，可不填。
function actionCreators(type, data) {
    return {
        type,
        ...data
    }
}

// 初始state
const defualtState = {
    // ...
}
// reducer 定义
const reducer = (preState = defualtState,action)=> {
    switch(action.type) {
        case anyType : (preState,action) => {
            // 各种操作，比如
            const newState = Object.assign({},preState,action.payload)
            return newState;
        }
        defualt: return state
    }
}

import { createStore } from 'redux';
const store = createStore(reducer);
// 该方法会返回一个注销函数。调用这个函数就可以解除监听。
const destory = store.subscribe(listener);
destory();


// 官方异步action 举例
export function fetchFriends() {
    return dispatch => {
        dispatch({type:'FETCH_FRIENDS'});
        return fetch('http://localhost/api/friends').then(response => response.json()).then(json => {
            dispatch({type:'RECEIVE_FRIENDS',payload:json})
        })
    }
}
