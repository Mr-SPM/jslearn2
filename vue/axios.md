# 在VUE中使用axios
1. VUE 引入 axios
```
npm install axios -s
```
2. axios 使用方式
   - 需要使用的模块主动引入 axios
     ```js
        import axios from 'axios'
     ```
   - 在VUE原型上加入axios
      ```js
        Vue.prototype.$axios = axios;
        // 模块中可以直接
        this.$axios.get(url) //...
      ```
