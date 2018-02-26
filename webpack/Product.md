# 生产环境构建
## 配置
> 开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。  
虽然，以上我们将生产环境和开发环境做了略微区分，但是，请注意，我们还是会遵循不重复原则(Don't repeat yourself - DRY)，保留一个“通用”配置。为了将这些配置合并在一起，我们将使用一个名为 webpack-merge 的工具。通过“通用”配置，我们不必在环境特定(environment-specific)的配置中重复代码。
### [webpack-merge](https://github.com/survivejs/webpack-merge)
> webpack-merge提供了一个合并函数，用于连接数组并合并创建新对象的对象。 如果遇到函数，它将执行它们，通过算法运行结果，然后将返回的值再次包含在函数中。 这种行为在配置webpack时特别有用，尽管它已经超越了它。 无论何时需要合并配置对象，webpack-merge都可以派上用场。 还有一个名为merge.smart的webpack特定合并变体，它能够考虑webpack特定的细节。
* 安装
```
npm install --save-dev webpack-merge
```
* 使用
```
// webpack.common.js
// webpack.dev.js
// webpack.prod.js
```

## 特定环境
>许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容。例如，当不处于生产环境中时，某些 library 为了使调试变得容易，可能会添加额外的日志记录(log)和测试(test)。其实，当使用 process.env.NODE_ENV === 'production' 时，一些 library 可能针对具体用户的环境进行代码优化，从而删除或添加一些重要代码。我们可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量。