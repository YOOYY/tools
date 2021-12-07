<template>
<div class="panel">
    <div>
        <el-select v-model="type" placeholder="请选择" size="mini" class="mr10 ml10">
            <el-option
            v-for="type in types"
            :key="type"
            :label="type"
            :value="type">
            </el-option>
        </el-select>
        <el-button type="danger" size="mini" @click="toggle" :loading="loading">{{state?'停止调试':'开始调试'}}</el-button>
        <el-input v-model="value" placeholder="请输入内容" class="i200" size="mini"></el-input>
        <el-button type="danger" size="mini" @click="debug(breakpoint)">断点</el-button>
        <el-button type="danger" size="mini" @click="debug('s')">单步(逐语句)</el-button>
        <el-button type="danger" size="mini" @click="debug('n')">单步(逐过程)</el-button>
        <el-button type="danger" size="mini" @click="debug('c')">跳过断点</el-button>
    </div>
    <div style="flex:1;overflow:hidden">
        <code class="scrollbar fl w50 h100" ref="code" v-html="content"></code>
        <div class="fl w50 h100">
            <code class="scrollbar h50" v-html="this.debugContent.var"></code>
            <code class="scrollbar h50" v-html="this.debugContent.stack"></code>
        </div>
    </div>
    <div>
        <el-input v-model="sendcode" placeholder="请输入内容" class="sendinput" size="mini" @keyup.native.enter="send(sendcode)"></el-input>
        <el-button type="danger" @click='send(sendcode)' size="mini">发送</el-button>
    </div>
</div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
    name: "Console",
    data() {
        return {
            type:'lua',
            types:['lua','client'],
            sendcode:'',
            value:''
        };
    },
    methods: {
        debug(val) {
            this.sendMsg(val);
        },
        send(code){
            if(!code){
                this.$message.warning('输入为空');
                return;
            }
            this.sendMsg(code);
            this.sendcode = '';
        },
        toggle(){
            this.state?this.stopDebug():this.sendMsg('debug '+this.currentAddress);
        },
        ...mapMutations(["updateState","sendMsg","stopDebug"])
    },
    computed: {
        loading(){
            return this.debugContent.state === 2;
        },
        state(){
            return this.debugContent.state;
        },
        content(){
            return this.debugContent.ctx;
        },
        breakpoint(){
            return (this.value !== '')?`watch("${this.type}",function(_,_,${this.type == 'client'?'_,':''}cmd) return cmd == "${this.value}" end)`:`watch("${this.type}")`;
        },
        ...mapState(["currentAddress","debugContent"])
    },
    watch: {
        content() {
            this.$nextTick().then(() => {
                let code = this.$refs.code;
                code.scrollTop = code.scrollHeight - code.clientHeight;
            });
        },
    },
}
</script>

<style>
.i200 {
    width: 180px;
    margin: 10px;
}
.w50{
    width: 50%;
}

.h50{
    height: 50%;
}
.panel .el-button:first-child{
    margin-left: 10px;
}
</style>