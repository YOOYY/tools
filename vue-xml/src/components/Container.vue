<template>
  <div id="container">
    <Sidebar @printXml="printXml"></Sidebar>
    <Content v-show="currentAppName" ref="content"></Content>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import Sidebar from "./Sidebar.vue";
import Content from "./Content.vue";

export default {
  name: "Container",
  computed: {
    ...mapState(["currentAppName"]),
  },
  methods: {
    printXml: function () {
      this.$refs.content.printXml(0);
    },
  },
  components: {
    Sidebar,
    Content,
  },
};
</script>

<style lang="scss">
body,
ul,
ol,
h1 {
  margin: 0;
}
body {
  background-color: #282c34;
  font-family: Consolas, Inconsolata, "Microsoft YaHei", Courier, monospace,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  color: #abb2bf;
  user-select: none;
}
ul,
ol {
  list-style-type: none;
  padding-left: 0;
}
ol {
  overflow-x: hidden;
}
ul {
  overflow-y: hidden;
  overflow-x: auto;
}
h1 {
  font-size: 16px;
  font-weight: normal;
}
button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
}
i {
  font-style: normal;
}
.disabled {
  cursor: not-allowed;
}
.w50 {
  width: 50%;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.colflex {
  display: flex;
  flex-direction: column;
}
input {
  background: none;
  border: none;
  box-sizing: border-box;
  color: #abb2bf;
  display: inline-block;
  font-size: inherit;
  height: 28px;
  line-height: 28px;
  outline: none;
  padding: 0 15px;
  vertical-align: bottom;
}
.tag {
  display: inline-block;
  height: 28px;
  padding: 0 10px;
  line-height: 28px;
  font-size: 14px;
  color: #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  background-color: #6f727a3f;
  color: #f0f0f0;
}
#container {
  overflow: hidden;
  padding: 0 1%;
  display: flex;
  height: 100vh;
  background: url("/static/imgs/bg2.png") 65% center no-repeat;
  background-color: #282c34;
}
#sidebar {
  width: 18%;
  background: #21252b;
  text-align: right;
  padding-right: 10px;
  li {
    height: 48px;
    border-bottom: 1px solid #474a4f;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: #2c313a95;
    }
    &.active {
      //   background: url("/static/imgs/bg_select1.jpg") no-repeat;
      //   background-position: 0 0;
      //   color: #ccc;
      //   background-size: cover;
      border-top: 1px solid #91c34d;
      border-bottom: 1px solid #91c34d;
      background: #91c34d22;
      color: #fff;
    }
  }
  .name,
  button,
  .tag {
    margin-right: 10px;
  }
  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex-grow: 1;
    margin-left: 10px;
  }
  .tag {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 4px;
    padding: 0 10px;
    &.success {
      background-color: rgba(103, 194, 58, 0.1);
      color: #67c23a;
    }
    &.error {
      background-color: hsla(220, 4%, 58%, 0.1);
      color: #909399;
    }
  }
  button {
    width: 78px;
    height: 30px;
    line-height: 30px;
    color: #c4c4c4;
    font-size: 12px;
    white-space: nowrap;
    border: 1px solid #c4c4c4;
    border-radius: 4px;
    outline: none;
    padding: 0 15px;
    &.success {
      border-color: #318a7580;
      background-color: #318a7520;
    }
    &.error {
      background-color: #be555520;
      border-color: #be555580;
    }
    &.disabled {
      background-color: hsla(220, 4%, 58%, 0.1);
      border-color: hsla(220, 4%, 58%, 0.2);
      color: #909399;
    }
  }
}

.server_box {
  height: 90%;
  margin: 10px 0 20px 0;
  border-bottom: 1px solid #474a4f;
  overflow: hidden;
}
#applist {
  flex-shrink: 0;
  max-height: 150px;
}
#main {
  width: 78%;
  flex-grow: 1;
  height: 100vh;
  background: #282c34;
}

.scrollbar-row {
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 1px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
  }
}
.scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
    height: 1px;
  }
}
.scrollbar-row,
.scrollbar {
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 6px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #313742;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    background: #21252b;
  }
}
</style>