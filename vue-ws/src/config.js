function GetQueryString(name) {
    var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
    var r=window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(r[2]);
    return undefined;
}
var ip=GetQueryString('ip') || '10.1.3.223',
    axiosUrl = `http://${ip}:8080`,
    wsUrl = `ws://${ip}:8081`;
console.log('当前ip:'+ip);
export default {
    axiosUrl,
    wsUrl
}