import Axios from 'axios';

Axios.defaults.withCredentials = false;
Axios.defaults.timeout = 20000,

Axios.interceptors.response.use(({data}) => {
    return data;
},(error) => {
    let msg = '';
    if (error.response) {
        //请求已发出，但服务器使用状态代码进行响应
        //落在2xx的范围之外
        msg = '服务器响应异常';
        console.log(error.response);
    } else if (error.request) {
        //已提出请求，但未收到任何回复
        //`error.request`是浏览器中XMLHttpRequest的一个实例，是node.js中http.ClientRequest的一个实例
        msg = '未连接到服务器';
        console.log(error.request);
    } else {
        // 在设置触发错误的请求时发生了错误
        msg = error.message;
        console.log(error.message);
    }
    console.log(error.config);
    console.log(error);
    return Promise.reject(msg);
});

export default Axios