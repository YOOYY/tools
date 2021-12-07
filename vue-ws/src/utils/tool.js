import Vue from 'vue';

function renderMsg(msg){
    //检索文字:类名
    let logClass = {LOG_TRACE:'',LOG_DEBUG:'',LOG_INFO:'info',LOG_WARN:'warn',LOG_ERROR:'error',LOG_ALARM:'alarm',LOG_FATAL:'fatal',$ADMIN:'admin'},
        regexp = Object.keys(logClass).map((val)=>{
            return val.replace('$','\\$');
        }).join('|'),
        type = msg.match(new RegExp(regexp))?.[0];
    return `<p class="${logClass[type] || ''}">${msg}</p>`;
}

// [{
//     "Name":"pyserver",
//     "Servers":
//         [
//             {
//                 "Id": 1,
//                 "IsAlive": true,
//                 "Name": "WorldServer"
//             }
//         ]
// }]
//转换成
// {
//     "pyserver": {
//         "1":{
//             id: "1",
//             name: "name1",
//             appName: "pyserver",
//             isAlive: true, //未知
//             isConnect: true, //未知
//         }
//     }
// }

function translateData(state,oData){
    if(!Array.isArray(oData)){
        oData = [oData];
    }
    oData.map((val,index) => {
        let servers = Object.setPrototypeOf({}, null),app;
        val.Servers.map((sval,sindex) => {
            let server = Object.setPrototypeOf({
            id: sval.Id+'',
            name: sval.Name,
            content:"",
            command:"",
            isAlive: sval.IsAlive, //未知
            isConnect: false, //未知
            }, null);
            servers[sval.Id] = server;
        });
        if(index === 0){
            state['currentAppName'] = val.Name;
        }
        if(state['data'] == null){
            state['data'] = Object.setPrototypeOf({[val.Name]:servers}, null);
        }else{
            Vue.set(state['data'],val.Name,servers);
        }
        if(app = state['applist'][val.Name]){
            app=true;
        }else{
            Vue.set(state['applist'],val.Name,true);
        }
    })
}

export { translateData, renderMsg };