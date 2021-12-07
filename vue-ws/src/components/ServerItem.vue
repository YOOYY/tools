<template>
  <li
    :class="{ active: isActive }"
    @click="serverClick"
    @dblclick="toggleConnect(true)"
  >
    <span class="name">{{ name }}</span>
    <i :class="[isAlive ? 'success' : 'error', 'tag']">{{ state }}</i>
    <button
      @click.stop="toggleServer"
      :class="[isAlive ? 'error' : 'success', servering ? 'disabled' : '']"
      :disabled="servering"
    >
      {{ serverText }}
    </button>

    <!-- <button
      :class="[
        isConnect ? 'error' : 'success',
        servering || connecting || !isAlive ? 'disabled' : '',
      ]"
      :disabled="!isAlive || connecting || servering"
      @click.stop="toggleConnect"
    >
      {{ connectText }}
    </button> -->
  </li>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "ServerItem",
  data() {
    return {
      servering: false,
      connecting: false,
    };
  },
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
    isAlive: {
      type: Boolean,
      required: true,
    },
    isConnect: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.currentServerId === this.id;
    },
    state() {
      let state = { open: "运行", closed: "关闭" };
      return this.isAlive ? state.open : state.closed;
    },
    serverText() {
      let actionText = {
        open: "开启服务",
        close: "关闭服务",
        opening: "开启中...",
        closing: "关闭中...",
      };
      if (this.servering) {
        return this.servering === "opening"
          ? actionText.opening
          : actionText.closing;
      } else {
        return this.isAlive ? actionText.close : actionText.open;
      }
    },
    connectText() {
      let actionText = {
        open: "开启连接",
        close: "关闭连接",
        opening: "开启中...",
        closing: "关闭中...",
      };
      if (this.connecting) {
        return this.connecting === "opening"
          ? actionText.opening
          : actionText.closing;
      } else {
        return this.isConnect ? actionText.close : actionText.open;
      }
    },
    ...mapState(["currentServerId", "wsReadyState"]),
  },
  methods: {
    serverClick() {
      if (this.isConnect) {
        this.updateCurrentServerId(this.id);
      }
    },
    toggleServer() {
      this.updateWsReadyState();
      console.log(this.wsReadyState);

      if (this.servering || this.wsReadyState !== 1) {
        return;
      }
      let action = this.isAlive ? "killServer" : "clientStartServer";
      if (action === "killServer" && !this.$message.confirm("确定关闭?")) {
        //   this.servering = false;
        return;
      }
      this.servering = this.isAlive ? "closing" : "opening";
      this[action]([this.appName, this.id]);
    },
    //默认自动切换，flag手动切换(true 连接，false关闭)
    toggleConnect(flag) {
      this.updateWsReadyState();
      console.log(this.wsReadyState);

      if (this.connecting || !this.wsReadyState) {
        return;
      }
      if (typeof flag === "boolean") {
        if (flag === this.isConnect) return;

        this.connecting = flag ? "opening" : "closing";
      } else {
        this.connecting = this.isConnect ? "closing" : "opening";
      }
      let action = this.isConnect ? "disconnect" : "connect";
      this[action]([this.appName, this.id]);
    },
    ...mapMutations([
      "connect",
      "disconnect",
      "clientStartServer",
      "killServer",
      "updateCurrentServerId",
      "updateWsReadyState",
    ]),
  },
  watch: {
    isAlive(nval, oval) {
      this.servering = false;
      if (!nval && this.isConnect) {
        this.disconnect([this.appName, this.id]);
      }
    },
    isConnect(nval, oval) {
      this.connecting = false;
    },
  },
};
</script>