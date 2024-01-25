<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction">
    <div v-if="drawer">
      <slot></slot>
    </div>
  </el-drawer>

</template>
<script>
export default {
  data() {
    return {
      drawer: false,
    }
  },
  props: {
    title: {
      type: String,
      default: ' '
    },
    direction: {
      type: String,
      default: 'rtl'
    },
  },
  methods: {
    show() {
      this.drawer = true
    },
  }
}
</script>

<style scoped>

</style>
