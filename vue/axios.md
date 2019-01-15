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


#  在typescript中实现axios接口封装

1.  新建文件**request.ts**  
    文件目录介绍：
    ```
    -api
        - main.ts   // 实际调用
    -utils
        - request.ts  // 接口封装
    ```

2. request.ts 文件解析
   ```typescript
    // 默认利用axios的cancelToken进行防重复提交。
    // 如需允许多个提交同时发出。则需要在请求配置config中增加 neverCancel 属性，并设置为true

    import axios from 'axios';
    // import store from '../store/index';
    // import { getSessionId } from '@/utils/auth';

    /* 防止重复提交，利用axios的cancelToken */
    let pending: any[] = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
    const CancelToken: any = axios.CancelToken;



    const removePending: any = (config: any, f: any) => {
        // 获取请求的url
        const flagUrl = config.url;
        // 判断该请求是否在请求队列中
        if (pending.indexOf(flagUrl) !== -1) {
            // 如果在请求中，并存在f,f即axios提供的取消函数
            if (f) {
                f('取消重复请求'); // 执行取消操作
            } else {
                pending.splice(pending.indexOf(flagUrl), 1); // 把这条记录从数组中移除
            }
        } else {
            // 如果不存在在请求队列中，加入队列
            if (f) {
                pending.push(flagUrl);
            }
        }
    };

    /* 创建axios实例 */
    const service = axios.create({
        timeout: 5000, // 请求超时时间
    });

    /* request拦截器 */
    service.interceptors.request.use((config: any) => {
        // neverCancel 配置项，允许多个请求
        if (!config.neverCancel) {
            // 生成cancelToken
            config.cancelToken = new CancelToken((c: any) => {
                removePending(config, c);
            });
        }
        // 在这里可以统一修改请求头，例如 加入 用户 token 等操作
        //   if (store.getters.sessionId) {
        //     config.headers['X-SessionId'] = getSessionId(); // 让每个请求携带token--['X-Token']为自定义key
        //   }
        return config;
    }, (error: any) => {
        Promise.reject(error);
    });

    /* respone拦截器 */
    service.interceptors.response.use(
        (response: any) => {
            // 移除队列中的该请求，注意这时候没有传第二个参数f
            removePending(response.config);
            // 获取返回数据，并处理。按自己业务需求修改。下面只是个demo
            const res = response.data;
            if (res.code !== 200) {
                if (res.code === 401) {
                    if (location.hash === '#/') {
                        return res;
                    } else {
                        location.href = '/#/';
                    }
                }
                return Promise.reject('error');
            } else {
                return response;
            }
        },
        (error: any) => {
            // 异常处理
            console.log(error)
            pending = [];
            if (error.message === '取消重复请求') {
                return Promise.reject(error);
            }
            return Promise.reject(error);
        },
    );

    export default service;
   ```
## 接口地址与网站部署地址不同？跨域？？？  
   本人在实际开发的时候，网站被部署在**http://www.demo.com**，而这个时候后端要求我，请求地址域名为"https://www.demo.com"。上面的request封装就不能满足了，这时候第一个考虑，axios的配置项**baseUrl**，下面修改代码:
   ```typescript
   const service = axios.create({
  +      baseURL: process.env.BASE_URL, // 基础地址
        timeout: 5000, // 请求超时时间
    });
   ```
###  process.env 配置
上面的代码，我增加了 baseUrl配置项，并根据nodejs 环境变量，生成不同的前缀。
### [dotenv 配置文件写入process.env](https://github.com/motdotla/dotenv)  

## vue-cli3 支持这种方式
在项目根目录创建如下文件，并配置
```
.env 默认
.env.production   生产环境>默认
```
```
.env
BASE_URL=/
.env.procution
BASE_URL=https://www.demo.com
```
