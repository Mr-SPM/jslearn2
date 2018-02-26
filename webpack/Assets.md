# 管理资源
## 加载CSS
> 加载CSS文件，需要在**module**中配置
1. 加载最简单的CSS文件
```
npm install --save-dev style-loader css-loader
```
```js
module: {
     rules: [
       {
         test: /\.css$/,
         use: [
           'style-loader',
           'css-loader'
         ]
       }
     ]
   }
```
2. 加载SCSS举例
```js
// 直接加载外部scss
module: {
     rules: [
       {
         test: /\.scss$/,
         use: [
           'style-loader',
           'sass-loader'
         ]
       }
     ]
   }
// vue内部支持sass等多种样式类型
module: {
     rules: [
       {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
     ]
   }
// vueLoaderConfig
// vue-loader.conf.js
'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
// utils.cssLoaders
exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

```
3. [CSS分离](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin)  
使用插件 ExtractTextWebpackPlugin  
    * 安装
    ```
    npm install --save-dev extract-text-webpack-plugin
    ```
    * 用法
    ```js
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ```
    > 它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

## 加载图片 & limit优化
加载图片,视频，字体文件等均可使用url-loader  
```js
{
    test: /\.(png|svg|jpg|gif)$/,
     // url limit 可以将limit以下的文件转换为base64，从而减少http请求，默认为不限制
    loader: 'url-loader?limit=8192&name=img/[name][hash:8].[ext]'
    
}
```

## 全局资源
> 上述所有内容中最出色之处是，以这种方式加载资源，你可以以更直观的方式将模块和资源组合在一起。无需依赖于含有全部资源的 /assets 目录，而是将资源与代码组合在一起。