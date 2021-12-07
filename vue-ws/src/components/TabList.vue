<template>
  <ul id="tablist" class="scrollbar-row">
    <Tab
      v-for="(server, index) in tabs"
      :key="index"
      v-bind="server"
      :appName="currentAppName"
    >
    </Tab>
    <li
      :class="['ws_state', wsReadyState === 1 ? 'success' : 'error']"
      :title="wsReadyState === 1 ? 'websocket连接正常' : 'websocket连接异常'"
    ></li>
  </ul>
</template>
<script>
import ws from "../utils/ws.js";

import { mapState, mapGetters, mapMutations } from "vuex";
import Tab from "./Tab.vue";

export default {
  name: "TabList",
  computed: {
    ...mapState(["currentAppName", "wsReadyState"]),
    ...mapGetters(["tabs"]),
  },
  components: {
    Tab,
  },
};
</script>
<style lang="scss">
#tablist {
  height: 40px;
  line-height: 40px;
  background: #21252b;
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
}
.ws_state {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  right: 20px;
  top: calc(50% - 5px);
  z-index: 1;
  &.success {
    background-color: #67c23a;
  }
  &.error {
    background-color: #ec6452fd;
  }
}
</style>