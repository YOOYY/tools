<template>
  <div id="content" class="colflex">
    <div class="filter" v-show="filter" :class="filterClass">{{ filter }}</div>
    <code class="scrollbar" ref="code" v-html="content"></code>
    <div class="command_box">
      <input
        type="text"
        id="command"
        ref="command"
        @keyup.enter="submit"
        v-model="command"
        autocomplete="off"
      />
      <div class="select">
        <button>过滤</button>
        <ol>
          <li @click="directiveHandle('filter')">Normal</li>
          <li @click="directiveHandle('filter:LOG_TRACE')">LOG_TRACE</li>
          <li @click="directiveHandle('filter:LOG_DEBUG')">LOG_DEBUG</li>
          <li class="info" @click="directiveHandle('filter:LOG_INFO')">
            LOG_INFO
          </li>
          <li class="warn" @click="directiveHandle('filter:LOG_WARN')">
            LOG_WARN
          </li>
          <li class="error" @click="directiveHandle('filter:LOG_ERROR')">
            LOG_ERROR
          </li>
          <li class="alarm" @click="directiveHandle('filter:LOG_ALARM')">
            LOG_ALARM
          </li>
          <li class="fatal" @click="directiveHandle('filter:LOG_FATAL')">
            LOG_FATAL
          </li>
        </ol>
      </div>
      <button @click="directiveHandle('clear')">清屏</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "Content",
  data() {
    return {
      cmdList: [],
      cmdIndex: 0,
      filter: "",
    };
  },
  computed: {
    content() {
      let content = this.tabs[this.currentTabIndex]?.content || "";
      if (this.filter) {
        let regExp = /<p class="(\w*?)">([\s\S]+?)<\/p>/g;
        content = [...content.matchAll(regExp)]
          .map(([p, className, content]) => {
            if (
              (content && content.includes(this.filter)) ||
              className === "admin"
            ) {
              return p;
            }
          })
          .join("");
      }

      return content;
    },
    command: {
      get() {
        return this.tabs[this.currentTabIndex]?.command || "";
      },
      set(val) {
        this.updateData([
          this.currentAppName,
          this.currentServerId,
          "command",
          val,
        ]);
      },
    },
    filterClass() {
      return this.filter.slice(4).toLowerCase();
    },
    lastIndex() {
      return this.cmdList.length - 1;
    },
    ...mapState(["currentAppName", "currentServerId", "wsReadyState"]),
    ...mapGetters(["tabs", "currentTabIndex"]),
  },
  methods: {
    submit() {
      this.updateWsReadyState();
      console.log(this.wsReadyState);
      if (this.wsReadyState !== 1) return;
      if (!this.command) {
        return this.$message.error("发送数据为空");
      }

      if (this.command !== this.cmdList[this.cmdIndex]) {
        this.cmdList.push(this.command);
        this.cmdIndex = this.lastIndex + 1;
      } else {
        this.cmdIndex++;
      }
      if (this.command.startsWith("$")) {
        this.directiveHandle(this.command.slice(1));
      } else {
        this.serverCommand([
          this.currentAppName,
          this.currentServerId,
          this.command,
        ]);
      }
      this.command = "";
    },
    directiveHandle(command) {
      let [directive, text] = command.split(":");
      console.log(directive);
      switch (directive) {
        case "clear":
          this.updateData([
            this.currentAppName,
            this.currentServerId,
            "content",
            "",
          ]);
          break;
        case "filter":
          this.filter = text || "";
          break;
        default:
          this.$message.error("错误命令");
          break;
      }
    },
    ...mapMutations(["serverCommand", "updateData", "updateWsReadyState"]),
  },
  watch: {
    content() {
      this.$nextTick().then(() => {
        let code = this.$refs.code;
        code.scrollTop = code.scrollHeight - code.clientHeight;
      });
    },
  },
  created() {
    //38 ↑键 40 ↓键
    document.onkeydown = (e) => {
      let key = e.keyCode;
      switch (key) {
        case 38:
          if (this.cmdIndex > 0) this.command = this.cmdList[--this.cmdIndex];
          e.preventDefault();
          break;
        case this.cmdIndex < this.lastIndex && 40:
          this.command = this.cmdList[++this.cmdIndex];
          break;
        default:
          break;
      }
    };
  },
};
</script>
<style lang="scss">
#content {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  .info {
    color: #00ffffbb;
  }
  .warn {
    color: #ffff00bb;
  }
  .error {
    color: #ea6d5dfd;
  }
  .alarm {
    color: #00ff00bb;
  }
  .fatal {
    color: #ff00ffdd;
  }
  .admin {
    color: #a0a0a0;
  }
}
.filter {
  position: absolute;
  width: 100px;
  height: 40px;
  background: #383c4490;
  right: 10px;
  top: 0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
  text-overflow: ellipsis;
}

code {
  flex-grow: 1;
  overflow-y: auto;
  display: block;
  box-sizing: border-box;
  font-family: Consolas, Inconsolata, Courier, monospace, sans-serif;
  line-height: 12px;
  word-wrap: break-word;
  white-space: pre-wrap;
  hyphens: auto;
  background: url("/static/imgs/bg.png") center no-repeat;
  background-color: #282c34;
  background-size: cover;
  border: 1px solid #3b4048;
  border-top: none;
  border-radius: 4px;
  padding: 4px 10px;
  user-select: text;
}
.command_box {
  display: flex;
  margin: 10px 0 10vh 0;
  button {
    flex-shrink: 0;
    color: #abb2bf;
  }
  .select {
    position: relative;
    &:hover {
      li {
        display: block;
      }
    }
    button {
      height: 100%;
    }
    ol {
      position: absolute;
      bottom: 100%;
      right: 0;
      background: #282c34;
      padding: 5px 10px;
      border-radius: 6px 6px 0 0;
      li {
        text-align: center;
        padding: 5px 0;
        border-bottom: 1px solid #454a52;
        cursor: pointer;
        display: none;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
#command {
  flex-grow: 1;
  height: 30px;
  color: #abb2bf;
  font-family: Consolas, Inconsolata, Courier, monospace, sans-serif;
  font-size: 16px;
  background: none;
  border: 1px solid #86878a;
  outline: none;
  box-sizing: border-box;
  padding-left: 6px;
}
</style>