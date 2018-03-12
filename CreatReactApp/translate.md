# 更新到新版本
Create React App 被分为2个包：  
+ create-react-app 一个用于创建新项目的命令行工具
+ react-scripts 用于生成项目的开发依赖项（）  
你几乎不需要去更新*create-react-app*他本身，因为他把所有设置委托给了*react-scripts*  
当你运行*create-react-app*，它总会创建一个使用最新版本*react-scripts*的项目。所以你将会获得最新的功能和改进。  
更新当前项目到最新的*react-script*,打开变动日志，去找到你当前所处的版本（检查package.json文件），并为新版本应用迁移说明。  
通常来说，在package.json中修改react-scripts版本并在该文件夹中运行npm install就足够了。但最好还是查阅有关潜在重大更改的日志。  
我们承诺保持最小的变化，以便你可以无痛的去升级react-scripts。  
# 发送反馈
[github issue](https://github.com/facebook/create-react-app/issues)
# 文件夹目录
在你创建项目之后，你的项目应该是长成这样的。
```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```
为了项目成功构建，**以下文件必须已缺钱的文件名存在。**  
+ public/index.html 页面模版（page template）
+ src/index.js JS入口点（entry point）  

另外的文件你可以任意修改或者重命名。  
你可以会创建子目录在*src*之下。为了更快的重建，只有在src内的文件会被webpack处理。你需要将任何js和css文件放入src中。否则Webpack将不会看到他们。  
只有在public文件夹内的文件才能被*public/index.html*使用。  
阅读下面的JavaScript和Html资源的说明  
你可以（however）创建更多顶级目录。他们不会包含在生产版本中，因此你可以将他们用于作为文档等内容。  
# Available Script 可用的脚本
在项目路径下，你可以运行
```
npm start
```
在开发模式下运行项目，通过在浏览器中打开[http://localhost:3000](http://localhost:3000)查看。  
页面会在你编辑后进行重载  
你还能够在console控制台中看到任何lint错误。  
```
npm test
```
已互动观察模式（interactive watch mode）运行测试器。  
查阅[running tests](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests)获取更多信息。  

```
npm run build
```
在*build*文件夹内创建用于生产环境的app。  
它能够在生产模式下正确的打包React并优化构建以获得最佳性能。  
构件文件将被压缩并且文件名会被使用hash命名。  
你的app已经准备被发布了。
有关更多信息，请参阅[部署（deployment）]（https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment）的部分。  

```
npm run eject
```
**注意：这是一个单向操作，一旦你eject（弹出），你再也无法回退。**
如果你对构建工具和配置选择不满意，你可以在任何时候选择eject。该命令将聪明的项目中移除单个构建依赖项。  
与此相反，他会讲所有配置文件和传递依赖项（webpack，Babel，ESlint等）直接复制到项目中，以便于你完全控制它们。除eject以外的其他命令仍然会有效，但他们将指向复制的脚本，以便你可以调整他们。在这一点上，你是独立的（你可以随心所欲[you are on your own]）。  

# Supported Browsers（支持的浏览器）
在默认情况下，生成项目使用最新版本的React。  
有关支持的浏览器的更多信息，请参阅React文档。  

# 支持的语言特性和Polyfills（垫片？）
该项目支持最新的JavaScript标准的超集。
除了ES6语法功能外，它还支持：  
+ [Exponentiation Operator](https://github.com/rwaldron/exponentiation-operator)(ES2016).
+ [Async/await](https://github.com/tc39/ecmascript-asyncawait)(ES2017).
+ [Object Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread)(state 3 proposal)
+ [Dynamic import()](https://github.com/tc39/proposal-dynamic-import) (state 3 proposal)
+ [Class Fields and Static Properties](https://github.com/tc39/proposal-class-public-fields) (part of stage 3 proposal).
+ JSX and Flow syntax.  

详细了解不同[提案阶段](https://babeljs.io/docs/plugins/#presets-stage-x-experimental-presets-)  

虽然我们建议谨慎使用试验性提案，但Facebook在产品代码中大量使用了这些功能，因此如果将来有这些提案发生变化，我们打算提供[codemods](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb).  

**请注意，项目尽包含一些ES6 polyfills:**  
+ Object.assgin() via object-assign.
+ Promise via promise.
+ fetch() via whatwg-fetch.  

如果你使用其他一些需要运行时支持的(例如 Array.from() 或 Symbol)其他ES6+功能，请确保手动包含适当的polyfills，或者您所使用/需要适配的浏览器已经支持他们。  

你同样要注意，使用一些更新的语法特性，例如**for..of** or **[...nonArrayValue]** 会导致Babel发出取决于ES6运行时功能的代码。并且在没有polyfill的情况下可能无法运行。如有疑问，请使用[Babel REPL]()查看特定语法编译的内容。  

# Syntax Highlighting in the Editor 编辑器中的语法高亮
要在您最喜欢的文本编辑器中配置语法高亮显示，请前往[相关的Babel文档页面](https://babeljs.io/docs/editors)并按照说明进行操作。涵盖了一些最受欢迎的编辑器。  

## Displaying Lint Output in the Editor 在编辑器中显示Lint 输出。
> 注意：此功能可用于react-scripts@0.2.0和更高版本。它也只适用于npm 3或更高版本。  
包括Sublime Text,Atom和vscode在内的一些编辑器为ESLint提供了插件。  
Lint 不是必须的。你可以在终端或者浏览器控制台中看到linter输出。然而，如果你更喜欢lint输出在你的编辑器上。这里有一些额外的步骤你需要做。  
首先你需要给你的编辑器去安装一个ESLint插件，之后，在你项目的根目录增加一个文件叫做*.eslintrc*
```json
{
    "extends": "react-app"
}
```  
现在，你的编辑器就可以展示lint警告了。  
注意：即使你进一步编辑了你的*.eslintrc*文件，这些更改也只会影响你的集成编辑器。他们不会影响终端和浏览器的lint输出。这是因为Create React App 有意提供了一组寻找常见错误的规则。  
如果你想为你的项目强制限制一种编码风格，考虑使用[Prettier](https://github.com/prettier/prettier)替换ESLint样式规则。  

# Debugging in the Editor  在编辑器中调试
**此功能目前只在VSCode和 WebStorm 上获得支持**  
Visual Studio Code和WebStorm支持使用Create React App进行调试。 这使得您可以作为开发人员在不离开编辑器的情况下编写和调试React代码，最重要的是，它使您能够拥有持续开发工作流程，在上下文切换最少的情况下，您无需在工具之间切换。  
## Visual Studio Code
你需要去拥有安装一个最新版本的VScode 和 VSCode拓展 Chrome Debugger Extention.  
然后创建一个**launch.json**文件，然后把他放到你app项目中的**.vscode**文件夹中
```json
{
  "version": "0.2.0",
  "configurations": [{
    "name": "Chrome",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "${workspaceRoot}/src",
    "sourceMapPathOverrides": {
      "webpack:///src/*": "${webRoot}/*"
    }
  }]
}
```
> 注意： 如果你通过HOST或PORT环境变量进行了调整，那么URL可能会有所不同。  
执行*npm start*来运行你的项目，然后通过在VS Code 见面按下F5。你就可以写代码，设立断点，让你在编辑器中调试你最新修改的代码。  
如果你在使用VS Code Debugging的时候有疑问。可以看他们的[指南](https://github.com/Microsoft/vscode-chrome-debug/blob/master/README.md#troubleshooting)。  

## WebStorm（暂略）  

## Formatting Code Automatically 自动格式化代码  
Prettier是一个支持JavaScript，CSS和JSON的独立代码格式器。 更漂亮的你可以自动编写代码格式，以确保项目中的代码风格。 有关更多信息，请参阅[Prettier](https://github.com/prettier/prettier)的GitHub页面，并查看此页面以查看它的[实际应用](https://prettier.github.io/prettier/)。  
为了在任何我们提交git代码时格式化我们的代码，我们需要去安装下面的依赖项。
```
npm install --save husky lint-staged prettier
```
+ husky 使它很容易使用githooks，就好像它们是npm脚本一样。
+ lint-staged 允许我们在git中的staged 文件上运行脚本。
+ prettier 我们将在提交之前运行的JavaScript格式器。  

现在我们可以确信所有的文件在package.json中被增加下面几行代码后能够得到正确的格式化。
```json
  "scripts": {
+   "precommit": "lint-staged",
    "start": "react-scripts start",
    "build": "react-scripts build",
```
下一步，在*package.json*中增加一个*lint-staged*区域，比如  
```json
  "dependencies": {
    // ...
  },
+ "lint-staged": {
+   "src/**/*.{js,jsx,json,css}": [
+     "prettier --single-quote --write",
+     "git add"
+   ]
+ },
  "scripts": {
```  
现在，无论何时提交，Prettier都会自动格式化已更改的文件。 您也可以运行./node_modules/.bin/prettier --single-quote --write“src / ** / *。{js，jsx，json，css}”来首次格式化整个项目。  

接下来，您可能需要将Prettier整合到您最喜爱的编辑器中。 阅读Prettier GitHub页面上的[编辑器集成部分](https://prettier.io/docs/en/editors.html)。  
