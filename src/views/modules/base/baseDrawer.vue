<template>
  <el-drawer :title="title" :visible.sync="drawer" :direction="direction" :size="size" :before-close="handleClose">
    <div v-if="drawer">
      <slot></slot>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ' '
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    handleClose: {
      type: Function,
      default: function (done) {
        done()
      }
    },
    size: {
      type: String,
      default: '23%'
    }
  },
  data() {
    return {
      drawer: false
    }
  },
  methods: {
    show() {
      this.drawer = true
    },

    hide() {
      this.drawer = false
    }
  }
}
</script>

<style scoped></style>
