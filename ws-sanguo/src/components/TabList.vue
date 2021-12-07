<template>
    <el-container>
        <div class="btnbar" v-show="currentServer">
            <el-button type="danger" size="mini" @click="toggle">{{mshow?'主面板':'监控'}}</el-button>
            <el-button type="danger" size="mini" @click="sendMsg('gc')">强制GC</el-button>
            <el-button type="danger" size="mini" @click="sendMsg('clearcache')">删除代码缓存</el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class="tablist" v-show="!mshow && currentServer && currentAddress">
            <el-tab-pane label="基础信息" name="info"><Info /></el-tab-pane>
            <el-tab-pane label="调试" name="debug"><Console /></el-tab-pane>
            <el-tab-pane label="任务列表" name="task"><Task /></el-tab-pane>
            <el-tab-pane label="调用方法" name="call"><Method /></el-tab-pane>
            <el-tab-pane label="信号量" name="signal"><Signal /></el-tab-pane>
        </el-tabs>
        <Monitor v-show="mshow"/>
    </el-container>
</template>
<script>

import { mapState, mapMutations } from "vuex";
import Info from "./Info.vue";
import Console from "./Console.vue";
import Task from "./Task.vue";
import Method from "./Method.vue";
import Signal from "./Signal.vue";
import Monitor from "./Monitor.vue";

export default {
    name: "TabList",
    data(){
        return {
            activeName:'',
            mshow:false
        }
    },
    methods:{
        toggle(){
            this.mshow = !this.mshow;
            if(this.mshow){
                this.showMon();
            }
        },
        handleClick({name}) {
            if(name == 'debug' || name == 'call' || name == '0' || name == 'signal'){
                return;
            };
            this.stopDebug();
            this.sendMsg(name + ' '+this.currentAddress);
        },
        ...mapMutations(["updateState","sendMsg","showMon","stopDebug"])
    },
    computed: {
        ...mapState(["currentServer","currentAddress"]),
    },
    watch: {
        currentServer: function (value) {
            this.mshow = false;
        },
        currentAddress:function () {
            let obj = {name:this.activeName};
            this.handleClick(obj);
        },
    },
    components: {
        Info,
        Console,
        Task,
        Method,
        Signal,
        Monitor
    },
};
</script>
<style lang="scss">
$color:#f1ca0f;
.el-tabs__item{
    color: #fff;
}
.tablist{
    width: 100%;
}
.btnbar{
    position: absolute;
    right: 20px;
    top: 5px;
    z-index: 1;
}
.el-tabs__header{
    margin: 0;
}
.el-tabs__item.is-active {
    color: $color;
}
.el-tabs__active-bar{
    background-color: $color;
}
.el-tabs__item:hover {
    color: $color;
}
</style>