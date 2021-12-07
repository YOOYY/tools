<template>
  <div id="sidebar" class="colflex">
    <ol id="applist" class="scrollbar">
      <li
        :class="name === currentAppName ? 'active' : ''"
        @click="appClick(name)"
        v-for="name in applist"
        :key="name"
      >
        <span class="name">{{ name }}</span>
      </li>
    </ol>
    <div class="server_box">
      <h1>
        牌组列表 <button class="fr" @click="createCard">新建牌组</button>
        <button class="fr" @click="saveXml">保存配置</button>
      </h1>
      <ol id="serverlist" class="scrollbar">
        <li
          :class="index === currentCardIndex ? 'active' : ''"
          @click="cardClick(index)"
          v-for="(val, index) in currentCardList"
          :key="index"
        >
          <span class="name">{{ val.desc }}</span>
          <button @click.stop="deleteCard(index)">删除</button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Axios from "../utils/axios.js";

export default {
  name: "AppList",
  computed: {
    ...mapState(["currentAppName", "currentCardIndex", "appSet"]),
    ...mapGetters(["applist", "currentCardList"]),
  },
  methods: {
    appClick(name) {
      this.updateState({ name: "currentAppName", val: name });
      this.updateState({ name: "currentCardIndex", val: 0 });
      this.$emit("printXml");
    },
    cardClick(index) {
      this.updateState({ name: "currentCardIndex", val: index });
      this.$emit("printXml");
    },
    //保存到服务器
    saveXml() {
      let cardSet = this.currentCardList,
        xml = "",
        i;
      console.log(cardSet);
      let idSet = new Set();

      //验证牌组
      let noerror = cardSet.every((item) => {
        let sp = item.jiang.filter((val) => {
          return val <= 33;
        }).length;
        if (!item.id) {
          this.$message.error({
            message: `${item.desc}中缺少id`,
            duration: false,
          });
          return false;
        }
        if (idSet.has(item.id)) {
          this.$message.error({
            message: `${item.desc}中id重复`,
            duration: false,
          });
          return false;
        } else {
          idSet.add(item.id);
        }
        if (!item.desc) {
          this.$message.error({
            message: `id:${item.id}中缺少desc`,
            duration: false,
          });
          return false;
        }
        if (item.jiang.length !== 2) {
          this.$message.error({
            message: `${item.desc}中将牌数量不足`,
            duration: false,
          });
          return false;
        }
        if (
          item.bookmaker.filter((val) => {
            return val <= 33;
          }).length !== 23
        ) {
          this.$message.error({
            message: `${item.desc}中庄家数量不足`,
            duration: false,
          });
          return false;
        }
        if (
          item.farmer1.filter((val) => {
            return val <= 33;
          }).length !== 22
        ) {
          this.$message.error({
            message: `${item.desc}中农民1数量不足`,
            duration: false,
          });
          return false;
        }
        if (
          item.farmer2.filter((val) => {
            return val <= 33;
          }).length !== 22
        ) {
          this.$message.error({
            message: `${item.desc}中农民2数量不足`,
            duration: false,
          });
          return false;
        }
        if (
          item.cardpool.filter((val) => {
            return val <= 33;
          }).length !==
          53 - sp
        ) {
          this.$message.error({
            message: `${item.desc}中剩余卡牌数量不足`,
            duration: false,
          });
          return false;
        }
        let testCard = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "31",
            "31",
            "31",
            "31",
            "32",
            "32",
            "32",
            "32",
            "33",
            "33",
            "33",
            "33",
            "34",
            "35",
            "36",
            "37",
            "38",
          ].sort(),
          testItem = [
            item.bookmaker,
            item.farmer1,
            item.farmer2,
            item.jiang,
            item.cardpool,
          ],
          index = -1,
          testFlag = testItem.every((val, i) => {
            return val.every((sval, si) => {
              if ((index = testCard.indexOf(sval)) > -1) {
                testCard.splice(index, 1);
                return true;
              } else {
                let error = testItem
                  .map((v, ei) => {
                    let errorname = [
                      "bookmaker",
                      "farmer1",
                      "farmer2",
                      "jiang",
                      "cardpool",
                    ];
                    if (v.indexOf(sval) > -1) {
                      return errorname[ei];
                    }
                  })
                  .filter((ev) => {
                    console.log(ev);
                    return !!ev;
                  })
                  .join(" ");
                this.$message.error({
                  message: `${item.desc}---${error}---${sval}数量过多`,
                  duration: false,
                });
              }
            });
          });

        if (!testFlag) return false;
        if (testCard.length > 0) {
          this.$message.error({
            message: `${item.desc}---卡牌缺少---${testCard.join(" ")}`,
            duration: false,
          });
          return false;
        }
        let cards =
          item.jiang.join() +
          ",\n" +
          item.bookmaker.join() +
          ",\n" +
          item.farmer1.join() +
          ",\n" +
          item.farmer2.join() +
          ",\n" +
          item.cardpool.join();
        xml += `\n<Deck id="${item.id}" desc="${item.desc}" cards="\n${cards}\n"/>\n`;
        return true;
      });
      xml = `<?xml version="1.0" encoding="UTF-8"?><root>${xml}</root>`;
      console.log(xml);
      if (
        noerror &&
        this.$message.confirm("确定保存到服务器-----" + this.currentAppName)
      ) {
        Axios.put(
          "./Save?channel=" +
            this.currentAppName +
            "&file=../cfg/ntcp/ntcpDeck.xml",
          xml
        )
          .then((data) => {
            if (data === "success") {
              return Axios.put(
                "./Save?channel=" +
                  this.currentAppName +
                  "&file=../cfg/ntcp/ntcpDeck.xml.bak",
                xml
              );
            } else {
              this.$message.error("保存失败:" + data);
              return "oerror";
            }
          })
          .then((res) => {
            if (res === "success") {
              return Axios.get(
                `/Command?channel=${this.currentAppName}&command=HotGameConfig 14 ntcpDeck&server=`
              );
            } else {
              this.$message.error("保存备份失败:" + res);
              return "oerror";
            }
          })
          .then((nres) => {
            if (nres === "success") {
              this.$message.success("保存成功");
            } else if (nres !== "oerror") {
              this.$message.error("运行命令失败:" + nres);
            }
          });
      }
    },
    ...mapMutations(["updateState", "createCard", "deleteCard"]),
  },
};
</script>

<style lang="scss">
.server_box h1 {
  text-align: left;
  color: #eee;
  font-size: 14px;
  background: #282c34;
  box-shadow: 0 3px 6px -2px #131518;
  padding: 8px 0;
  line-height: 30px;
}
</style>