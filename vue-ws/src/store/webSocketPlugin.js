
export default function webSocketPlugin (socket) {
  return store => {
      //监听服务器发送过来的事件触发数据更改
    let events = ['serverMessage','error','startApplication','stopApplication','stopServer','startServer'];
    events.forEach((event)=>{
        socket.on(event, (params) => {
            store.commit(event, params)
        })
    })
 
    let clientEvents = new Set(['clientStopApplication','connect','disconnect','serverCommand','clientStartServer','killServer']);
    //更改数据时通知服务器
    store.subscribe(({type,payload:params}) => {
        if(!clientEvents.has(type) || (socket.readyState!==1)) return;
        console.log(type);
        console.log(params);
        if(type === 'clientStopApplication'){
            type = "stopApplication";
        }else if(type === 'clientStartServer'){
            type = "startServer";
        }
        type = type.charAt(0).toUpperCase() + type.slice(1);
        let data = JSON.stringify({ Function: type, Params: params });
        socket.send(data);
    })
  }
}