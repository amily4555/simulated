## mzSimulated

拦截 angular $http ajax 请求

并模拟 ng ajax 请求，随机生成数据（mock.js）

并模拟 RESTful 形式，相应请求

### 基本思想

按照最小改变原则，尽量不改变原有的 ng 编程代码，使耦合度最低

使用最小量配置和数据字典生成模拟数据

可以一键切换模拟ajax请求和实际ajax请求

#### v0.1 拦截数据，响应请求

1. 初步支持按照各种method获得模拟数据

2. $httpProvider.interceptors 的 request 中修改 config.url 和 config.method 值

3. config.url 实际值为 config.realurl,  config.method 的实际值为 config.realmethod

#### v0.1.1 修改请求地址错误

1. 添加本地伪接口

2. 修正本地伪接口不支持delete

#### v0.1.2 暴露实际接口给用户，方便用户调试代码

1. 在虚拟接口设置query参数，表明实际请求接口 simulated.json?realurl=/v1/users

2. 在header中存放实际请求接口 X-SIMULATED-REALURL: /v1/users

#### v0.2 模拟http请求，返回不同的错误码

1. 可以设定随机请求错误（随机错误码）产生的几率

2. 单个请求手动设定错误错误类型



#### v0.3 模拟http请求，随机设置响应时间