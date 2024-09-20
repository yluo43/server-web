<template>
  <div>
    <el-form ref="departurePersonnelInfoForm" :model="departurePersonnelInfo" label-width="100px" label-position="right" :rules="rules">
      <el-form-item label="工号:" prop="empId">
        {{ departurePersonnelInfo.empId }}
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        {{ departurePersonnelInfo.name }}
      </el-form-item>
      <el-form-item label="岗位:" prop="postName">
        {{ departurePersonnelInfo.postName }}
      </el-form-item>
      <el-form-item label="级别:" prop="level">
        {{ departurePersonnelInfo.level }}
      </el-form-item>
      <el-form-item label="入场时间:" prop="entryTime">
        {{ departurePersonnelInfo.entryTime }}
      </el-form-item>
      <el-form-item label="计划离场时间:" prop="planExitTime">
        {{ departurePersonnelInfo.planExitTime }}
      </el-form-item>
      <el-form-item label="实际离场时间:" prop="exitTime">
        <el-date-picker
          style="width: 300px"
          v-model="departurePersonnelInfo.exitTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择实际离场时间"
          clearable
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="离场原因:" prop="exitReason">
        <el-input v-model="departurePersonnelInfo.exitReason" style="width: 300px;margin-block: 6px"" type="textarea" rows="5" :maxlength="100" show-word-limit />
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
        postName: '',
        level: '',
        entryTime: '',
        planExitTime: '',
        exitTime: '',
        exitReason: ''
      },
      pickerOptions: {},
      rules: {
        exitTime: [{ required: true, trigger: 'blur', message: '请选择实际离场时间' }],
        // exitReason: [{ required: true, trigger: 'blur', message: '请输入离场原因' }]
      }
    }
  },
  components: {},
  mounted() {},
  methods: {
    init(initData) {
      Object.assign(this.departurePersonnelInfo, initData)
      this.pickerOptions = {
        disabledDate: (time) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const targetDate = new Date(this.departurePersonnelInfo.entryTime);
          targetDate.setHours(0, 0, 0, 0);
          return time.getTime() > today.getTime() || time.getTime() < targetDate.getTime();
        }
      };
    },
    //确认
    confirm() {
      this.$refs.departurePersonnelInfoForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/externalProject/exitProject'),
          method: 'put',
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
