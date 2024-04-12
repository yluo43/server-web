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
            <el-form-item prop="projectId">
              <template slot="label">
                加班项目
                <el-tooltip class="item" effect="dark" content="员工只可选择系统内本人已投入的项目!" placement="top-start">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <el-select v-model="overtimeDataForm.projectId" placeholder="请选择加班项目" clearable>
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
            <el-form-item label="是否居家办公" prop="isRemoteWork">
              <el-radio-group v-model="overtimeDataForm.isRemoteWork">
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
              <el-date-picker
                v-model="overtimeDataForm.overTimeEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加班时长" prop="overtimeDuration">{{ overtimeDataForm.overtimeDuration }}小时</el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          <el-button type="primary" @click="submitOverTime('overtimeDataForm')">提交</el-button>
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
          <el-button type="primary" @click="submitCompensatoryLeave('compensatoryLeaveDataForm')">提交</el-button>
          <el-button @click="cancelCompensatoryLeave">取消</el-button>
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
    const validateoverTimeStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择加班开始时间'))
      } else if (this.overtimeDataForm.overtimeType == 0 && new Date(this.overtimeDataForm.overTimeStartTime).getHours() < 19) {
        callback(new Error('加班开始时间不得小于19点'))
      } else if (this.overtimeDataForm.overtimeType == 1 && new Date(this.overtimeDataForm.overTimeStartTime).getHours() < 9) {
        callback(new Error('加班开始时间不得小于9点'))
      } else {
        callback()
      }
    }
    const validateoverTimeEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择加班结束时间'))
      } else if (new Date(this.overtimeDataForm.overTimeEndTime).getTime() < new Date(this.overtimeDataForm.overTimeStartTime).getTime()) {
        callback(new Error('加班结束时间不能小于加班开始时间'))
      } else if (new Date(this.overtimeDataForm.overTimeEndTime).getTime() > this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 9, 2)) {
        callback(new Error('加班结束时间不能大于加班开始时间的次日9:00'))
      } else {
        callback()
      }
    }
    const validateCompensatoryLeaveStartTime = (rule, value, callback) => {
      if (!value || !this.compensatoryLeaveDataForm.startDate || !this.compensatoryLeaveDataForm.startTime) {
        callback(new Error('请选择调休开始时间'))
      } else {
        callback()
      }
    }
    const validateCompensatoryLeaveEndTime = (rule, value, callback) => {
      if (!value || !this.compensatoryLeaveDataForm.endDate || !this.compensatoryLeaveDataForm.endTime) {
        callback(new Error('请选择调休结束时间'))
      } else if (
        new Date(this.compensatoryLeaveDataForm.compensatoryLeaveEndTime).getTime() <=
        new Date(this.compensatoryLeaveDataForm.compensatoryLeaveStartTime).getTime()
      ) {
        callback(new Error('调休结束时间不能小于等于调休开始时间'))
      } else {
        callback()
      }
    }
    return {
      overtimeProjects: [],
      overtimeDataForm: {
        overtimeType: '',
        projectId: '',
        projectManager: '',
        overtimeReason: '',
        isRemoteWork: '',
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
        projectId: [{ required: true, message: '请选择加班项目', trigger: 'change' }],
        overtimeReason: [{ required: true, message: '请输入加班原因', trigger: 'blur' }],
        overTimeStartTime: [{ required: true, validator: validateoverTimeStartTime, trigger: 'change' }],
        overTimeEndTime: [{ required: true, validator: validateoverTimeEndTime, trigger: 'change' }]
      },
      compensatoryLeaveRules: {
        compensatoryLeaveStartTime: [{ required: true, validator: validateCompensatoryLeaveStartTime, trigger: 'change' }],
        compensatoryLeaveEndTime: [{ required: true, validator: validateCompensatoryLeaveEndTime, trigger: 'change' }]
      }
    }
  },
  watch: {
    'overtimeDataForm.projectId': {
      handler(value) {
        this.overtimeProjects.map((item) => {
          if (item.id == value) {
            this.overtimeDataForm.projectManager = item.managerName
          }
        })
      }
    },
    'compensatoryLeaveDataForm.startDate': {
      handler(value) {
        this.compensatoryLeaveDataForm.compensatoryLeaveStartTime = value + '\xa0' + this.compensatoryLeaveDataForm.startTime
      }
    },
    'compensatoryLeaveDataForm.startTime': {
      handler(value) {
        this.compensatoryLeaveDataForm.compensatoryLeaveStartTime = this.compensatoryLeaveDataForm.startDate + '\xa0' + value
      }
    },
    overtimeDuration(value) {
      this.overtimeDataForm.overtimeDuration = value
    },
    compensatoryLeaveEndTime(value) {
      this.compensatoryLeaveDataForm.compensatoryLeaveEndTime = value
    },
    days(value) {
      this.compensatoryLeaveDataForm.days = value
    }
  },
  computed: {
    overtimeDuration() {
      if (this.overtimeDataForm.overTimeStartTime && this.overtimeDataForm.overTimeEndTime) {
        const nextDay = this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 9, 2)
        let endTime
        if (new Date(this.overtimeDataForm.overTimeEndTime).getTime() > nextDay) {
          endTime = nextDay
        } else {
          endTime = new Date(this.overtimeDataForm.overTimeEndTime).getTime()
        }
        if (this.overtimeDataForm.overtimeType == 0) {
          return Math.round(((endTime - new Date(this.overtimeDataForm.overTimeStartTime).getTime()) / 1000 / 60 / 60) * 10) / 10
        } else {
          return Math.round(((endTime - new Date(this.overtimeDataForm.overTimeStartTime).getTime() - this.subTime()) / 1000 / 60 / 60) * 10) / 10
        }
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
    this.empId = this.$store.state.user.empId
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
    submitOverTime(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.overtimeDataForm.overtimeType == 1) {
          if (this.overtimeDataForm.overtimeDuration < 2) {
            this.$message.warning('加班时长不能小于2小时')
            return
          } else if (this.overtimeDataForm.overtimeDuration > 24) {
            this.$message.warning('加班时长不能大于24小时')
            return
          }
        }
        if (new Date().getTime() - 72 * 60 * 60 * 1000 > new Date(this.overtimeDataForm.overTimeStartTime).getTime()) {
          this.$message.warning('加班开始时间已超过72小时，请重新选择')
          return
        }

        let message = '提交后本次申请记录将无法修改，确定提交吗？'
        let data = {
          empId: this.empId,
          startTime: this.overtimeDataForm.overTimeStartTime,
          endTime: this.overtimeDataForm.overTimeEndTime,
          isRemoteWork: this.overtimeDataForm.isRemoteWork,
          overtimeType: this.overtimeDataForm.overtimeType,
          overtime_hours: this.overtimeDataForm.overtimeDuration,
          projectId: this.overtimeDataForm.projectId,
          reason: this.overtimeDataForm.overtimeReason,
          teamId: this.overtimeDataForm.projectManager
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/attendance/addOvertime'),
              method: 'post',
              data: data
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
      })
    },
    //提交调休申请
    submitCompensatoryLeave(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        if (this.compensatoryLeaveDataForm.days < 0.5) {
          this.$message.warning('调休时长最小0.5天')
          return
        }
        let message = '提交后本次申请记录将无法修改，确定提交吗？'
        let data = {
          empId: this.empId,
          startTime: this.compensatoryLeaveDataForm.compensatoryLeaveStartTime,
          endTime: this.compensatoryLeaveDataForm.compensatoryLeaveEndTime,
          dayffDays: this.compensatoryLeaveDataForm.days * 8
        }
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl('/attendance/addDayoff'),
              method: 'post',
              data: data
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
      })
    },
    //加班申请取消
    cancelOverTime() {
      this.clear(this.overtimeDataForm)
    },
    //调休申请取消
    cancelCompensatoryLeave() {
      this.clear(this.overtimeDataForm)
    },
    clear(form) {
      Object.keys(form).forEach((key) => {
        if (Array.isArray(form[key])) {
          form[key] = []
        } else {
          form[key] = ''
        }
      })
    },
    //计算两个日期之间的天数
    getDaysBetweenDates(date1, date2) {
      var oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒数
      var timeDiff = Math.abs(date2.getTime() - date1.getTime()) // 两个日期的差值的毫秒数
      var diffDays = Math.floor(timeDiff / oneDay) // 差值的天数
      return diffDays
    },
    //计算两个时间段之间的天数
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
    //节假日加班时要减去的午餐和晚餐时间
    subTime() {
      let startTime = new Date(this.overtimeDataForm.overTimeStartTime).getTime()
      let endTime = new Date(this.overtimeDataForm.overTimeEndTime).getTime()
      const elevenClock = this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 11, 1)
      const twelveClock = this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 12, 1)
      const thirteenClock = this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 13, 1)
      const eighteen = this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 18, 1)
      const nineteen = this.calNextDayTimeStamp(this.overtimeDataForm.overTimeStartTime, 19, 1)
      if (startTime < elevenClock) {
        if (twelveClock < endTime && thirteenClock > endTime) {
          return endTime - twelveClock
        } else if (thirteenClock <= endTime && eighteen > endTime) {
          return 60 * 60 * 1000
        } else if (eighteen <= endTime && nineteen > endTime) {
          return endTime - eighteen + 60 * 60 * 1000
        } else if (endTime >= nineteen) {
          return 2 * 60 * 60 * 1000
        } else {
          return 0
        }
      } else {
        if (eighteen <= endTime && nineteen > endTime) {
          return endTime - eighteen
        } else if (endTime >= nineteen) {
          return 60 * 60 * 1000
        } else {
          return 0
        }
      }
    },
    //计算指定时间的时间戳
    //flag 1为当天  2为次日
    calNextDayTimeStamp(date, hours, flag) {
      var currentDate = new Date(date)
      currentDate.setHours(hours)
      currentDate.setMinutes(0)
      currentDate.setSeconds(0)
      currentDate.setMilliseconds(0)
      if (flag == 1) {
        currentDate.setDate(currentDate.getDate())
      } else {
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return currentDate.getTime()
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
