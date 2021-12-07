<template>
<div class="panel">
    <code class="scrollbar" ref="code" v-html="signalContent"></code>
    <div>
        <el-input v-model="sendcode" placeholder="请输入内容" class="sendinput" size="mini" @keyup.native.enter="send(sendcode)"></el-input>
        <el-button type="danger" @click='send(sendcode)' size="mini">发送</el-button>
    </div>
</div>
</template>

<script>
import { mapState,mapMutations } from "vuex";

export default {
    name: "Signal",
    data() {
        return {
            sendcode:''
        };
    },
    computed: {
        ...mapState(["signalContent","currentAddress"])
    },
    methods: {
        send(val) {
            let msg = val?`signal ${this.currentAddress} ${val}`:`signal ${this.currentAddress}`;
            this.sendMsg(msg);
            this.sendcode = '';
        },
        ...mapMutations(["sendMsg"])
    },
    watch: {
        signalContent() {
            this.$nextTick().then(() => {
                let code = this.$refs.code;
                code.scrollTop = code.scrollHeight - code.clientHeight;
            });
        },
    },
}
</script>