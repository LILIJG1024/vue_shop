# code

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

前端项目初始化步骤
1.安装Vue脚手架
2.通过Vue脚手架创建项目
3.配置Vue路由
4.配置Element-UI组件
5.配置axios库
6.初始化git仓库
7.将本地项目托管到github

token登入原理：
客户端与服务器存在跨域问题 不推荐使用session cookie
登入页面输入用户名和密码进行登入，服务器验证通过之后生成该用户的token并返回
客户端存储该token，后续的请求都应该携带该token发生请求
