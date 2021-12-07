<template>
  <div id="container">
    <div id="sidebar" class="colflex">
      <AppList></AppList>
      <ServerList></ServerList>
    </div>
    <div id="main" class="colflex" v-show="hasActiveApps">
      <TabList></TabList>
      <Content></Content>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import AppList from "./AppList.vue";
import ServerList from "./ServerList.vue";
import TabList from "./TabList.vue";
import Content from "./Content.vue";

export default {
  name: "Container",
  computed: {
    ...mapGetters(["hasActiveApps"]),
  },
  components: {
    AppList,
    ServerList,
    TabList,
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
input {
  color: #abb2bf;
  border: none;
  outline: none;
  background: none;
}
// input:-internal-autofill-selected {
//   background-color: none !important;

// }
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #21252b inset;
}
.disabled {
  cursor: not-allowed;
}
.colflex {
  display: flex;
  flex-direction: column;
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
  width: 22%;
  background: #21252b;
  text-align: right;
  padding-right: 10px;
  li {
    height: 48px;
    border-bottom: 1px solid #474a4f;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background: #2c313a95;
    }
    &.active {
      background: #2c313a;
      color: #ccc;
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
    height: 32px;
    line-height: 30px;
    color: #ddd;
    font-size: 12px;
    white-space: nowrap;
    border: 1px solid #dcdfe6;
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
  .active {
    background-size: contain;
  }
}

.server_box {
  height: 80%;
  margin: 10px 0 10vh 0;
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