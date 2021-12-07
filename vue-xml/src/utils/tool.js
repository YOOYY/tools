import Vue from 'vue';
import message from '../plugins/message'

Vue.use(message)

function parseXml(xmlStr,flag) {
    let domParser = new DOMParser(),cardSet=[];
    if(!domParser) {
        Vue.$message.error('不要使用ie或者把浏览器调成极速模式');
        return;
    }
    let xml = domParser.parseFromString(xmlStr, "text/xml");
    let error = xml.getElementsByTagName("parsererror")[0];
    if (error) {
        Vue.$message.error("xml解析出错");
        return;
    }
    let doms = xml.getElementsByTagName("Deck");
    if (!doms.length) {
        Vue.$message.error("xml中未包含Deck节点");
        return;
    }
    for (let i = 0; i < doms.length; i++) {
        let item = doms[i].getAttribute("cards").replace(/\s/g, "").split(","),
            id = doms[i].getAttribute("id");
        if (!id || !item) {
            Vue.$message.error("Deck中缺少cards或id属性");
            return;
        }
        let desc = doms[i].getAttribute("desc") || "未知牌组" + (id ? id : ""),
            obj = createCard(id,desc,item);
            obj.initdata = createCard(id,desc,item);
        cardSet.push(obj);
        if(flag){
            return obj;
        }
    }
    cardSet = cardSet.sort(function(a,b){
        return a.id-b.id;
    })
    return cardSet;
}
function createCard(id,desc,val){
    let card = {
        id,
        desc,
        jiang:[],
        bookmaker:[],
        farmer1:[],
        farmer2:[],
        cardpool:[]
    },data = JSON.parse(JSON.stringify(val)),
    arr = ['bookmaker','farmer1','farmer2'],
    arri = 0;
    card.jiang = Array.from(data.splice(0, 2).sort());

    card.cardpool = Array.from(data.filter((val,index) => {
        return !arr.some((aval,i)=>{
            if(i!== arri) return;
            if(card[aval].filter((cval)=>{
                return cval<=33;
            }).length<(i===0?23:22)){
                card[aval].push(val);
                return true;
            }else{
                arri += 1;
            }
        })
    }));
    card.bookmaker = card.bookmaker.sort();
        while (
          ["34", "35", "36", "37", "38"].includes(
            card.bookmaker[card.bookmaker.length - 1]
          )
        ) {
          card.bookmaker.unshift(card.bookmaker.pop());
    }
    card.farmer1 = card.farmer1.sort();
    while (
          ["34", "35", "36", "37", "38"].includes(
            card.farmer1[card.farmer1.length - 1]
          )
        ) {
          card.farmer1.unshift(card.farmer1.pop());
    }
    card.farmer2 = card.farmer2.sort();
        while (
          ["34", "35", "36", "37", "38"].includes(
            card.farmer2[card.farmer2.length - 1]
          )
        ) {
          card.farmer2.unshift(card.farmer2.pop());
    }
    console.log(card);
    return card;
}
export { parseXml };