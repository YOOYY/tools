<template>
  <transition name="slide-fade">
    <div v-if="visible" :class="['my_msg_wrapper', type]">
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="'#icon-' + type"></use>
      </svg>
      <div class="my_msg_content">{{ message }}</div>
      <svg class="icon my_msg_closebtn" aria-hidden="true" @click="close">
        <use xlink:href="#icon-close"></use>
      </svg>
    </div>
  </transition>
</template>

<script>
import "./iconfont.js";

export default {
  name: "my-message",
  data() {
    return {
      visible: false,
      message: "",
      type: "", //info,success,warning,error
      duration: 2000,
    };
  },
  methods: {
    setTimer() {
      if (this.duration) {
        setTimeout(() => {
          this.close();
        }, this.duration);
      }
    },
    close() {
      this.visible = false;
      setTimeout(() => {
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      }, 500);
    },
  },
  mounted() {
    this.setTimer();
  },
};
</script>

<style lang="scss">
.my_msg {
  &_wrapper {
    min-width: 380px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    position: fixed;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    overflow: hidden;
    padding: 15px 15px 15px 20px;
    display: flex;
    align-items: center;
    z-index: 1000;
    .icon {
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
    &.error {
      background-color: #fef0f0;
      border-color: #fde2e2;
      color: #f56c6c;
    }
    &.info {
      color: #909399;
      background-color: #edf2fc;
    }
    &.success {
      background-color: #f0f9eb;
      border-color: #e1f3d8;
      color: #67c23a;
    }
    &.warn {
      background-color: #fdf6ec;
      border-color: #faecd8;
      color: #e6a23c;
    }
  }
  &_content {
    margin-left: 5px;
    font-size: 14px;
  }
  &_closebtn {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
    color: #babcbf;
    font-size: 16px;
  }
}
</style>