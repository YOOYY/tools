<template>
  <li :class="{ active: isActive }" @click="appClick">
    <span class="name">{{ name }}</span>
    <i :class="[isAlive ? 'success' : 'error', 'tag']">{{ state }}</i>
    <button
      @click.stop="toggleApp"
      :class="[isAlive ? 'error' : 'success', waiting ? 'disabled' : '']"
      :disabled="waiting"
    >
      {{ appText }}
    </button>
    <button
      @click.stop="toggleApp('true')"
      :class="[isAlive ? 'error' : 'disabled', waiting ? 'disabled' : '']"
      :disabled="waiting"
    >
      强制关闭
    </button>
  </li>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "AppItem",
  data() {
    return {
      waiting: false,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    isAlive: {
      type: [Boolean, String],
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.name === this.currentAppName;
    },
    state() {
      let state = { open: "运行", closed: "关闭" };
      return this.isAlive ? state.open : state.closed;
    },
    appText() {
      let actionText = {
        open: "开启App",
        close: "关闭App",
        opening: "开启中...",
        closing: "关闭中...",
      };
      if (this.waiting) {
        return this.waiting === "opening"
          ? actionText.opening
          : actionText.closing;
      } else {
        return this.isAlive ? actionText.close : actionText.open;
      }
    },
    ...mapState(["currentAppName", "wsReadyState", "timeoutError"]),
  },
  methods: {
    appClick() {
      if (this.isAlive) {
        this.updateState({ name: "currentAppName", val: this.name });
      }
    },
    toggleApp(isCompulsory) {
      this.updateWsReadyState();
      console.log(this.wsReadyState);
      if (this.waiting) {
        return;
      }
      let action = this.isAlive ? "clientStopApplication" : "startChannel";
      if (
        action === "clientStopApplication" &&
        (!this.$message.confirm("确定关闭?") || this.wsReadyState !== 1)
      ) {
        return;
      }
      this.waiting = this.isAlive ? "closing" : "opening";
      this[action](
        action === "clientStopApplication"
          ? [this.name, isCompulsory ? isCompulsory : "false"]
          : [this.name]
      );
    },
    ...mapMutations([
      "clientStopApplication",
      "startChannel",
      "updateState",
      "updateWsReadyState",
      "delTimeout",
    ]),
  },
  watch: {
    isAlive(nval, oval) {
      this.waiting = false;
    },
    timeoutError(nval, oval) {
      console.log(nval);
      if (nval.includes(this.name)) {
        this.waiting = false;
        this.delTimeout(this.name);
      }
    },
  },
};
</script>