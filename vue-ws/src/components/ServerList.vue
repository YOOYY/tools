<template>
  <div class="server_box">
    <div class="server_title">
      <h1>服务列表</h1>
      <label for="search">过滤:</label>
      <input
        type="text"
        v-model="search"
        @change="saveFilter(search)"
        name="search"
        id="search"
      />
    </div>

    <ol id="serverlist" class="scrollbar">
      <ServerItem
        v-for="(item, id) in currentServers"
        :key="id"
        v-bind="item"
        :appName="currentAppName"
      ></ServerItem>
    </ol>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import ServerItem from "./ServerItem.vue";

export default {
  name: "ServiceList",
  computed: {
    search: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.saveFilter(value);
      },
    },
    ...mapState(["currentAppName"]),
    ...mapGetters(["currentServers"]),
  },
  methods: {
    ...mapMutations(["saveFilter"]),
  },
  components: {
    ServerItem,
  },
};
</script>
<style lang="scss">
#serverlist {
  height: calc(100% - 36px);
}
.server_box h1 {
  text-align: left;
  color: #eee;
  font-size: 16px;
  box-shadow: 0 3px 6px -2px #131518;
  padding: 8px 0;
}
.server_title {
  display: flex;
  background: #282c34;
  label {
    margin: 8px 3px 8px 20px;
    color: #eee;
  }
  input {
    background: #21252b;
    margin: 8px 20px 8px 3px;
    padding-left: 10px;
    flex-grow: 1;
    color: #abb2bf;
    -webkit-text-fill-color: #abb2bf;
  }
}
</style>