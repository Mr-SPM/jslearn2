# dva.js 总结

## dva-loading 
> 这是dva-loading 插件用于自动处理loading状态的插件  
### 结构解析
```js
loading: {
    global: false,  // 全局
    models: {
        app: false,  // models 绑定的models
        todo: false,
    },
    effects: {
        'get/sss'   // models 内部的 effect异步  loading 
    }
}
```

### 使用方法
在router components 组件内使用connect 绑定

```js
export default connect(({ organization, loading }) => ({
    organization,
    loading: loading.models.app,   // 绑定了 app models 的loading
}))(Form.create()(OrganizationList));
// 绑定 models 内部的 effects 的loading 状态， 如果整个模块只有一个表单这类，并且只有一个effect异步，可以单纯绑定effect事件。
export default connect(({ form, loading }) => ({
    form,
    effectsLoading: loading.effect['effectType']  
}))(Form.create()(OrganizationList));
```