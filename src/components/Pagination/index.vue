<template>
  <div class="pagination-container">
    <el-pagination
      v-show="total > 0"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('update:limit', val)
      this.$emit('pagination')
    },
    handleCurrentChange(val) {
      this.$emit('update:page', val)
      this.$emit('pagination')
    }
  }
}
</script>

<style scoped>
.pagination-container {
  padding: 20px 0;
  text-align: right;
}
</style>
