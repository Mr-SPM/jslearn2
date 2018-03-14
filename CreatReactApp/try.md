# Changing the Page &lt;title&gt;
你可以在*public*文件夹内发现用于生成项目的源html页面。你可以编辑 &lt;title&gt; 标签去把原来的*React App*改成任何其他你想要的。  
注意，通常情况下，你不会经常去修改在*public*文件夹内的文件。例如，增加一个样式表而不触及html。  
如果你想依赖页面内容动态的去修改页面标题，你可以使用浏览器的**document.title**API。当你需要在React组件内修改页面标题等一些更复杂的情况，你可以使用第三方库[React Helmet](https://github.com/nfl/react-helmet)。  
如果您在生产环境中为自己的应用使用自定义服务器，并且想在发送给浏览器之前修改标题，则可以按照本节中的[建议操作](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#generating-dynamic-meta-tags-on-the-server)。 或者，您可以预先将每个页面构建为静态HTML文件，然后加载JavaScript包，[这在此处介绍](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#pre-rendering-into-static-html-files)。  

# Installing a Dependency 安装依赖
生成的项目包括React和ReactDOM作为依赖关系。它还包含一组由Create React App用作开发依赖项的脚本。您可以使用npm安装其他依赖项（例如，React Router）：  
```
npm install --save react-router
```
此操作适用于任何library，不仅仅是react-router。  

# Importing a Component 引入组件
感谢Babel。本项目支持ES6。
当你仍然使用*require()* 和 *module.exports*。我们鼓励你去使用[import 和 export](http://exploringjs.com/es6/ch_modules.html)替换他们。举例：  
**Button.js**  
```js
import React, { Component } from 'react';

class Button extends Component {
  render() {
    // ...
  }
}

export default Button; // Don’t forget to use export default!
```
**DangerButton.js**  
```js
import React, { Component } from 'react';
import Button from './Button'; // Import a component from another file

class DangerButton extends Component {
  render() {
    return <Button color="red" />;
  }
}

export default DangerButton;
```
请注意[默认导出（default）和命名导出（named exports）的区别](https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import/36796281#36796281)，这是一个常见的错误。   
我们建议您在模块只导出一件东西（例如，一个组件）时坚持使用默认导入和导出。这就是当您使用 *export default Button* 和 *import Button from './Button'*的结果。  
命名导出对于导出多个函数的实用程序模块很有用。一个模块最多可以有一个默认导出，并且可以根据您的喜好导出多个命名导出。  
### module输入输出复杂举例
```js
// a.js
export default 0;
export const myA  = 1;
export const Something = 2;

// b.js
import A,{myA,Something as newName} from './a';

// 一个React 组件
import React,{Component} from 'react';
```

# Code Splitting 代码拆分
代码拆分允许你将你的代码拆分成多个块（chunks），然后按需加载。而不是在使用它之前就下载整个app。  
项目支持通过动态导入**import()**进行代码拆分。这个一个第三阶段的提案。  
类似于import（）函数的表单将模块名称作为参数，并返回Promise，该Promise始终解析为模块的名称空间对象。  
下面有一个例子:  
```js
// moduleA.js
const moduleA = 'Hello';
export { moduleA };

// App.js
import React, { Component } from 'react';

class App extends Component {
  handleClick = () => {
    import('./moduleA')
      .then(({ moduleA }) => {
        // Use moduleA
      })
      .catch(err => {
        // Handle failure
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
  }
}

export default App;
```
这会使 moduleA.js 和它所有的独立依赖项打包为一个单独的块，只有在‘Load’按钮被点击时，才会被加载。  
如果你喜欢的话，上述代码你也可以使用**async/await**语法。  

## With React Router 在React Router中进行代码分割  
如果您正在使用React Router，请查看[本教程](https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html)，了解如何使用代码分割。你可以在这里找到伴随的[GitHub仓库](https://github.com/AnomalyInnovations/serverless-stack-demo-client/tree/code-splitting-in-create-react-app)。  

# Adding a StyleSheet 增加样式表
项目使用Webpack来控制所有资源。Webpack提供了一种自定义的方式，将导入的概念“扩展”到JavaScript之外。为了表示JavaScript文件依赖于CSS文件，您需要从JavaScript文件导入CSS：  
```css
.Button {
    padding: 20px;
}
```
```js
import React, { Component } from 'react';
import './Button.css'; // Tell Webpack that Button.js uses these styles

class Button extends Component {
  render() {
    // You can use them as regular CSS styles
    return <div className="Button" />;
  }
}

```
对于React来说这不是必需的，但很多人都觉得这个功能很方便。 你可以在[这里](https://medium.com/seek-ui-engineering/block-element-modifying-your-javascript-components-d7f99fcab52b)阅读这种方法的好处。 但是，您应该意识到，这会使您的代码不易移植到其他构建工具和环境，而不是Webpack。  
在开发中，通过这种方式表达依赖关系，您可以在编辑样式时随时重新加载样式。在制作过程中，所有CSS文件将在构建输出中连接成一个缩小的.css文件。  
如果你关心使用Webpack特定的语义，你可以把所有的CSS放到src / index.css中。它仍然会从src / index.js中导入，但如果稍后迁移到其他构建工具，则可以始终删除该导入。  

# Post-Processing CSS
此项目设置会自动亚索您的CSS并通过[Autoprefixer](https://github.com/postcss/autoprefixer)自动添加vendor前缀，因此您无需担心。  举例：  
```css
.App {
    display: flex;
    flex-direction: row;
    align-items: center;
}
```
--> 
```css
    .App {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
      -ms-flex-direction: row;
          flex-direction: row;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}
```
如果你因某种原因需要禁用自动修复功能，请按照此[部分](https://github.com/postcss/autoprefixer#disabling)进行操作。  

# Adding a CSS Preprocessor(Sass, Less etc.) 添加CSS预处理器
通常来说，我们要求你不能跨越不同的组件重复使用相同的CSS类名。例如：我们建议使用自己的.Button样式创建一个<Button>组件，而不是在<AcceptButton>和<RejectButton>组件中使用.Button CSS类，而<AcceptButton>和<RejectButton>都可以呈现（但不能继承）。  
遵循这个规则通常会使CSS预处理器的用处不大，因为mixin和嵌套等功能被组件组合所取代。 但是，如果您发现它很有价值，则可以集成CSS预处理器。 在本演练中，我们将使用Sass，但您也可以使用Less或其他替代方法。  

首先，
```
npm install --save node-sass-chokidar
```
然后在*package.json*中增加下面几行脚本命令
```json
"scripts": {
+    "build-css": "node-sass-chokidar src/ -o src/",
+    "watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
     "start": "react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test --env=jsdom",
```

> 注意：不同的预处理器使用不同的build-css 和 watch-css 命令，请自己查看文档。
现在您可以将src / App.css重命名为src / App.scss并运行npm run watch-css。 观察者会在src子目录中找到每个Sass文件，并在其旁边创建一个相应的CSS文件，在我们的例子中覆盖src / App.css。 由于src / App.js仍然导入src / App.css，所以样式成为您的应用程序的一部分。 您现在可以编辑src / App.scss，并且src / App.css将被重新生成。  
要在Sass文件之间共享变量，您可以使用Sass导入。例如，src / App.scss和其他组件样式文件可以包含@import“./shared.scss”;具有可变定义。  
要启用导入文件而不使用相对路径，可以将--include-path选项添加到package.json中的命令中。这样你就可以使用下列这种引入方法
```scss
@import 'styles/_colors.scss'; // assuming a styles directory under src/
@import 'nprogress/nprogress'; // importing a css file from the nprogress node module
```
此时，您可能希望从源代码管理中删除所有CSS文件，并将src / ** / *。css添加到.gitignore文件中。将构建产品保留在源代码管理之外通常是一种很好的做法。  

作为最后一步，您可能会发现使用npm start自动运行watch-css并运行build-css作为npm run build的一部分很方便。 您可以使用&&运算符按顺序执行两个脚本。 但是，没有跨平台的方式来并行运行两个脚本，所以我们将为此安装一个包：  
```
npm install --save npm-run-all
```
然后我们可以改变start和build脚本命令去包括CSS预处理命令:  
```json
   "scripts": {
     "build-css": "node-sass-chokidar src/ -o src/",
     "watch-css": "npm run build-css && node-sass-chokidar src/ -o src/ --watch --recursive",
-    "start": "react-scripts start",
-    "build": "react-scripts build",
+    "start-js": "react-scripts start",
+    "start": "npm-run-all -p watch-css start-js",
+    "build-js": "react-scripts build",
+    "build": "npm-run-all build-css build-js",
     "test": "react-scripts test --env=jsdom",
     "eject": "react-scripts eject"
   }
```
现在，我们运行命令 npm start 和 npm run build 可以同时构建 Sass 文件了。  

Why node-sass-chokidar ?
据报道node-sass存在以下问题：  
+ node-sass --watch  在虚拟机或docker中使用时在某些情况下会出现性能问题。
+ Infinite styles compiling [#1939](https://github.com/facebook/create-react-app/issues/1939)
+ node-sass 在检测目录中的新文件时遇到了问题 [#1891](https://github.com/sass/node-sass/issues/1891)  
这里使用node-sass-chokidar来解决这些问题。  


# Adding Images, Fonts, and Files 增加资源文件

使用webpack中，使用静态资产（如图像和字体）与CSS类似。

您可以直接在JavaScript模块中导入文件。 这告诉Webpack将该文件包含在该包中。 与CSS导入不同，导入文件会为您提供字符串值。 此值是您可以在代码中引用的最终路径，例如 作为图像的src属性或链接到PDF的href。  
为了减少对服务器的请求数量，导入小于10,000字节的图像将返回数据URI而不是路径。这适用于以下文件扩展名：bmp，gif，jpg，jpeg和png。由于＃1153，SVG文件被排除。
下面是一个例子：  
```js
import React from 'react';
import logo from './logo.png'; // Tell Webpack this JS file uses this image

console.log(logo); // /logo.84287d09.png

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />;
}

export default Header;
```
这确保了在项目建立时，Webpack将正确地将图像移动到build文件夹中，并为我们提供正确的路径。  
这也适用于 CSS： 
```css
.Logo {
  background-image: url(./logo.png);
}
```
Webpack 会去发现所有在CSS中使用相对路径（已**./**开头）然后替换他们为一个最终打包后的路径。如果你写了个错字或者不小心删除了一个关键的文件，你将会看到一个编译错误，就像当你引入一个不存在的JavaScript模块一样。最终在打包文件内的文件名将由Webpack从内容哈希生成。如果文件内容之后被改变，Webpack将会在生产文件中给一个不同的名字，所以你就不必去担心浏览器的缓存问题了。  
请注意，这也是Webpack的自定义功能。  
React并不是必需的，但许多人都喜欢它（并且React Native使用类似的图像机制）。  
下一节将介绍处理静态资产的另一种方法。  


# Using the public Folder 使用public文件夹
> 注意，该功能仅在 react-scripts@0.5.0或者更高上面生效。  

## Changing the HTML 更改html
public 文件夹包含 HTML文件，所以你可以去调整它。比如，更改页面的标题。那些编译后生成代码在构建过程中将会自动增加到HTML中，通过添加&lt;script&gt;的方式。

# Adding Assets Outside of the Module System 在模块之外添加资源
你同样可以添加其他资源在public 文件夹内。  
注意，我们通常推荐你在JavaScript 文件内 import 资源。比如上面的adding a stylesheet 和 adding images and fonts。这种机制提供了许多好处：  
+ 脚本和样式表被压缩并捆绑在一起以避免额外的网络请求。
+ 缺少文件会导致编译错误，而不是客户端的404。
+ 结果文件名包含内容散列，因此您不必担心浏览器缓存其旧版本。  

不过，您可以使用escape hatch在模块系统外部添加资源。
如果你把文件放在public文件夹内，那么它将不会被Webpack处理。作为替换，它将会直接被复制到构建文件夹内。要引用公用文件夹中的资源，您需要使用一个名为PUBLIC_URL的特殊变量。
在 index.html 中，你可以像这样去使用:  
```html
<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
```
只有在public文件夹内的文件会被通过**%PUBLIC_URL%**前缀获取。如果你需要使用在 src 或者 node_modules 内的文件，你需要手动复制它以明确地指定你的意图是使这个文件成为构建的一部分。  
当你运行 npm run build,Create React App 将会替换 **%PUBLIC_URL%** 为一个正确的绝对路径。即使您使用客户端路由或将其托管在非根URL中项目仍然可以正常工作。    
在JavaScript代码中，您可以将process.env.PUBLIC_URL用于类似的目的：  
```js
render() {
  // Note: this is an escape hatch and should be used sparingly!
  // Normally we recommend using `import` for getting asset URLs
  // as described in “Adding Images and Fonts” above this section.
  return <img src={process.env.PUBLIC_URL + '/img/logo.png'} />;
}
```

记住这种方法的下列缺点：  
+ 在 public 文件夹内的文件不会后处理（post-processed）和压缩。
+ 如果缺失文件，不会在编译时得到提现。而会在客户端出现404错误。
+ 结果文件不会包含内容哈希，所以在你变更文件后你需要手动增加查询查数，或者从重命名该文件。  

## When to Use the public Folder 在何时使用public文件夹
通常，我们推荐在JavaScript导入样式表，图片和字体文件。public 文件夹用于许多不常见的解决方法：  
+ 在输出文件时，你需要一个特殊的名字的输出。比如[manifest.webmanifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
+ 你拥有大量的图片，并且这些图片需要动态的引用他们的路径。
+ 你想在捆绑代码之外加入一个像[pace.js](http://github.hubspot.com/pace/docs/welcome/)这样的小脚本。
+ 某些库可能与Webpack不兼容，您没有其他选择，只能将其包含为&lt;script&gt;标记。  

注意，如果你增加一个命令了全局变量的&lt;script&gt;，你需要去阅读下面的章节来使用他们。  

# Using Global Variables 使用全局变量
当您在定义全局变量的HTML文件中包含脚本并尝试在代码中使用其中一个变量时，linter会抱怨，因为它看不到变量的定义。  
您可以通过从窗口对象中显式读取全局变量来避免这种情况。比如:  
```js
const $ = window.$;
```
这样你就使用了全局变量的行为就变得显而易见，而不是让它看起来像个错别字（写错的变量名）。
或者，您可以强制linter通过在其后面添加// eslint-disable-line来忽略任何行。

# Adding Bootstrap
您不必将[React Bootstrap](https://react-bootstrap.github.io/)与React一起使用，但它是集成Bootstrap与React应用程序的流行库。如果您需要它，可以按照以下步骤将其与Create React App集成：  
通过npm安装React Bootstrap 和 Bootstrap，React Bootstrap 不会包含 Bootstrap CSS 所以你需要自己去安装
```
npm install --save react-bootstrap bootstrap@3
```

在你的**src/index.js**中手动引入Bootstrap CSS ，有选择的引入 Bootstrap theme CSS。  

在src / App.js文件或您的自定义组件文件中导入所需的React Bootstrap组件：  
```js
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
```

现在您已准备好在render方法中定义的组件层次结构内使用导入的React Bootstrap组件。以下是使用React Bootstrap重做的一个App.js示例。
```jsx
import React, { Component } from 'react';
import { Grid, Navbar, Jumbotron, Button } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar inverse fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">React App</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
        <Jumbotron>
          <Grid>
            <h1>Welcome to React</h1>
            <p>
              <Button
                bsStyle="success"
                bsSize="large"
                href="http://react-bootstrap.github.io/components.html"
                target="_blank">
                View React Bootstrap Docs
              </Button>
            </p>
          </Grid>
        </Jumbotron>
      </div>
    );
  }
}

export default App;
```

# Using a Custom Theme 使用自定义主题  
有时你可能需要调整Bootstrap的视觉样式（或等效包）。 我们建议采用以下方法：  

+ 根据您想要自定义的包创建一个新的包，例如Bootstrap。
+ 添加必要的构建步骤来调整主题，并在npm上发布您的包。
+ 安装您自己的主题npm软件包作为您的应用程序的依赖项。  

以下是添加遵循这些步骤的[自定义Bootstrap](https://medium.com/@tacomanator/customizing-create-react-app-aa9ffb88165)的示例。  


# Adding Flow
Flow是一个静态类型检查器，可以帮助您编写更少bug的代码。 如果您对这个概念不熟悉，请查看JavaScript中的静态类型介绍。

Flow的最新版本与开箱即用的Create React App项目一起使用。

要将流添加到Create React App项目，请按照下列步骤操作：

+ 运行npm install --save flow-bin（或yarn add flow-bin）。
+ 将“flow”：“flow”添加到package.json的脚本部分。
+ 运行npm run flow init（或yarn flow init）在根目录下创建一个.flowconfig文件。
+ 将// @flow添加到您想要键入的任何文件中（例如，对于src / App.js）。
现在你可以运行npm run flow（或者yarn flow）来检查文件中的类型错误。 您可以选择使用像Nuclide这样的IDE来获得更好的集成体验。 未来我们计划将其更加紧密地整合到Create React App中。

要了解有关Flow的更多信息，请查看其[文档](https://flowtype.org/)。  

# Adding a Router 增加路由
Create react App 不规定你使用特定的路由解决方案，但是[React Router](https://reacttraining.com/react-router/)是最流行的解决方案之一。  

## 安装
```
npm install --save react-router-dom
```
要尝试它，请删除src / App.js中的所有代码，并将其替换为其网站上的任何示例。[基本示例](https://reacttraining.com/react-router/web/example/basic)是一个开始的好地方。  
请注意，在部署应用程序之前，您可能需要[配置您的生产服务器以支持客户端路由](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#serving-apps-with-client-side-routing)。  


# Adding Custom Environment Variables 增加自定义环境变量  
> 此功能在react-scripts@0.2.3或更高版本可用。  
您的项目可以使用在您的环境中声明的变量，就好像它们是在JS文件中本地声明的一样。默认情况下，您将为您定义NODE_ENV，以及以REACT_APP_开头的任何其他环境变量。  
**环境变量是在构建时嵌入的**。 由于Create React App会生成静态HTML / CSS / JS包，因此无法在运行时读取它们。 要在运行时读取它们，您需要将HTML加载到服务器的内存中，并在运行时替换占位符，就像这里所述。 或者，您可以随时在服务器上重建应用程序，以便更改它们。
> 注意：您必须创建以REACT_APP_开头的自定义环境变量。 除NODE_ENV以外的任何其他变量都将被忽略，以避免意外暴露机器上可能具有相同名称的私钥。 更改任何环境变量将需要您在运行时重新启动开发服务器。  
这些环境变量将在**process.env**中为您定义。例如，拥有名为**REACT_APP_SECRET_CODE**的环境变量将作为**process.env.REACT_APP_SECRET_CODE**显示在您的JS中。    
 还有一个名为NODE_ENV的特殊内置环境变量。 您可以从process.env.NODE_ENV中读取它。 当你运行npm start时，它总是等于'development'，当你运行npm测试它总是等于'test'，并且当你运行npm run build来制作一个生产包时，它总是等于'production'。 您无法手动覆盖NODE_ENV。 这可以防止开发人员意外地将缓慢的开发构建部署到生产环境中。  
 这些环境变量可以用于根据项目的部署位置或使用超出版本控制的敏感数据来有条件地显示信息。

 首先，你需要定义环境变量。例如，假设您想要消费在<form>内的环境中定义的一个秘密：
 ```jsx
 render() {
  return (
    <div>
      <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
      <form>
        <input type="hidden" defaultValue={process.env.REACT_APP_SECRET_CODE} />
      </form>
    </div>
  );
}
 ```
 在构建期间，process.env.REACT_APP_SECRET_CODE将被替换为REACT_APP_SECRET_CODE环境变量的当前值。请记住，NODE_ENV变量将自动为您设置。  
 当您在浏览器中加载应用程序并检查&lt;input&gt;时，您会看到其值设置为abcdef，粗体文本将显示使用npm start时提供的环境：  
 ```html
 <div>
  <small>You are running this application in <b>development</b> mode.</small>
  <form>
    <input type="hidden" value="abcdef" />
  </form>
</div>
 ```  

上面的表单正在从环境中寻找一个名为REACT_APP_SECRET_CODE的变量。 为了使用这个值，我们需要在环境中定义它。 这可以通过两种方式完成：无论是在shell还是在.env文件中。 接下来的几节将介绍这两种方法。  
访问NODE_ENV对于有条件地执行操作也很有用：  
```js
if (process.env.NODE_ENV !== 'production') {
  analytics.disable();
}
```
当您使用npm run build编译应用程序时，压缩步骤将删除此条件，并且生成的包将更小。  

## Referencing Environment Variables in the HTML 在HTML中使用环境变量
> 注意，此功能在react-scripts@0.9.0或者更高版本可用  
您还可以访问public / index.html中以REACT_APP_开头的环境变量。例如：  
```html
<title>%REACT_APP_WEBSITE_NAME%</title>
```
请注意，上述部分的注意事项适用于：  
+ 除了一些内置变量（NODE_ENV和PUBLIC_URL）之外，变量名称必须以REACT_APP_开始工作。
+ 环境变量是在构建时注入的。如果您需要在运行时注入它们，请改为使用此[方法](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#generating-dynamic-meta-tags-on-the-server)。  

## Adding Temporary Environment Variables In Your Shell 在Shell中添加临时环境变量
定义环境可能因操作系统而异。所以了解这种方式在暂时存在在 Shell session 中的也很重要。  
```
// Windows(cmd.exe)
set "REACT_APP_SECRET_CODE=abcdef" && npm start
// （注意：变量赋值周围的引号需要避免尾随空格。）  

// Windows (Powershell)
($env:REACT_APP_SECRET_CODE = "abcdef") -and (npm start)

// Linux, macOS (Bash)
REACT_APP_SECRET_CODE=abcdef npm start
```

## Adding Development Environment Variables In .env 
> 此功能在 react-scripts@0.5.0 或者更高版本可用。  

在项目根目录定义**.env**文件用来定义永久环境变量。
```
REACT_APP_SECRET_CODE=abcdef
```
> 注意：你必须已**React_APP_**开头创建自定义环境变量。任何除了**NODE_ENV**之外的其他变量将会被忽略，以避免偶然暴露机器上可能具有相同名称的私钥。任何环境变量的更改都需要重启开发服务器才能生效。  

.env文件应该被检入源代码管理（不包括.env * .local）。  

哪些其他.env文件可以被使用？  
> 注意：此功能在react-scripts@1.0.0或者更高版本可用。  
+ .env: 默认
+ .env.local 本地覆盖。除了测试环境，所有环境都会加载。
+ .env.development,.env.test,.env.production: 特殊环境设置。
+ .env.development.local, .env.test.local, .env.production.local: 本地覆盖特定于环境的设置。  

左侧的文件比右侧的文件优先：
+ npm start: .env.development.local, .env.development, .env.local, .env
+ npm run build: .env.production.local, .env.production, .env.local, .env
+ npm test: .env.test.local, .env.test, .env (note .env.local is missing)  

如果机器没有明确设置它们，这些变量将作为默认值。  
请查询[dotenv documentation](https://github.com/motdotla/dotenv)查阅更多细节内容。  
> 注意：如果您正在为开发定义环境变量，则您的CI和/或托管平台很可能也需要定义这些变量。请参阅他们的文档如何做到这一点。例如，请参阅Travis CI或Heroku的文档。  

## Expanding Environment Variables In .env 在.env中拓展环境变量
> 注意：此功能在react-scripts@1.1.0或更高版本可用。  
拓展您的机器上已有的变量以用于.env文件（使用[dotenv-expand](https://github.com/motdotla/dotenv-expand)）。  

比如，获取npm_package_version环境变量：  
```
REACT_APP_VERSION=$npm_package_version
# also works:
# REACT_APP_VERSION=${npm_package_version}
```
或者将本地的变量扩展到当前的.env文件中：  
```
DOMAIN=www.example.com
REACT_APP_FOO=$DOMAIN/foo
REACT_APP_BAR=$DOMAIN/bar
```  

# Can I Use Decorators?  可不可以使用装饰器？
很多流行的库都在他们的文档中使用了装饰器。但是Create React App 目前不支持 decorator 语法，因为：  
+ 这是一个试验性提案，之后可能会被更改。
+ 目前的规范版本没有得到Babel的正式支持。
+ 如果规范更改，我们不可能去写 codemod ，因为我们不在Facebook内部使用他们。  

然而在很多情况下，你可以同样写出不使用decorator的代码基于decorator的代码。请参考下面2个issue。  
+ [#214](https://github.com/facebook/create-react-app/issues/214)
+ [#411](https://github.com/facebook/create-react-app/issues/411)  

Create React App 将会支持decorator在规范版本变为一个稳定阶段(stable stage).  

# Fetching Data with AJAX Requests  
React 不规定用于fetching data的方法，但是开发者通常会使用比如[axios](https://github.com/axios/axios)这样的一个库或者由浏览器提供的[fetch() API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。为了提供方便的操作，Create React App 包含了一个polyfill 用于**fetch()**，这样你就可以不用去担心浏览器支持问题了。  
全局的fetch方法可以让你简单的使用AJAX请求。它使用一个url作为一个参数，然后返回一个Promise，在获取Response后resolves。你可以查阅更多关于[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)的信息。  
这个项目还包括Promise polyfill，它提供Promises / A +的完整实现。 Promise表示异步操作的最终结果，您可以在[这里](https://www.promisejs.org/)和[这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)找到有关Promise的更多信息。 axios和fetch()都使用Promise。 您还可以使用async/await语法来减少回调嵌套。  

您可以在React网站上的[FAQ](https://reactjs.org/docs/faq-ajax.html)条目中了解更多关于从React组件发出AJAX请求的信息。  

# Integrating with an API Backend 与API后端集成
下面的教程讲帮助你将app运行在另一个端口上的API后端集成，并使用fetch()来访问他们。  

## [Node](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/)  

## [Ruby on Rails](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/)  


# Proxying API Requests in Development 在开发环境代理API请求  
> 此功能在react-scripts@0.2.3或更高版本可用  
人们通常在同一主机和端口的前端React应用程序作为后端实施。
例如：在部署应用程序之后，生产设置可能如下所示：  
```
/             - static server returns index.html with React app
/todos        - static server returns index.html with React app
/api/todos    - server handles any /api/* requests using the backend implementation
```

这样的设置不是必须的。然而，如果你确实按着类似的设置，那么很显然你写requests只需要像*fetch('/api/todos')*而不需要担心在开发中需要重定向到一个另外的主机或者端口。

去让开发服务器代理发往API服务器的任何未知请求，你需要在**package.json**文件中添加一个**proxy**区域。例如:  
```json
"proxy": "http://localhost:4000",
```
通过这样的方式，当你在开发时fetch('/api/todos')，devServer将会识别这不是一个静态资源然后代理你的请求发往*http://localhost:4000/api/todos*。devServer将只会尝试去发没有**text/html**代理的发送request。  
方便的是，这避免了CORS问题和这样的错误消息在开发中：  
```
Fetch API cannot load http://localhost:4000/api/todos. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

记住，proxy只会在开发环境生效（npm start），在生产环境中让urls指向正确的目标这取决于你自己。你不是必须使用*/api*前缀，任何无法识别的，没有text / html接受头的请求都会被重定向到指定的代理。  

proxy 选项支持HTTP,HTTPS和 WebSocket 连接。
如果proxy选项不够灵活，你可以：  
+ [自己配置proxy](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#configuring-the-proxy-manually)
+ 在你的服务器上允许CORS  
+ 在你的app中使用环境变量注入准确的主机和端口。  

## "Invalid Host Header" Errors After Configuring Proxy
当你采用proxy选项，就以为着你选择了一套更严格的主机检查。这是必须的因为让后端开着远程主机会让你的电脑受到DNS rebinding 攻击。这里的[ISSUE](https://github.com/webpack/webpack-dev-server/issues/887)和[文章](https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a)解释了这个行为。  

在你启用了proxy后，如果你在你的localhost上面开发，这个错误将不会出现。但是如果你使用远程开发，你将会在浏览器看到这个错误。
```
Invalid Host header
```

如果去解决这个问题，你可以在项目根目录中的一个叫做**.env.development**文件内规定你的开发主机。  
```
HOST=mypublicdevhost.com
```

这样，如果你重启你的devServer，现在它应该就能够成功运行了。  
如果，你仍然存在这个问题或者你正在使用一个更加怪异的开发环境，比如一个云端编辑器，你可以通过在**.env.development.local**中增加下面的代码绕过host check。**注意：这是一个危险的举动，这会暴露你的机器，遭受恶意网站执行代码的攻击**。
```
# NOTE: THIS IS DANGEROUS!
# It exposes your machine to attacks from the websites you visit.
DANGEROUSLY_DISABLE_HOST_CHECK=true
```
我们不建议使用这个方法。  

## Configuring the Proxy Manually 手动配置proxy
> 注意，此功能在react-scripts@1.0.0或更高版本可用。
您也可以指定任何配置值[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#options)或[http-proxy](https://github.com/nodejitsu/node-http-proxy#options)支持。  
```json
{
  // ...
  "proxy": {
    "/api": {
      "target": "<url>",
      "ws": true
      // ...
    }
  }
  // ...
}
```
所有匹配此路径的请求都将发往代理服务器，无一例外。**这包括对标准代理选项无法代理的text / html的请求。**  
如果你需要规定一个复杂的代理，你可以像下面那样做，匹配的方式是使用正则表达式。所以你可以通过一个代理匹配多个路径。
```json
{
  // ...
  "proxy": {
    // Matches any request starting with /api
    "/api": {
      "target": "<url_1>",
      "ws": true
      // ...
    },
    // Matches any request starting with /foo
    "/foo": {
      "target": "<url_2>",
      "ssl": true,
      "pathRewrite": {
        "^/foo": "/foo/beta"
      }
      // ...
    },
    // Matches /bar/abc.html but not /bar/sub/def.html
    "/bar/[^/]*[.]html": {
      "target": "<url_3>",
      // ...
    },
    // Matches /baz/abc.html and /baz/sub/def.html
    "/baz/.*/.*[.]html": {
      "target": "<url_4>"
      // ...
    }
  }
  // ...
}
```

## Configuring a WebSocket Proxy
当你需要设置WebSocked代理，你需要知道一些额外的注意事项。  
如果你正在使用一个像[Socket.io](https://socket.io/)这类的WebSocket engine，你必须在你代理请求之前保证Socket.io服务正在运行。Socket.io不能用于标准的WebSocket服务器。具体来说，不要指望Socket.io与websocket.org echo test一起工作。  
这里有一些[设置Socket.io](https://socket.io/docs/)的不错教程。  
标准WebSocket将与标准WebSocket服务器以及websocket.org echo test一起使用。您可以在服务器中使用像[ws](https://github.com/websockets/ws)这样的库，并在浏览器中使用原生WebSockets。  
无论哪种方式，你都可以在*package.json*中手动配置WebSocket请求代理。
```
{
  // ...
  "proxy": {
    "/socket": {
      // Your compatible WebSocket server
      "target": "ws://<socket_url>",
      // Tell http-proxy-middleware that this is a WebSocket proxy.
      // Also allows you to proxy WebSocket requests without an additional HTTP request
      // https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
      "ws": true
      // ...
    }
  }
  // ...
}
```

## Using HTTPS in Development  
> 此功能在react-scripts@0.4.0或更高版本可用  
你可能需要devServer通过HTTPS提供页面。当这个API服务器本身服务于HTTPS时，使用["proxy"feature](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development)代理对API服务器的请求时，一个特别有用的情况就是这种情况。  
如果需要这样做，设置HTTPS 环境变量为 true，之后正常npm start 启动devServer.
```
// windows(cmd.exe)
set HTTPS=true&&npm start

Windows (Powershell)
($env:HTTPS = $true) -and (npm start)

Linux, macOS (Bash)
HTTPS=true npm start
```
注意，服务器会使用一个自签证书（a self-signed certificate），所以你的浏览器基本会显示一个警告在你尝试访问该页面的时候。  


# Generating Dynamic <meta> Tags on the Server 生成动态的meta标签
因为Create React App 不支持服务器渲染，你可能在想怎么去动态meta标签反应当前的URL。为了解决这个问题，我们建议你在你的HTML中增加一个**placeholders**，像这样：  
```html
<!doctype html>
<html lang="en">
  <head>
    <meta property="og:title" content="__OG_TITLE__">
    <meta property="og:description" content="__OG_DESCRIPTION__">
```
然后，在服务器上，无论您使用的是什么后端，您都可以将index.html读入内存，并根据当前网址将值替换为__OG_TITLE__，__OG_DESCRIPTION__和任何其他占位符。 只要确保清理并转义插值，以便它们可以安全地嵌入到HTML中！  
如果你使用node服务器，你甚至可以在客户端和服务器共享路由匹配逻辑。但是，在简单情况下复制它也可以正常工作。

# Pre-Rendering into Static HTML Files  预渲染到静态HTML文件
如果您使用静态托管提供程序托管构建，则可以使用[react-snapshot](https://www.npmjs.com/package/react-snapshot)或[react-snap](https://github.com/stereobooster/react-snap)为应用程序中的每个路由或相关链接生成HTML页面。当JavaScript bundle加载完成后，这些页面将无缝地变为活动或“hydrated”。  

在静态托管之外还有机会使用这个功能，以便在生成和缓存路由时减轻服务器的压力。  

使用预渲染的好处是你可以在HTML payload获取每个页面的核心内容，不用考虑在什么时候JavaScript bundle被成功加载。它也增加了你的应用程序的每条路由将被搜索引擎拾取的可能性。  
您可以在这里阅读更多关于[零配置预渲染（也称为快照）](https://medium.com/superhighfives/an-almost-static-stack-6df0a2791319)。  


# Injecting Data from the Server into the Page 
与之前的某节类似，你可以在页面上留下几个**placeholders**让全局变量注入。比如：  
```html
<!doctype html>
<html lang="en">
  <head>
    <script>
      window.SERVER_DATA = __SERVER_DATA__;
    </script>
```
然后，在服务器上，您可以在发送响应之前将__SERVER_DATA__替换为实际数据的JSON。 客户端代码然后可以读取window.SERVER_DATA以使用它。 **确保在将JSON发送到客户端之前对其进行清理(sanitize)，因为它会使您的应用程序容易受到XSS攻击。**