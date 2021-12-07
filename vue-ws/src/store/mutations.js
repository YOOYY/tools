import Vue from 'vue'
import Axios from '../utils/axios.js'
import ws from '../utils/ws.js'
import {translateData,renderMsg} from '../utils/tool.js'
import message from '../plugins/message/index.js'

Vue.use(message)

let mutations = {
    updateState(state,{name,attr,val}) {
        if(attr){
            Vue.set(state[name],attr,val)
        }else{
            state[name] = val;
        }
    },
    updateData(state,[appName,serverId,attr,val]){
        let server;
        if(server = state['data'][appName]?.[serverId]){
            server[attr] = val;
        }
    },
    updateCurrentServerId(state,param){
        if(typeof param === 'string'){
            state.currentServerId = param;
        }else{
            let tabs = this.getters.tabs,tab = tabs[param] || tabs[0];
            state.currentServerId = tab?tab.id:"-1";
        }
    },
    saveFilter(state,value) {
      localStorage.setItem("search", value);
      state.search = value;
    },
    // client -> server:
    clientStopApplication(state,[appName,isCompulsory]){},
    connect(state,[appName,serverId]){
        state['data'][appName][serverId]['isConnect'] = true;
        this.commit("updateCurrentServerId",serverId);
    },
    disconnect(state,[appName,serverId]){
        let server = state['data'][appName][serverId],
            index = this.getters.currentTabIndex-1;
        server['isConnect'] = false;
        server['content'] = '';
        server['command'] = '';

        if(state.currentServerId === serverId){
            this.commit("updateCurrentServerId",index);
        }
    },
    serverCommand(state,[appName,serverId,msg]){
        state['data'][appName][serverId]['content'] += renderMsg('$ADMIN:'+msg);
    },
    clientStartServer(state,[appName,serverId]){},
    killServer(state,[appName,serverId]){},

    // server -> client:
    serverMessage(state,[appName,serverId,msg]){
        state['data'][appName][serverId]['content'] += renderMsg(msg);
    },
    startServer(state,[appName,serverId]){
        state['data'][appName][serverId]['isAlive'] = true;
    },
    stopServer(state,[appName,serverId]){
        let app = state['data'][appName]
        console.log(app)
        console.log(serverId)
        try{
            app && (app[serverId]['isAlive'] = false);
        }catch(e){
            console.log(e)
            alert('这是一个不应该出现的BUG');
        }
    },
    stopApplication(state,[appName]){
        if(state.currentAppName === appName){
            let aliveApps = Object.entries(state['applist']).map(([attr,val],i)=>{
                if(val){
                    return attr;
                }
            });
            if(aliveApps.length <=1){
                state['currentAppName'] = '-1';
            }else{
                let index = aliveApps.indexOf(appName);
                state['currentAppName'] = aliveApps[index-1] || aliveApps[index+1];
                state['currentServerId'] = Object.values(this.getters.currentServers).map(({id,isConnect},i)=>{
                    if(isConnect){
                        return id;
                    }
                })[0] || '-1';
            }
        }
        Vue.delete(state['data'], appName);
        state['applist'][appName] = false;
    },
    startApplication(state,dataArr){
        translateData(state,dataArr);
    },
    error(state,[error]){
        Vue.$message.error({
            message: error,
            duration: false,
        })
    },

    //开启app
    startChannel(state,[appName]) {
        Axios.get('/Start?channel='+appName)
        .then((response) => {
            if(response === 'success'){
                Vue.$message.success('开启成功');
            }
        })
        .catch((error) => {
            state.timeoutError.push(appName);
            Vue.$message.error({
                message: error,
                duration: false,
            })
        })
    },
    initApplist(state,applist){
        applist.forEach(val=>{
            if(!state.applist[val]){
                Vue.set(state.applist,val,false)
            }
        });
    },
    updateWsReadyState(state,msg){
        state.wsReadyState = ws.readyState;
        if(msg){
            Vue.$message.error({
                message: msg,
                duration: false,
            })
        }else{
            switch (ws.readyState) {
                case 1:
                    break;
                case 0:
                    Vue.$message.error({
                        message: "webSocket连接中,请稍后重试",
                        duration: false,
                    })
                    break;
                default:
                    Vue.$message.error({
                        message: "webSocket连接错误,状态码"+socket.readyState,
                        duration: false,
                    })
                    break;
            }
        }

    },
    delTimeout(state,timeoutName){
        let timeoutError = state.timeoutError,
            index = timeoutError.indexOf(timeoutName);
        state.timeoutError.splice(index,1);
    }
}
export default mutations