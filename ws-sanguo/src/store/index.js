import Vue from 'vue'
import Vuex from 'vuex'
import webSocketPlugin from './webSocketPlugin.js'
import { Message } from 'element-ui';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentServer:'',
        currentAddress:'',
        list:null,
        infoContent:'',
        debugContent:{
            ctx:'',
            stack:'',
            var:'',
            state:0 //1 开启 0 关闭 2 loading
        },
        taskContent:'',
        callContent:'',
        signalContent:'',
        mem:{},
        stat:{},
        service:{},
        netstat:[]
    },
    mutations: {
        // client -> server:
        sendMsg(state,params){
            switch (params.split(' ')[0]) {
                case 'debug':
                    state.debugContent.state = 2;
                    break;
                case 'info':
                    state.infoContent = '';
                    break;
                case 'task':
                    state.taskContent = '';
                    break;
                case 'signal':
                    state.signalContent = '';
                    break;
                default:
                    break;
            }
            // if(params.indexOf('debug')>=0){
            //     
            // }
        },
        // server -> client:
        list(state,params){
            state.list = params;
        },
        info(state,params){
            state.infoContent = params;
        },
        debug(state,params){
            state.debugContent.state = 1;
            if(typeof params == 'string'){
                state.debugContent.ctx += params + '\n';
            }else{
                state.debugContent.ctx += params.ctx + '\n';
                state.debugContent.stack = params.stack;
                state.debugContent.var = params.var;
            }
        },
        task(state,params){
            state.taskContent = params;
        },
        call(state,params){
            state.callContent += JSON.stringify(params) + '\n';
        },
        signal(state,params){
            state.signalContent = params;
        },
        mem(state,params){
            state.mem = params;
        },
        stat(state,params){
            state.stat = params;
        },
        service(state,params){
            state.service = params;
        },
        netstat(state,params){
            state.netstat = params;
        },
        gc(state,params){
            state.mem = params;
        },
        showMon(){
            this.commit("sendMsg",'mem');
            this.commit("sendMsg",'stat');
            this.commit("sendMsg",'service');
            this.commit("sendMsg",'netstat');
        },
        stopDebug(state,flag = false){
            if((state.debugContent.state === 1) && !flag){
                this.commit("sendMsg",'cont');
            }
            state.debugContent.ctx = '';
            state.debugContent.stack = '';
            state.debugContent.var = '';
            state.debugContent.state = 0;
        },
        clear(state,flag = false){
            if(flag){
                state.currentAddress = '';
                state.list = null;
            }
            this.commit("stopDebug",flag);
            state.infoContent = state.taskContent = state.callContent = state.signalContent = '';
        },
        updateState(state,{name,attr,val}) {
            if(attr){
                Vue.set(state[name],attr,val)
            }else{
                state[name] = val;
            }
        },
        error(state,msg){
            Message.error({
                showClose: true,
                message: msg,
                duration:0
            });
        }
    },
    actions: {
    },
    plugins: [webSocketPlugin()]
})
