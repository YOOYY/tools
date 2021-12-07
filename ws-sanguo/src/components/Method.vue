<template>
<div class="panel">
    <div id="method">
        <code class="scrollbar" ref="code" v-html="callContent"></code>
        <div class="scrollbar" style="overflow:auto">
            <div v-for="(value, index) in historyList" :key="value">
                <el-input :value="value" class="sendinput" size="mini" @keyup.native.enter="sendMethod(value)" @input="(val)=>{return saveHistory(val,index)}"></el-input>
                <el-button type="danger" class="mr10" @click='sendMethod(value)' size="mini">发送</el-button>
            </div>
        </div>
    </div>

    <div>
        <el-input v-model="sendcode" placeholder="请输入内容" class="sendinput" size="mini" @keyup.native.enter="sendMethod(sendcode,true)"></el-input>
        <el-button type="danger" @click='sendMethod(sendcode,true)' size="mini">发送</el-button>
    </div>
</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "Method",
    data() {
        return {
            sendcode:'',
            historyList:JSON.parse(localStorage.getItem("historyList")) || []
        };
    },
    methods: {
        sendMethod(val,flag = false) {
            if(!val){
                this.$message.warning('输入为空');
                return;
            }
            this.sendMsg(`call ${this.currentAddress} ${val}`);
            if(flag){
                this.saveHistory(val);
            }
            this.sendcode = '';
        },
        saveHistory(value,index = false) {
            if(index === false){
                if(this.historyList.length == 50){
                    this.historyList.shift();
                }
                let i = this.historyList.indexOf(value);
                if(i>=0){
                    this.historyList.splice(i,1);
                }
                this.historyList.push(value);
            }else{
                this.historyList.splice(index,1,value);
            }
            let historyList = JSON.stringify(this.historyList);
            localStorage.setItem("historyList", historyList);
        },
        ...mapMutations(["sendMsg"])
    },
    computed: {
        ...mapState(["currentAddress","callContent"])
    },
    watch: {
        callContent() {
            this.$nextTick().then(() => {
                let code = this.$refs.code;
                code.scrollTop = code.scrollHeight - code.clientHeight;
            });
        },
    },
}
</script>

<style lang="scss">
#method {
    flex: 1;
    display: flex;
    overflow: hidden;
    .sendinput{
        margin-left: 10px;
        width: 200px;
    }
}
</style>