<template>
  <div>
    <el-form :rules="rules" ref="addPerson" :model="addOrderData">
      <el-form-item prop="empList" >
      <el-transfer
        v-model="addOrderData.empList"
        style="margin-bottom: 10px"
        :titles="['入场人员', '新增订单人员']"
        :data="teamMembers"
      ></el-transfer>
      </el-form-item>
      <el-form-item label="投入开始日期:" prop="intoStartTime">
        <el-date-picker
          v-model="addOrderData.intoStartTime"
          style="width: 300px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择投入开始日期"
          @change="timeChange"
          clearable
        />
      </el-form-item>
      <el-form-item label="投入结束日期:" prop="intoEndTime">
        <el-date-picker
          v-model="addOrderData.intoEndTime"
          style="width: 300px"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择投入结束日期"
          @change="timeChange"
          clearable
        />
      </el-form-item>
      <div style="width: 100%; margin-bottom: 20px; display: flex; justify-content: center">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button style="margin-left: 7px" @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      addOrderData: {
        empList: [],
        intoStartTime: '',
        intoEndTime: ''
      },
      row: {},
      teamMembers: [],
      rules: {
        intoStartTime: [{ required: true, message: '请选择投入开始日期', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (new Date(value) > new Date(this.addOrderData.intoEndTime)) {
                callback(new Error('投入开始日期不能晚于投入结束日期'))
              } else {
                callback();
              }
            },
            trigger: ['blur','change']
          }],
        intoEndTime: [{ required: true, message: '请选择投入结束日期', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (new Date(value) < new Date(this.addOrderData.intoStartTime)) {
                callback(new Error('投入结束日期不能早于投入开始日期'))
              } else {
                callback();
              }
            },
            trigger: ['blur','change']
          }],
        empList: [
          {
            validator: (rule, value, callback) => {
              if (!Array.isArray(value) || value.length === 0) {
                callback(new Error('新增订单人员不能为空'))
              } else {
                callback();
              }
            },
            trigger: ['blur']
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    init(row, projectId) {
      // console.log(initData)
      this.addOrderData.orderId = row.id
      this.addOrderData.intoStartTime = row.startTime
      this.addOrderData.intoEndTime = row.endTime
      // this.pickerOptions = {
      //   disabledDate: (time) => {
      //     const targetDate0 = new Date(initData.endTime)
      //     targetDate0.setHours(0, 0, 0, 0)
      //     const targetDate1 = new Date(initData.startTime)
      //     targetDate1.setHours(0, 0, 0, 0)
      //     return time.getTime() > targetDate0.getTime() || time.getTime() < targetDate1.getTime()
      //   }
      // }
      this.getPersons(row,projectId)
    },
    timeChange() {
      this.$refs.addPerson.validateField('intoStartTime')
      this.$refs.addPerson.validateField('intoEndTime')
    },
    getPersons(row, projectId) {
      let param = {}
      param.id = row.id
      param.projectId = projectId
      param.startTime = row.startTime
      param.endTime = row.endTime
      this.$http({
        url: this.$http.adornUrl('/externalProject/getCouldAddOrderEmp'),
        method: 'post',
        data: param,
      }).then(({ data }) => {
        if (data && data.code === 200) {
          // Object.assign(this.teamMembers, data.payload)
          this.teamMembers = data.payload.map(item => ({
            key: item.empId,
            label: item.name
          }));
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    // 确认
    confirm() {
      console.log(this.addOrderData.empList)
      // this.addOrderData.empList = [{empId:1214}]
      this.$refs.addPerson.validate((valid) => {
        if (!valid) {
          return
        }
        this.$http({
          url: this.$http.adornUrl('/externalProject/insertProjectOrderEmp'),
          method: 'post',
          data: this.addOrderData
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
    // 取消
    cancelDialog() {
      this.$parent.hide()
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-button {
  display: block;
  margin-left: 0px;
}
::v-deep .el-transfer-panel{
  width: 300px;
}
::v-deep .el-form-item .el-transfer + .el-form-item__error {
  top: 0 !important;
  position: relative; /* 确保 top 生效 */
}
</style>
