<template>
  <div>
    <el-dialog
      v-dialogDrag
      :title="title"
      :modal="true"
      :close-on-click-modal="false"
      :visible.sync="visible"
      :width="__reCalcWidth()"
      :top="__reCalcTop()"
      :append-to-body="true"
      @close="__dialogClose"
    >
      <transition name="el-fade-in-linear">
        <div v-if="this.visible" class="el-card__mdgView" style="overflow-x: hidden; max-height: 600px">
          <slot></slot>
        </div>
      </transition>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  props: {
    title: {
      type: String,
      default: ' '
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    width: {
      type: String
      // default: this.__reCalcWidth
    },
    height: {
      type: String
      // default: this.__reCalcHeight
    }
    // top: {
    //   type: String,
    //   default: this.__reCalcTop
    // }
  },
  methods: {
    __reCalcWidth() {
      if (this.width) {
        return this.width
      }
      return '80%'
    },
    __reCalcHeight() {
      if (this.height) {
        return this.height
      }
      return window.innerHeight * 0.7 + 'px'
    },
    __reCalcTop() {
      if (this.top) {
        return this.top
      }
      return window.innerHeight * 0.1 + 'px'
    },
    __dialogClose() {
      if (this.$listeners['dialogClose']) {
        this.$emit('dialogClose')
      }
    },
    show() {
      this.visible = true
    },
    hide() {
      this.visible = false
    },
    getVisible() {
      return this.visible
    }
  }
}
</script>
<style scoped>
.el-dialog__body {
  padding-left: 50px;
  padding-right: 40px;
}
.el-dialog__header {
  height: 50px;
  line-height: 30px;
  background: #5eafff;
  border-radius: 10px 10px 0 0;
}
.el-dialog__title {
  font-size: 18px !important;
  color: #fff;
}
.el-form-item__label {
  padding-right: 20px;
  width: 110px;
}
</style>
