# 在不使用第三方库的情况下
以官方文档请求一个json举例
```js
http.get('http://nodejs.cn/index.json', (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
        error = new Error('请求失败\n' +
            `状态码: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error('无效的 content-type.\n' +
            `期望的是 application/json 但接收到的是 ${contentType}`);
    }
    if (error) {
        console.error(error.message);
        // 消费响应数据来释放内存。
        res.resume();
        return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`报错: ${e.message}`);
});
```
这样的写法的缺点  
1. let rowData = '' 来缓存获取到的json
2. 在end()事件下，rowData还需要手动转为JSON对象

# 使用第三方库[request](https://github.com/request/request#promises--asyncawait)
```js
const request = require('request');
request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
```
具体用法不多赘述

## 如果你习惯使用Promise

[request-promise](https://github.com/request/request-promise) 是你最好的选择。

# 使用request-promise
```
npm install --save request
npm install --save request-promise
```
> 注意 request 被定义为peer-dependency（对等依赖），所以需要单独安装

### 引入request-promise
```js
var rp = require('request-promise');
```
### 配置options示例
```js
// 抓取页面
rp('http://www.google.com')
    .then(function (htmlString) {
        // Process html...
    })
    .catch(function (err) {
        // Crawling failed...
    });
// 更好的抓取页面，cheerio
var cheerio = require('cheerio'); // Basically jQuery for node.js

var options = {
    uri: 'http://www.google.com',
    transform: function (body) {
        return cheerio.load(body);
    }
};

// GET REST API 获取json
var options = {
    uri: 'https://api.github.com/user/repos',
    qs: {
        access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response 将response自动转换，很关键
};


// POST DATA to a JSON REST API
// 注意：设置options.body,开启json:true
var options = {
    method: 'POST',
    uri: 'http://api.posttestserver.com/post',
    body: {
        some: 'payload'
    },
    json: true // Automatically stringifies the body to JSON
};


// 模仿form表单提交
// 使用form选项，他会自动添加请求头headers
var options = {
    method: 'POST',
    uri: 'http://posttestserver.com/post.php',
    form: {
        // Like <input type="text" name="name">
        name: 'Josh'
    },
    headers: {
        /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
    }
};

// 利用formData进行文件上传
var options = {
    method: 'POST',
    uri: 'http://posttestserver.com/post.php',
    formData: {
        // Like <input type="text" name="name">
        name: 'Jenn',
        // Like <input type="file" name="file">
        file: {
            value: fs.createReadStream('test/test.jpg'),
            options: {
                filename: 'test.jpg',
                contentType: 'image/jpg'
            }
        }
    },
    headers: {
        /* 'content-type': 'multipart/form-data' */ // Is set automatically
    }
};

// 包含cookie
var tough = require('tough-cookie');

// Easy creation of the cookie - see tough-cookie docs for details
let cookie = new tough.Cookie({
    key: "some_key",
    value: "some_value",
    domain: 'api.mydomain.com',
    httpOnly: true,
    maxAge: 31536000
});

// Put cookie in an jar which can be used across multiple requests
var cookiejar = rp.jar();
cookiejar.setCookie(cookie, 'https://api.mydomain.com');
// ...all requests to https://api.mydomain.com will include the cookie

var options = {
    uri: 'https://api.mydomain.com/...',
    jar: cookiejar // Tells rp to include cookies in jar that match uri
};

// 获取完整的response，而不仅仅是body
var options = {
    method: 'DELETE',
    uri: 'http://my-server/path/to/resource/1234',
    resolveWithFullResponse: true    //  <---  <---  <---  <---
};

// Get a rejection only if the request failed for technical reasons，仅仅因为技术原因才拒绝该请求
var options = {
    uri: 'http://www.google.com/this-page-does-not-exist.html',
    simple: false    //  <---  <---  <---  <---
};
```
### 发送请求
```js
rp(options)
    .then(function ($) {
        // Process html like you would with jQuery...
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    });
```

> 更多内容参考[官方文档](https://github.com/request/request-promise)