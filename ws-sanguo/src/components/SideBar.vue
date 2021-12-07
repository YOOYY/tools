<template>
    <el-aside width="350px" class="scrollbar">
        <el-tag class="tag">服务器</el-tag>
        <el-select v-model="currentVal" placeholder="请选择" size="small">
            <el-option
            v-for="item in serverlist"
            :key="item.ip"
            :label="item.name"
            :value="item.ip">
            </el-option>
        </el-select>
        <br>
        <el-tag class="tag">过 滤</el-tag>
        <el-input v-model="search" @change="saveFilter(search)" class="w220" size="small" placeholder="000014 | gated"></el-input>
        <el-menu
            background-color="#282c34"
            text-color="#fff"
            active-text-color="#f1ca0f"
            v-show="currentServer"
            >
            <el-menu-item :index="currentServer+name" v-for="(value, name, index) in mlist" :key="currentServer+name" @click="handleClick(value,name,index)">
                <div class="menuspan">{{value.replace('snlua ','')}}</div>
                <el-button size="mini" type="danger" @click="sendMsg('kill '+name.slice(1))">关闭</el-button>
                <el-button size="mini" type="danger">重启</el-button>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Axios from '../utils/axios.js'
import config from '../config.js'

export default {
  name: "Aside",
    data() {
        return {
            serverlist: [],
            search:localStorage.getItem("search") || "",
        };
    },
    mounted(){
        Axios.get(config.serverlistUrl)
            .then((datas) => {
                this.serverlist = datas.map((data)=>{
                    let [,name,ip] = data.split(',');
                    if(localStorage.getItem("server") === ip){
                        this.currentVal = ip;
                    }
                    return ({
                        name,ip
                    })
                })
            })
            .catch((error) => {
                this.$message.error({
                    message: error,
                    showClose: true,
                    duration:0
                })
            })
    },
    methods: {
        saveFilter(value) {
            localStorage.setItem("search", value);
        },
        handleClick(value,name,index) {
            this.updateState({
                name:'currentAddress',
                val:name.slice(1)
            });
            this.clear();
        },
        ...mapMutations(["updateState","sendMsg","clear"])
    },
    computed: {
        mlist(){
            if(this.search){
                let res = {};
                for (var i in this.list){
                    if(this.list[i].indexOf(this.search)>=0 || i.indexOf(this.search)>=0){
                        res[i] = this.list[i];
                    }
                }
                return res;
            }else{
                return this.list;
            }
        },
        currentVal: {
            get(){
                return this.currentServer;
            },
            set(val) {
                localStorage.setItem("server", val);
                this.updateState({
                    name:'currentServer',
                    val:val
                });
            }
        },
        ...mapState(["currentServer",'list'])
    },
};
</script>

<style lang="scss">
    .menuspan{
        width:180px;
        display:inline-block;
    }
    .tag{
        margin: 10px;
    }
    .w220{
        width: 220px;
    }
    .el-menu{
        border-right:none;
    }
</style>