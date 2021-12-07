import Message from './main.js';
export default {
    install(Vue,options={}){
        Vue.prototype.$message = Vue.$message = Message;
    }
};
// 用法 
//     1. this.$message.info(String | Object)
//     2. Vue.$message.info(String | Object)
//     Object:{
//         message:String,
//         type:(info|success|warning|error),
//         duration:Number(毫秒)
//     }