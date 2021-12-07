<template>
  <div id="main" class="colflex">
    <div class="cards">
      <div class="cardbox">
        <div class="title">
          <label for="desc" class="input"
            ><i class="tag">desc</i
            ><input
              type="text"
              id="desc"
              v-model="desc"
              autocomplete="off"
              :disabled="!edit"
              :class="edit ? 'edit' : ''"
            />
          </label>
          <label for="id" class="input"
            ><i class="tag">id</i>
            <input
              type="text"
              id="id"
              v-model="id"
              :disabled="!edit"
              autocomplete="off"
              :class="edit ? 'edit' : ''"
            />
          </label>
          <button @click="toggleModel()">
            {{ edit ? "编辑模式" : "预览模式" }}
          </button>
          <button @click="reset()" v-show="edit">重置</button>
        </div>
        <div class="cardpool scrollbar">
          <vuedraggable class="wrapper" v-model="cardpool">
            <transition-group>
              <img
                :src="'/static/imgs/' + item + '.png'"
                v-for="(item, index) in cardpool"
                :key="index"
                @click="select(item, index)"
              />
            </transition-group>
          </vuedraggable>
        </div>
      </div>
      <div class="cardbox w50" @dragstart.prevent="preventHandle">
        <div class="title">
          <i class="tag">庄家</i>
          <button
            @click="toggleType('bookmaker')"
            v-show="edit"
            :class="type === 'bookmaker' ? 'active' : ''"
          >
            {{ type === "bookmaker" ? "已选择" : "选择" }}
          </button>
        </div>
        <div class="singlecard scrollbar">
          <img
            :src="'/static/imgs/' + item + '.png'"
            v-for="(item, index) in bookmaker"
            :key="index"
            @click="selectRev('bookmaker', item, index)"
          />
        </div>
      </div>
      <div class="cardbox w50" @dragstart.prevent="preventHandle">
        <div class="title">
          <i class="tag">农民1</i>
          <button
            @click="toggleType('farmer1')"
            v-show="edit"
            :class="type === 'farmer1' ? 'active' : ''"
          >
            {{ type === "farmer1" ? "已选择" : "选择" }}
          </button>
        </div>
        <div class="singlecard scrollbar">
          <img
            :src="'/static/imgs/' + item + '.png'"
            v-for="(item, index) in farmer1"
            :key="index"
            @click="selectRev('farmer1', item, index)"
          />
        </div>
      </div>
      <div class="cardbox w50" @dragstart.prevent="preventHandle">
        <div class="title">
          <i class="tag">农民2</i>
          <button
            @click="toggleType('farmer2')"
            v-show="edit"
            :class="type === 'farmer2' ? 'active' : ''"
          >
            {{ type === "farmer2" ? "已选择" : "选择" }}
          </button>
        </div>
        <div class="singlecard scrollbar">
          <img
            :src="'/static/imgs/' + item + '.png'"
            v-for="(item, index) in farmer2"
            :key="index"
            @click="selectRev('farmer2', item, index)"
          />
        </div>
      </div>
      <div class="cardbox w50" @dragstart.prevent="preventHandle">
        <div class="title">
          <i class="tag">将</i>
          <button
            @click="toggleType('jiang')"
            v-show="edit"
            :class="type === 'jiang' ? 'active' : ''"
          >
            {{ type === "jiang" ? "已选择" : "选择" }}
          </button>
        </div>
        <div>
          <img
            :src="'/static/imgs/' + item + '.png'"
            v-for="(item, index) in jiang"
            :key="index"
            @click="selectRev('jiang', item, index)"
          />
        </div>
      </div>
    </div>
    <textarea
      name="xml"
      id=""
      cols="30"
      rows="10"
      v-model="xml"
      class="scrollbar"
      :disabled="!edit"
    ></textarea>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import vuedraggable from "vuedraggable";

export default {
  name: "Content",
  data() {
    return {
      edit: false,
      type: "",
      xml: "",
      timeoutFlag: false,
    };
  },
  computed: {
    jiang: function () {
      return this.currentCard?.jiang || [];
    },
    bookmaker: function () {
      return this.currentCard?.bookmaker || [];
    },
    farmer1: function () {
      return this.currentCard?.farmer1 || [];
    },
    farmer2: function () {
      return this.currentCard?.farmer2 || [];
    },
    cardpool: {
      get() {
        return this.currentCard?.cardpool || [];
      },
      set(val) {
        if (this.edit) {
          this.updateCurrentCardAttr({ attr: "cardpool", val: val });
          this.printXml();
        }
      },
    },
    id: {
      get: function () {
        return this.currentCard?.id || "";
      },
      set: function (val) {
        this.updateCurrentCardAttr({ attr: "id", val });
        this.printXml();
      },
    },
    desc: {
      get: function () {
        return this.currentCard?.desc || "";
      },
      set: function (val) {
        this.updateCurrentCardAttr({ attr: "desc", val });
        this.printXml();
      },
    },

    ...mapState(["currentAppName", "currentCardIndex"]),
    ...mapGetters(["applist", "currentCard"]),
  },
  methods: {
    //阻止默认事件，好像可以去掉
    preventHandle: function () {},
    select: function (item, index) {
      if (this.check(item)) {
        this.cardpool.splice(index, 1);
        this[this.type].push(item);
        this[this.type].sort();
        if (this.type !== "jiang") {
          while (
            ["34", "35", "36", "37", "38"].includes(
              this[this.type][this[this.type].length - 1]
            )
          ) {
            this[this.type].unshift(this[this.type].pop());
          }
        }
        this.printXml();
      }
    },
    selectRev: function (type, item, index) {
      if (!this.edit) return;
      this.type = type;
      this[type].splice(index, 1);
      this[type].sort();
      if (type !== "jiang") {
        while (
          ["34", "35", "36", "37", "38"].includes(
            this[type][this[type].length - 1]
          )
        ) {
          this[type].unshift(this[type].pop());
        }
      }
      this.cardpool.push(item);
      this.printXml();
    },
    check: function (value) {
      if (!this.edit) return;
      if (!this.type) {
        this.$message.error("未选择类型");
        return;
      }
      switch (this.type) {
        case "jiang":
          if (this.jiang.length >= 2) {
            this.$message.warn("超过最大上限");
            return;
          }
          break;
        case "bookmaker":
          if (
            this.bookmaker.filter((val) => {
              return val <= 33;
            }).length >= 23
          ) {
            this.$message.warn("超过最大上限");
            return;
          }
          break;
        case "farmer1":
          if (
            this.farmer1.filter((val) => {
              return val <= 33;
            }).length >= 22
          ) {
            this.$message.warn("超过最大上限");
            return;
          }
          break;
        case "farmer2":
          if (
            this.farmer2.filter((val) => {
              return val <= 33;
            }).length >= 22
          ) {
            this.$message.warn("超过最大上限");
            return;
          }
          break;
        default:
          break;
      }
      return true;
    },
    toggleModel() {
      this.edit = !this.edit;
    },
    toggleType(type) {
      this.type = type;
    },
    //生成代码区xml
    printXml(time = 600) {
      if (this.timeoutFlag) {
        clearTimeout(this.timeoutFlag);
      }
      this.timeoutFlag = setTimeout(() => {
        let cards = this.createCardStr();
        this.xml = `<Deck id="${this.id}" desc="${this.desc}" cards="${cards}"/>`;
      }, time);
    },
    reset() {
      this.updateCurrentCard(this.currentCard.initdata);
      this.updateCurrentCardAttr({
        attr: "initdata",
        val: JSON.parse(JSON.stringify(this.currentCard)),
      });
      this.printXml();
    },
    parseSimpleXml() {
      let domParser = new DOMParser();
      if (!domParser) {
        this.$message.error("不要使用ie或者把浏览器调成极速模式");
        return;
      }
      let xml = domParser.parseFromString(this.xml, "text/xml");
      let error = xml.getElementsByTagName("parsererror")[0];
      if (error) {
        this.$message.error("xml解析出错");
        return;
      }
      let doms = xml.getElementsByTagName("Deck");
      if (!doms.length) {
        this.$message.error("xml中未包含Deck节点");
        return;
      }
      let cards = doms[0].getAttribute("cards").replace(/\s/g, "").split(","),
        id = doms[0].getAttribute("id"),
        desc = doms[0].getAttribute("desc"),
        cardsArr = [];
      if (!id || !cards || !desc) {
        this.$message.error({
          message: `Deck中缺少必要属性`,
          duration: false,
        });
        return;
      }
      let jiang = cards.splice(0, 2).sort(),
        bookmaker = [],
        farmer1 = [],
        farmer2 = [],
        arr = [bookmaker, farmer1, farmer2],
        arri = 0,
        cardpool = Array.from(
          cards.filter((val, index) => {
            return !arr.some((aval, i) => {
              if (i !== arri) return;
              if (
                aval.filter((cval) => {
                  return cval <= 33;
                }).length < (i === 0 ? 23 : 22)
              ) {
                aval.push(val);
                return true;
              } else {
                arri += 1;
              }
            });
          })
        );
      bookmaker = bookmaker.sort();
      while (
        ["34", "35", "36", "37", "38"].includes(bookmaker[bookmaker.length - 1])
      ) {
        bookmaker.unshift(bookmaker.pop());
      }
      farmer1 = farmer1.sort();
      while (
        ["34", "35", "36", "37", "38"].includes(farmer1[farmer1.length - 1])
      ) {
        farmer1.unshift(farmer1.pop());
      }
      farmer2 = farmer2.sort();
      while (
        ["34", "35", "36", "37", "38"].includes(farmer2[farmer2.length - 1])
      ) {
        farmer2.unshift(farmer2.pop());
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
        testItem = [bookmaker, farmer1, farmer2, jiang, cardpool],
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
                message: `${error}---${sval}数量过多`,
                duration: false,
              });
            }
          });
        });

      if (!testFlag) return false;
      if (testCard.length > 0) {
        this.$message.error({
          message: `卡牌缺少---${testCard.join(" ")}`,
          duration: false,
        });
        return false;
      }

      this.updateCurrentCardAttr({ attr: "id", val: id });
      this.updateCurrentCardAttr({ attr: "desc", val: desc });
      this.updateCurrentCardAttr({ attr: "jiang", val: jiang });
      this.updateCurrentCardAttr({ attr: "bookmaker", val: bookmaker });
      this.updateCurrentCardAttr({ attr: "farmer1", val: farmer1 });
      this.updateCurrentCardAttr({ attr: "farmer2", val: farmer2 });
      this.updateCurrentCardAttr({ attr: "cardpool", val: cardpool });

      this.printXml(0);
    },
    //生成代码区xml中构建card属性字符串
    createCardStr() {
      let cardsArr = [];
      cardsArr[0] = this.jiang.join();
      cardsArr[1] = this.bookmaker.join();
      cardsArr[2] = this.farmer1.join();
      cardsArr[3] = this.farmer2.join();
      cardsArr[4] = this.cardpool.join();
      cardsArr = cardsArr.map(function (item, index) {
        if (index === 4) {
          return item;
        } else if (item) {
          return item + ",";
        } else {
          return "";
        }
      });
      return `\n${cardsArr.join("\n\n")}\n`;
    },
    ...mapMutations(["updateCurrentCard", "updateCurrentCardAttr"]),
  },
  updated() {
    // console.log(this.cardpool);
  },
  created() {
    //83 s键
    document.onkeydown = (e) => {
      if (!e.ctrlKey) return;
      let key = e.keyCode;
      switch (key) {
        case 83:
          if (this.edit) {
            this.parseSimpleXml();
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    };
  },
  components: { vuedraggable },
};
</script>

<style lang="scss">
img {
  width: 25px;
}
.title {
  margin: 10px 0px;
  height: 28px;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
}
#main {
  button {
    width: 78px;
    height: 28px;
    line-height: 28px;
    color: #c4c4c4;
    font-size: 12px;
    white-space: nowrap;
    border: 1px solid #c4c4c4;
    border-radius: 4px;
    outline: none;
    padding: 0 10px;
    margin-left: 10px;
    &.active {
      color: rgb(233, 233, 233);
      background-color: #55a030;
      border-color: #67c23a;
      border: none;
    }
  }
}
.input {
  margin-left: 20px;
  &:first-child {
    margin-left: 0;
  }
  input {
    margin-left: 10px;
    &.edit {
      border: 1px solid #86878a;
    }
  }
}
.cardbox {
  width: 100%;
}
textarea {
  color: #abb2bf;
  font-family: Consolas, Inconsolata, Courier, monospace, sans-serif;
  font-size: 16px;
  background: none;
  border: 1px solid #86878a;
  outline: none;
  box-sizing: border-box;
  height: 30vh;
  margin-top: 20px;
  resize: none;
}
.cardpool {
  height: 232px;
  overflow: auto;
}
.singlecard {
  height: 116px;
  overflow: auto;
}
</style>