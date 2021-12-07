<template>
  <li :class="[isActive ? 'active' : '', 'tab']" @click="tabClick">
    {{ name }}
    <i class="close" @click.stop="disconnect([appName, id])"></i>
  </li>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "Tab",
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    appName: {
      type: String,
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.currentServerId === this.id;
    },
    ...mapState(["currentServerId"]),
  },
  methods: {
    tabClick() {
      this.updateCurrentServerId(this.id);
    },
    ...mapMutations(["updateCurrentServerId", "disconnect"]),
  },
};
</script>

<style lang="scss">
.tab {
  display: inline-block;
  padding: 0 20px;
  border-right: 1px solid #181a1f;
  cursor: pointer;
  &:first-child {
    border-left: 1px solid #3b4048;
  }
  &:hover,
  &.active {
    background: #2c313a;
    color: #ccc;
  }
}
.close {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url("/static/imgs/close.png") center no-repeat;
  vertical-align: middle;
  background-size: cover;
  margin-left: 10px;
}
</style>