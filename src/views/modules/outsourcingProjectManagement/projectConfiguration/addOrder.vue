<template>
  <div>
    <el-form ref="orderInfoForm" :model="orderInfo" label-width="100px" label-position="right" :rules="rules">
      <el-form-item label="订单名称:" prop="name">
        <el-input v-model="orderInfo.name" placeholder="请输入订单名称" style="width: 300px;" type="text" rows="5" :maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="订单编号:" prop="code">
        <el-input v-model="orderInfo.code" placeholder="请输入订单编号" style="width: 300px;" type="text" rows="5" :maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="订单周期:" prop="period">
        <el-input v-model="orderInfo.period" placeholder="文字描述。例：2024年第一季度" style="width: 300px;" type="text" rows="5" :maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="订单开始日期:" prop="startTime">
        <el-date-picker
            style="width: 300px"
            v-model="orderInfo.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单开始日期"
            clearable
            :picker-options="pickerOptions"
            @change="timeChange"
        />
      </el-form-item>
      <el-form-item label="订单结束日期:" prop="endTime">
        <el-date-picker
            style="width: 300px"
            v-model="orderInfo.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单结束日期"
            clearable
            :picker-options="pickerOptions"
            @change="timeChange"
        />
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
      editFlag: false,
      orderInfo: {
        id: '',
        name: '',
        code: '',
        period: '',
        startTime: '',
        endTime: '',
        projectId: '',
      },
      pickerOptions: {},
      rules: {
        name: [{ required: true, trigger: ['blur', 'change'], message: '请输入订单名称' }],
        code: [{ required: true, trigger: ['blur', 'change'], message: '请输入订单编号' }],
        period: [{ required: true, trigger: ['blur', 'change'], message: '请输入订单周期' }],
        startTime: [{ required: true, trigger: ['blur', 'change'], message: '请选择订单开始日期' },
          {
            validator: (rule, value, callback) => {
              if (new Date(value) > new Date(this.orderInfo.endTime)) {
                callback(new Error('订单开始日期不能晚于订单结束日期'))
              } else {
                callback();
              }
            },
            trigger: ['blur','change']
          }],
        endTime: [{ required: true, trigger: ['blur', 'change'], message: '请输入订单结束日期' },
          {
            validator: (rule, value, callback) => {
              if (new Date(value) < new Date(this.orderInfo.startTime)) {
                callback(new Error('订单结束日期不能早于订单开始日期'))
              } else {
                callback();
              }
            },
            trigger: ['blur','change']
          }]
      }
    }
  },
  components: {},
  mounted() {},
  methods: {
    init(row, initData) {
      if (row){
        this.editFlag = true
      }
      Object.assign(this.orderInfo, row)
      this.orderInfo.projectId = initData.id
      this.pickerOptions = {
        disabledDate: (time) => {
          const targetDate0 = new Date(initData.endTime)
          targetDate0.setHours(0, 0, 0, 0)
          const targetDate1 = new Date(initData.startTime)
          targetDate1.setHours(0, 0, 0, 0)
          return time.getTime() > targetDate0.getTime() || time.getTime() < targetDate1.getTime()
        }
      }
    },
    timeChange() {
      this.$refs.orderInfoForm.validateField('startTime')
      this.$refs.orderInfoForm.validateField('endTime')
    },
    // 确认
    confirm() {
      this.$refs.orderInfoForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl(this.editFlag ? '/externalProject/updateProjectOrder':'/externalProject/insertProjectOrder'),
          method: this.editFlag ? 'put' : 'post',
          data: this.orderInfo
        }).then((result) => {
          if (result.data.success) {
            this.$message.success(result.data.msg)
            this.cancelDialog()
            this.$emit('refreshTableData')
          } else {
            this.$message.error('新增订单失败：' + result.data.msg)
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
