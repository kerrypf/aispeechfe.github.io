<h2 align="center">github.io 博客</h2>
这个博客是基于github搭建的，利用了github的文档编辑，数据存储，版本管理等好处，希望使用起来会更方便，降低使用难度。大家可以在这写一些心得或者事。

### 结构
<img src="https://aispeechfe.github.io/imgs/gitflow-model.src 2.001.jpeg" alt="jiegou">


### 启动
1.启动静态页面站点
npm run staticserver

2.启动commit监控
npm run server

3.按照cmd中提示输入github账号密码

### 程序说明
1.目前使用的是轮询的方式来监听是否有commit提交。后面，如果这个博客有意义，再申请服务器，采用webhook的监听方式


### 参考文档
1.git设置账号密码

https://segmentfault.com/a/1190000008435592

2.阿里文档

https://github.com/AlibabaCloudDocs