import Vue from 'vue'
import store from './store'
import App from './App.vue'

//消息显示框
import message from './plugins/message'

Vue.use(message);
Vue.config.productionTip = false;
new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
