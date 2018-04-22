##


### 

前端代码分发打包服务器 dlpserver
### 解决打包问题
* 打包为一个文件 加载时间太长 
*  分开打包

*三个包 page包,vender包,common包

场景:10个页面 中3个页面含有一个公共

打入公共文件,则不需要引用该公共包的页面也会引用,会加载10次

每个页面分别加载,相当于加载三次,

修改时,每个跟它打包的文件都需要重新加载

* 公共库的不同版本

### 文件级别缓存,一个请求获取所有文件

#### 新增

1.前端代码上传至服务器,

2.使用时调用dlp的loader,由loader确定加载什么东西

3.页面有个sciprt,有个loader采用amd的形式,require,先从 localstorage里面找是否有缓存,有缓存则去掉

4.向后端发一个请求,我需要一个page和vue ,依赖commonjs ,

5.后台把vue,page,cmomnon 合在一起发给前端

6.前端收到后切开三个存在本地缓存

#### 更新

page1.1=>page1.2

1.loader 发起请求 到后台  我这里有 page1.1 我是否可以用

2.后台告诉前端page使用1.2(文件内容) ,依赖文件 common1.0 ,

3.前端使用page1.2加缓存中的common1.0,并

4.单文件都有版本号很麻烦,使用项目版本号

require('vue') 
每次有变更,曾重新打包,作为整体的工程号,工程里面有若干个文件

声明 我依赖的文件

不需要webpack打包,如何开发?

开发时只写代码,依赖什么东西 ,通过命令 publish到线上

编译成功 ->publish到线上->切换到对应的工程版本号

ajax返回,javascript无法切分,按段按文件拆分js

数据库 版本号对应的 js文件 依赖  txt文本  eval()


后台激活指定版本,则该版本上线,不需要上线的流程



