# Running Tests
> 注意：这个功能在react-scripts@0.3.0或更高版本可用。
[阅读迁移指南以了解如何在较早的项目中启用它！](https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md#migrating-from-023-to-030)  

Create React App 使用 [Jest](https://facebook.github.io/jest/) 作为测试运行器。为了做好这个整合的准备，我们对Jest进行了重大修改，所以如果你在几年前听到过坏消息，请再试一次。  

Jest是一个基于节点的运行器。这意味着测试总是在Node环境中运行，而不是在真实的浏览器中运行。这使我们能够实现快速的迭代速度并防止出现片状(flakiness)。  

尽管Jest提供了浏览器全局变量，比如window感谢[jsdom](https://github.com/jsdom/jsdom)，但它们只是真实浏览器行为的近似值。 Jest旨在用于您的逻辑和组件测试，而不是DOM怪癖。  

如果您需要，我们建议您使用单独的工具进行浏览器端到端测试。它们超出了Create React App的范围。  

## Filename Conventions 
Jest将使用以下任何常用命名约定来查找测试文件：  
+ Files with .js suffix in __tests__ folders.
+ Files with .test.js suffix.
+ Files with .spec.js suffix.  

.test.js / .spec.js文件（或__tests__文件夹）可位于src顶级文件夹下的任何深度。  
我们建议将测试文件（或__tests__文件夹）放在它们正在测试的代码旁边，以便相对导入显示更短。 例如，如果App.test.js和App.js位于同一个文件夹中，则测试只需从'./App'导入应用程序，而不是长相对路径。 托管还有助于在大型项目中更迅速地找到测试。  

## Command Line Interface
当你运行npm测试时，Jest将在watch模式下启动。每次保存文件时，它都会重新运行测试，就像npm start重新编译代码一样。  
观察者包括一个交互式命令行界面，可以运行所有测试，或专注于搜索模式。 它是这样设计的，所以你可以保持开放并享受快速重新运行。 您可以从每次运行后观察者打印的“Watch Usage”注释中了解这些命令：

## Version Control Integration
默认情况下，当你运行npm test时，Jest将只运行与自上次提交后发生更改的文件相关的测试。 这是一个优化设计，无论您有多少测试，都可以使您的测试运行得更快。 但是，它假定您不会经常提交未通过测试的代码。

Jest会一直明确提到它只运行与上次提交后更改的文件相关的测试。 您也可以在watch模式中按a强制Jest运行所有测试。

Jest将始终运行持续集成服务器上的所有测试，或者该项目不在Git或Mercurial存储库中。  

## Writing Tests
要创建测试，请使用测试名称及其代码添加it()（或test()）块。您可以选择将它们包装在用于逻辑分组的describe()块中，但这不是必需的也不推荐。  
Jest提供了一个内置的expect()全局函数来进行断言。基本测试可能如下所示：
```js
import sum from './sum';

it('sums numbers', () => {
  expect(sum(1, 2)).toEqual(3);
  expect(sum(2, 2)).toEqual(4);
});
```
Jest支持的所有expect()匹配器在这里被广泛记录。 您也可以使用jest.fn()并expect(fn).toBeCalled()创建“间谍”或模拟函数。  

