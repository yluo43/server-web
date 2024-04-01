<template>
  <div style="height: 100%">
    <el-steps :active="2" align-center>
      <el-step title="提交">
        <template slot="description">
          <div>111</div>
          <div>222</div>
        </template>
      </el-step>
      <el-step title="项目初审">
        <template slot="description">
          <div>111</div>
          <div>222</div>
        </template>
      </el-step>
      <el-step title="部门复审">
        <template slot="description">
          <div>111</div>
          <div>222</div>
        </template>
      </el-step>
      <el-step title="已通过"></el-step>
    </el-steps>
    <div class="btn-group">
      <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
      <el-button type="primary" @click="cancelDialog">确认</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {}
  },
  mounted() {},
  created() {},
  methods: {
    init(initData) {}
  }
}
</script>

<style scoped>
.btn-group {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid lightgray;
  margin-top: 20px;
}
</style>
