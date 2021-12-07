发给小白的文件需要把接口地址改为http://10.1.3.223
主要通过vuex的ws插件监听事件发送消息，具体见src/store/webSocketPlugin.js

client -> server:
{"Function":"StopApplication","Params":[appName]}
{"Function":"StopApplication","Params":[appName,true|false]}
{"Function":"Connect","Params":[appName,serverId]}
{"Function":"Disconnect","Params":[appName,serverId]}
{"Function":"ServerCommand","Params":[appName,serverId,message]}
{"Function":"StartServer","Params":[appName,serverId]}
{"Function":"KillServer","Params":[appName,serverId]}

server -> client:
{"Function":"ServerMessage","Params":[serverId,message]}
{"Function":"Error","Params":[message]}
{"Function":"StartApplication","Params":[appName]}
{"Function":"StopApplication","Params":[appName]}
{"Function":"StopServer","Params":[serverId]}

添加多窗口功能，需要配合ws-container一起使用，如果此项目有更新，请及时生成文件同步到ws-container项目下