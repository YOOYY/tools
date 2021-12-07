import Vue from 'vue'
import config from '../config.js';
import message from '../plugins/message'
import store from '../store'

Vue.use(message);
let ws = new WebSocket(config.wsUrl),
    l = {};

ws.on = function(type,callback){
    l[type] = callback;
}

ws.onmessage = function (evt) {
    let {Function:type,Params:params} = JSON.parse(evt.data);
    console.log(type);
    console.log(params);
    params.forEach((val,i,arr) => {
        if(val[0] === '[' || val[0] === '{'){
            arr[i] = JSON.parse(val);
        }
    });

    type = type.charAt(0).toLowerCase() + type.slice(1);
    
    if(l[type]){
        l[type].call(ws,params);
    }
};

ws.onopen = function(){};

ws.onerror = function(error){
    console.log(error);
    store.commit('updateWsReadyState','webSocket错误');
}

ws.onclose = function(e){
    console.log(e);
    store.commit('updateWsReadyState','webSocket连接已关闭')
};

export default ws