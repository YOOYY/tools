import Vue from 'vue'
import config from '../config.js';
import store from '../store'
import {isJSON} from './tool'

function WS(url){
    let ws = new WebSocket('ws://'+url+':9000'),
        l = {};

    ws.on = function(type,callback){
        l[type] = callback;
    }

    ws.onmessage = function (evt) {
        let data,type,res = isJSON(evt.data);
        if(res && res.func){
            data = res.data;
            type = res.func;
        }else{
            type = 'debug';
            data = res?res:evt.data;
        }
        if(l[type]){
            l[type].call(ws,data);
        }
    };

    ws.onopen = function(){
        store.commit('sendMsg','list');
    };

    ws.onerror = function(error){
        console.log(error);
        store.commit('error','webSocket连接错误');
    }

    ws.onclose = function(e){
        store.commit('clear',true);
    };
    return ws;
}

export default WS;