<template>
  <div style="width: 100%; height: 100%; background: #fff">
    <div style="height: 50%; border: 1px solid lightgray; padding: 50px">
      <el-form ref="overtimeDataForm" :rules="overtimeRules" :model="overtimeDataForm">
        <h2>申请加班</h2>
        <el-row>
          <el-col :span="6">
            <el-form-item label="加班类型" prop="overtimeType">
              <el-radio-group v-model="overtimeDataForm.overtimeType">
                <el-radio :label="0">日常加班</el-radio>
                <el-radio :label="1">节假日加班</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班项目" prop="overtimeProject">
              <el-select v-model="overtimeDataForm.overtimeProject" placeholder="请选择加班项目" clearable>
                <el-option v-for="item in overtimeProjects" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目经理" prop="projectManager">
              {{ overtimeDataForm.projectManager }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班原因" prop="overtimeReason">
              <el-input v-model="overtimeDataForm.overtimeReason" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px">
          <el-col :span="6">
            <el-form-item label="是否居家办公" prop="homeFlag">
              <el-radio-group v-model="overtimeDataForm.homeFlag">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班开始时间" prop="overTimeStartTime">
              <el-date-picker
                v-model="overtimeDataForm.overTimeStartTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班结束时间" prop="overTimeEndTime">
              <el-date-picker v-model="overtimeDataForm.overTimeEndTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班时长" prop="overtimeDuration">{{ overtimeDataForm.overtimeDuration }}小时</el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          <el-button type="primary" @click="submitOverTime">提交</el-button>
          <el-button @click="cancelOverTime">取消</el-button>
        </div>
      </el-form>
    </div>
    <div style="height: 50%; border: 1px solid lightgray; padding: 50px">
      <el-form ref="compensatoryLeaveDataForm" :rules="compensatoryLeaveRules" :model="compensatoryLeaveDataForm">
        <h2>申请调休</h2>
        <el-row :gutter="20">
          <el-col :span="9">
            <el-form-item label="调休开始时间" prop="compensatoryLeaveStartTime">
              <el-date-picker
                v-model="compensatoryLeaveDataForm.startDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
              <el-time-select
                v-model="compensatoryLeaveDataForm.startTime"
                :picker-options="{
                  start: '09:00',
                  step: '03:00',
                  end: '12:00'
                }"
                placeholder="选择时间"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="调休结束时间" prop="compensatoryLeaveEndTime">
              <el-date-picker
                v-model="compensatoryLeaveDataForm.endDate"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
              <el-time-select
                v-model="compensatoryLeaveDataForm.endTime"
                :picker-options="{
                  start: '12:00',
                  step: '06:00',
                  end: '18:00'
                }"
                placeholder="选择时间"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调休天数" prop="days">{{ compensatoryLeaveDataForm.days }}天</el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          <el-button type="primary" @click="submitCompensatoryLeave">提交</el-button>
          <el-button>取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    const validateCompensatoryLeaveStartTime = (rule, value, callback) => {
      if (!value || !this.compensatoryLeaveDataForm.startDate || !this.compensatoryLeaveDataForm.startTime) {
        callback(new Error('请选择调休开始时间'))
        return
      }
      callback()
    }
    const validateCompensatoryLeaveEndTime = (rule, value, callback) => {
      if (!value || !this.compensatoryLeaveDataForm.endDate || !this.compensatoryLeaveDataForm.endTime) {
        callback(new Error('请选择调休结束时间'))
        return
      }
      callback()
    }
    return {
      overtimeProjects: [],
      overtimeDataForm: {
        overtimeType: '',
        overtimeProject: '',
        projectManager: '',
        overtimeReason: '',
        homeFlag: '',
        overTimeStartTime: '',
        overTimeEndTime: '',
        overtimeDuration: 0
      },
      compensatoryLeaveDataForm: {
        compensatoryLeaveStartTime: '',
        compensatoryLeaveEndTime: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        days: 0
      },
      overtimeRules: {
        overtimeProject: [{ required: true, message: '请选择加班项目', trigger: 'change' }],
        overtimeReason: [{ required: true, message: '请输入加班原因', trigger: 'blur' }],
        overTimeStartTime: [{ required: true, message: '请选择加班开始时间', trigger: 'change' }],
        overTimeEndTime: [{ required: true, message: '请选择加班结束时间', trigger: 'change' }]
      },
      compensatoryLeaveRules: {
        compensatoryLeaveStartTime: [{ required: true, validator: validateCompensatoryLeaveStartTime, trigger: 'change' }],
        compensatoryLeaveEndTime: [{ required: true, validator: validateCompensatoryLeaveEndTime, trigger: 'change' }]
      }
    }
  },
  watch: {
    'overtimeDataForm.overtimeProject': {
      handler(value) {}
    },
    'compensatoryLeaveDataForm.startDate': {
      handler(value) {
        if (value) {
          this.compensatoryLeaveDataForm.compensatoryLeaveStartTime = value + '\xa0' + this.compensatoryLeaveDataForm.startTime
        }
      }
    },
    'compensatoryLeaveDataForm.startTime': {
      handler(value) {
        if (value) {
          this.compensatoryLeaveDataForm.compensatoryLeaveStartTime = this.compensatoryLeaveDataForm.startDate + '\xa0' + value
        }
      }
    },

    overtimeDuration(value) {
      if (value) {
        this.overtimeDataForm.overtimeDuration = value
      }
    },
    compensatoryLeaveEndTime(value) {
      if (value) {
        this.compensatoryLeaveDataForm.compensatoryLeaveEndTime = value
      }
    },
    days(value) {
      this.compensatoryLeaveDataForm.days = value
    }
  },
  computed: {
    overtimeDuration() {
      if (this.overtimeDataForm.overTimeStartTime && this.overtimeDataForm.overTimeEndTime) {
        return (new Date(this.overtimeDataForm.overTimeEndTime).getTime() - new Date(this.overtimeDataForm.overTimeStartTime).getTime()) / 1000 / 60 / 60
      } else {
        return 0
      }
    },
    compensatoryLeaveEndTime() {
      return this.compensatoryLeaveDataForm.endDate + '\xa0' + this.compensatoryLeaveDataForm.endTime
    },
    days() {
      let diffDay1 = this.getDaysBetweenDates(new Date(this.compensatoryLeaveDataForm.endDate), new Date(this.compensatoryLeaveDataForm.startDate))
      let diffDay2 = this.getTimeDays()
      if (diffDay1 || diffDay2) {
        return diffDay1 + diffDay2
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getEmpProject()
  },
  created() {},
  methods: {
    //员工对应加班项目list
    getEmpProject() {
      this.$http({
        url: this.$http.adornUrl('/attendance/getEmpProject'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.overtimeProjects = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //提交加班申请
    submitOverTime() {
      let message = '提交后本次申请记录将无法修改，确定提交吗？'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(''),
            method: 'post',
            data: this.overtimeDataForm
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message.success(data.msg)
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认'
          })
        })
    },
    //提交调休申请
    submitCompensatoryLeave() {
      console.log(this.compensatoryLeaveDataForm)
    },
    //加班申请取消
    cancelOverTime() {},
    //计算两个日期之间的天数
    getDaysBetweenDates(date1, date2) {
      var oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
      var timeDiff = Math.abs(date2.getTime() - date1.getTime()) // 两个日期的差值的毫秒数
      var diffDays = Math.floor(timeDiff / oneDay) // 差值的天数
      return diffDays
    },
    //计算两个时间之间的天数
    getTimeDays() {
      let diffDay
      if (this.compensatoryLeaveDataForm.startTime == '09:00' && this.compensatoryLeaveDataForm.endTime == '12:00') {
        diffDay = 0.5
      } else if (this.compensatoryLeaveDataForm.startTime == '09:00' && this.compensatoryLeaveDataForm.endTime == '18:00') {
        diffDay = 1
      } else if (this.compensatoryLeaveDataForm.startTime == '12:00' && this.compensatoryLeaveDataForm.endTime == '12:00') {
        diffDay = 0
      } else if (this.compensatoryLeaveDataForm.startTime == '12:00' && this.compensatoryLeaveDataForm.endTime == '18:00') {
        diffDay = 0.5
      }
      return diffDay
    },
    //日期格式转换
    formatDate(date) {
      var date = new Date(date)
      var YY = date.getFullYear() + '-'
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return YY + MM + DD + ' ' + hh + mm + ss
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-date-editor.el-input {
  width: 190px;
}
::v-deep .el-form-item__label {
  float: none;
  font-size: 14px !important;
}
</style>
