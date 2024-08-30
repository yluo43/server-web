<template>
  <div>
    <el-form ref="departurePersonnelInfoForm" :model="departurePersonnelInfo" label-width="100px" label-position="right">
      <el-form-item label="工号:" prop="empId">
        {{ departurePersonnelInfo.empId }}
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        {{ departurePersonnelInfo.name }}
      </el-form-item>
      <el-form-item label="岗位:" prop="job">
        {{ departurePersonnelInfo.job }}
      </el-form-item>
      <el-form-item label="级别:" prop="level">
        {{ departurePersonnelInfo.level }}
      </el-form-item>
      <el-form-item label="入场时间:" prop="entryTime">
        {{ departurePersonnelInfo.entryTime }}
      </el-form-item>
      <el-form-item label="计划离场时间:" prop="leavingTime">
        {{ departurePersonnelInfo.leavingTime }}
      </el-form-item>
      <el-form-item label="实际离场时间:" prop="ActualDepartureTime">
        <el-date-picker
          style="width: 300px"
          v-model="departurePersonnelInfo.ActualDepartureTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择实际离场时间"
          clearable
        />
      </el-form-item>
      <el-form-item label="离场原因:" prop="departureReason">
        <el-input v-model="departurePersonnelInfo.departureReason" style="width: 300px" type="textarea" rows="5" :maxlength="100" show-word-limit />
      </el-form-item>
      <div class="btn-group">
        <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="confirm()">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      departurePersonnelInfo: {
        empId: '',
        name: '',
        job: '',
        level: '',
        entryTime: '',
        leavingTime: '',
        ActualDepartureTime: '',
        departureReason: ''
      }
    }
  },
  components: {},
  mounted() {},
  methods: {
    init(initData) {
      Object.assign(this.departurePersonnelInfo, initData)
    },
    //确认
    confirm() {
      this.$refs.departurePersonnelInfoForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl(''),
          method: 'post',
          data: this.departurePersonnelInfo
        }).then((result) => {
          if (result.data.success) {
            this.$message.success(result.data.msg)
            this.cancelDialog()
            this.$emit('refreshTableData')
          } else {
            this.$message.error('提交失败：' + result.data.msg)
          }
        })
      })
    },
    //取消
    cancelDialog() {
      this.$parent.hide()
    }
  }
}
</script>
<style scoped lang="scss"></style>
