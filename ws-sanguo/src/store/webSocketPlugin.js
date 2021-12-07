import WS from '../utils/ws';

let socket = null;
export default function webSocketPlugin () {
  return store => {
    //更改数据时通知服务器
    store.subscribe(({type,payload:params}) => {
        console.log(type);
        console.log(params);
        if(type == 'updateState' && params.name == 'currentServer'){
            if(socket){
                socket.close();
            }
            socket = new WS(store.state.currentServer);
            //监听服务器发送过来的事件触发数据更改
            let events = ['list','info','debug','task','call','signal','mem','stat','service','netstat','gc','error'];
            events.forEach((event)=>{
                socket.on(event, (params) => {
                    store.commit(event, params)
                })
            })
        }else{
            let clientEvents = new Set(['sendMsg']);
            if(!clientEvents.has(type) || (socket.readyState!==1) || (typeof(params) == 'undefind')) return;
            socket.send(params);
        }
    })
  }
}