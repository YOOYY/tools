<template>
<div class="panel" id="monitor">
    <div class="table1">
        <el-table
            :data="mstat"
            height="400"
            stripe
            :default-sort = "{prop: 'address'}"
            >
            <el-table-column
                prop="address"
                label="address"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="message"
                label="message"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="mqlen"
                label="mqlen"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="cpu"
                label="cpu"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="task"
                label="task"
                sortable
            >
            </el-table-column>
        </el-table>
    </div>
    <div class="table2">
        <el-table
            :data="netstat"
            height="400"
            stripe
            :default-sort = "{prop: 'id'}"
        >
            <el-table-column
                prop="id"
                width="60"
                label="id"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="address"
                label="address"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="peer"
                label="peer"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="read"
                label="read"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="reading"
                label="reading"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="rtime"
                label="rtime"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="type"
                label="type"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="write"
                label="write"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="writing"
                label="writing"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="wtime"
                label="wtime"
                sortable
            >
            </el-table-column>
        </el-table>
    </div>
    <div id="mem"></div>
    <code class="w50 scrollbar h50" v-html="service"></code>
</div>
</template>

<script>
import { mapState } from "vuex";
import * as echarts from 'echarts';

export default {
    name: "Monitor",
    data(){
        return {
            memChart:null
        }
    },
    computed: {
        mstat(){
            return Object.entries(this.stat).map(([key,val])=>{
                val.address = key
                return val;
            });
        },
        ...mapState(["mem","stat","service","netstat"])
    },
    watch: {
        mem: function (value) {
            if(typeof value == 'object'){
                let sdata = [];
                let xdata = Object.values(value).map(v=>{
                    const regex = /([\.\d]+) Kb \((.*)\)/;
                    let res = regex.exec(v);
                    sdata.push(res[1]);
                    return res[2];
                })

                if(!this.memChart){
                    this.memChart = echarts.init(document.getElementById('mem'));
                }
                this.memChart.setOption({
                    title: {
                        text: '内存占用',
                        textStyle:{
                            color:'#abb2bf',
                            fontSize:14
                        },
                        left:'center',
                    },
                    xAxis: {
                        type: 'category',
                        data: xdata
                    },
                    yAxis: {
                        type: 'value'
                    },
                    tooltip:{
                        show:true,
                        formatter:function({name,data}){
                            return `${name}<br>${data} Kb`;
                        }
                    },
                    series: [{
                        data: sdata,
                        type: 'bar',
                        itemStyle: {
                            color: '#F56C6C'
                        },
                    }]
                });
            }
        },
    },
}
</script>

<style lang="scss">
    #monitor{
        flex-direction: row;
        flex-wrap: wrap;
        justify-content:space-around;
        padding-top: 40px;
    }
    #mem{
        width: 50%;
        display: flex;
        text-align: center;
        align-items: center;
    }
    .table1{
        width:36%;
    }
    .table2{
        width:63%;
    }
</style>