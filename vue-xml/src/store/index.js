import Vue from 'vue'
import Vuex from 'vuex'
import Axios from '../utils/axios.js'
import {parseXml} from '../utils/tool.js'
import message from '../plugins/message'
Vue.use(Vuex)
Vue.use(message);

const store = new Vuex.Store({
    state: {
        appSet:[],
        currentAppName:'',
        currentCardIndex:0
    },
    getters: {
        applist:function(state){
            return state.appSet.map((val)=>{
                return val.name;
            })
        },
        currentAppIndex:(state,getters)=>{
            return getters.applist.indexOf(state.currentAppName);
        },
        currentCardList:(state,getters) =>{
            if(getters.currentAppIndex>=0){
                return state.appSet[getters.currentAppIndex].cardSet;
            }
            return [];
        },
        currentCard:(state,getters)=>{
            return getters.currentCardList[state.currentCardIndex] || {};
        }
    },
    mutations: {
        updateState(state,{name,attr,val}) {
            if(attr){
                Vue.set(state[name],attr,val)
            }else{
                state[name] = val;
            }
        },
        updateCurrentCard(state,val){
            Vue.set(this.getters.currentCardList,state.currentCardIndex,val);
        },
        updateCurrentCardAttr(state,{attr,val}){
            Vue.set(this.getters.currentCard,attr,val)
        },
        createCard(state){
            if(this.getters.currentAppIndex>=0){
                let cardSet = this.getters.currentCardList;
                let obj = {
                    id: Number(cardSet[cardSet.length-1].id) +1+'',
                    desc: "新建牌组",
                    cardpool: ["01","01","01","01","02","02","02","02","03","03","03","03","04","04","04","04","05","05","05","05","06","06","06","06","07","07","07","07","08","08","08","08","09","09","09","09","11","11","11","11","12","12","12","12","13","13","13","13","14","14","14","14","15","15","15","15","16","16","16","16","17","17","17","17","18","18","18","18","19","19","19","19","21","21","21","21","22","22","22","22","23","23","23","23","24","24","24","24","25","25","25","25","26","26","26","26","27","27","27","27","28","28","28","28","29","29","29","29","31","31","31","31","32","32","32","32","33","33","33","33","34","35","36","37","38"],
                    bookmaker: [],
                    farmer1: [],
                    farmer2: [],
                    jiang: [],
                };
                cardSet.push(obj);

                state.currentCardIndex = cardSet.length-1;
            }
        },
        deleteCard(state,index){
            if(Vue.$message.confirm("确定删除?")){
                Vue.delete(this.getters.currentCardList,index);
                console.log(index)
                console.log(state.currentCardIndex);
                if(index === state.currentCardIndex && index>0){
                    state.currentCardIndex = index -1;
                }
                if(index<state.currentCardIndex){
                    state.currentCardIndex -= 1;
                }
            }
        }
    },
    actions: {
        init({state}){
            let appSet = [];
            Axios.get('/Status')
            .then((data) => {
                let cardSets = [];
                appSet = data.map(v => {
                    let o = {
                        name:v.Name,
                    }
                    cardSets.push(Axios.get('/Read',{
                        params: {
                            channel:v.Name,
                            file:'../cfg/ntcp/ntcpDeck.xml'
                        }
                    }))
                    return o;
                });
                return Axios.all(cardSets);
            })
            .then(function(res){
                    appSet.forEach((v,i) => {
                        appSet[i]['cardSet'] = parseXml(res[i]);
                    });
                    console.log(appSet)
                    Vue.set(state,'appSet',appSet)
            })
            .catch((error) => {
                Vue.$message.error({
                    message: error,
                    duration: false,
                })
            })
        }
    },
})
store.dispatch('init')
export default store;