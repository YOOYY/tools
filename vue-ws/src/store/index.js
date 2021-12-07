import Vue from 'vue'
import Vuex from 'vuex'
import Axios from '../utils/axios.js'
import ws from '../utils/ws.js'
import mutations from './mutations.js'
import webSocketPlugin from './webSocketPlugin.js'
import message from '../plugins/message'
Vue.use(Vuex)
Vue.use(message);

const store = new Vuex.Store({
    state: {
        applist:{},
        data:null,
        currentAppName:'',
        currentServerId:"-1",
        wsReadyState:0,
        timeoutError:[],
        search:localStorage.getItem("search") || ""
    },
    getters: {
        hasActiveApps(state,getters){
            return Object.values(state.applist).some((val,i)=>{
                return val === true;
            }) && getters.tabs.length>0
        },
        currentServers(state){
            //es7语法，当data为undefind时返回undefind而不报错
            let obj,res = {};
            if(obj = state.data?.[state.currentAppName]){
                if(!state.search){
                    return obj;
                }
                for(let i in obj){
                    if(obj[i].name.toLowerCase().includes(state.search.toLowerCase())){
                        res[i] = obj[i]
                    }
                }
                return res;
            }else{
                return {};
            }
        },
        tabs(state,getters){
            return Object.values(getters.currentServers).filter((val,i) =>{
                return val.isConnect;
            })
        },
        currentTabIndex(state,getters){
            let index = -1;
            getters.tabs.some((val,i) =>{
                if(val.id === state.currentServerId){
                    index = i;
                    return true;
                }
            })
            return index;
        }
    },
    mutations: mutations,
    actions: {
        init({commit}){
            Axios.get('/Status')
            .then((data) => {
                commit('startApplication',data)
                return Axios.get('/Config')
            })
            .then((applist) => {
                commit('initApplist',applist)
            })
            .catch((error) => {
                Vue.$message.error({
                    message: error,
                    duration: false,
                })
            })
        }
    },
    plugins: [webSocketPlugin(ws)]
})

store.dispatch('init')
export default store;