<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <template v-for="(obj, index) in dataList">
        <el-descriptions :title="title(index + 1)" :column="1">
          <el-descriptions-item label="项目名称">{{ obj.name }}</el-descriptions-item>
          <el-descriptions-item label="项目经理">{{ obj.mannagerName }}</el-descriptions-item>
          <el-descriptions-item label="项目编码">{{ obj.projectId }}</el-descriptions-item>
        </el-descriptions>
      </template>
      <el-row style="display: flex; justify-content: right; margin: 20px 100px">
        <el-button type="primary" @click="cancel()">确认</el-button>
      </el-row>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: []
    }
  },
  methods: {
    init(id) {
      this.$http({
        url: this.$http.adornUrl('/projectSet/showProject'),
        method: 'get',
        params: { id: id }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    title(number) {
      const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      const chineseUnits = ['', '十', '百', '千', '万', '亿']
      if (number === 0) {
        return chineseNumbers[0]
      }
      let result = ''
      let unitIndex = 0
      while (number > 0) {
        const digit = number % 10
        result = chineseNumbers[digit] + chineseUnits[unitIndex] + result
        number = Math.floor(number / 10)
        unitIndex++
      }
      return '项目' + result
    },
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
.el-descriptions {
  margin-left: 20px;
}
</style>
