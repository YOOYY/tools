<template>
<el-container class="vh100">
    <SideBar></SideBar>
    <Tablist />
</el-container>
</template>

<script>
import SideBar from './SideBar.vue';
import Tablist from './TabList.vue';

export default {
  name: "Container",
  components: {
    SideBar,
    Tablist
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
.success{
    background-color: #67C23A;
}
.error{
    background-color: #F56C6C;
}
.warning{
    background-color: #E6A23C;
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
    overflow: hidden;
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
.vh100{
    height: 100vh;
}
.h100{
    height: 100%;
}
.fl{
    float: left;
}
.ml10{
    margin-left: 10px;
}
.mr10{
    margin-right: 10px;
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
code {
    flex: 1;
    overflow-y: auto;
    display: block;
    box-sizing: border-box;
    font-family: Consolas, Inconsolata, Courier, monospace, sans-serif;
    line-height: 30px;
    word-wrap: break-word;
    white-space: pre-wrap;
    hyphens: auto;
    background-color: #282c34;
    background-size: cover;
    border: 1px solid #3b4048;
    border-radius: 4px;
    padding: 4px 10px;
    user-select: text;
}
.panel{
    height: calc(100vh - 41px);
    width: 100%;
    display: flex;
    flex-direction: column;
}
.sendinput{
    width: calc(100% - 100px);
    margin: 10px 10px 10px 0;
}
</style>