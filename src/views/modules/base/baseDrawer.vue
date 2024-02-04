<template>
  <el-drawer :title="title" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
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
        this.$confirm('确认关闭？')
          .then((_) => {
            done()
          })
          .catch((_) => {})
      }
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
