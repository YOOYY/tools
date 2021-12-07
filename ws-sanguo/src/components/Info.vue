<template>
    <div class="panel" id="info">
        <el-table
            :data="content"
            :default-sort = "{prop: 'val'}"
            >
            <el-table-column
            prop="key"
            label="key"
            sortable>
            </el-table-column>
            <el-table-column
            prop="val"
            label="value"
            sortable>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "Info",
    computed: {
        content(){
            return Object.entries(this.infoContent).map(([key,val]) => ({key,val}));
        },
        ...mapState(["infoContent"])
    },
}
</script>

<style lang="scss">

</style>