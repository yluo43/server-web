<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div>
        <el-form ref="formData" :model="formData" label-width="auto" :rules="rules">
          <el-form-item label="统计时间段:" prop="timePeriod">
            <el-date-picker
              :disabled="flag === 'edit'"
              v-model="formData.timePeriod"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="年/月/日"
              end-placeholder="年/月/日"
              clearable
            />
          </el-form-item>
          <el-form-item label="统计部门:" prop="department">
            <el-select :disabled="flag === 'edit'" v-model="formData.department" multiple clearable @remove-tag="removeTag" collapse-tags>
              <el-option disabled v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">
                <el-checkbox :disabled="item.id === 0" v-model="item.check" @change="isCheck(item)">
                  {{ item.name }}
                </el-checkbox>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开始填报时间:" prop="reportStartTime">
            <el-date-picker v-model="formData.reportStartTime" type="date" value-format="yyyy-MM-dd" placeholder="开始填报时间" clearable />
          </el-form-item>
          <el-form-item label="填报天数:" prop="reportDay">
            <el-select v-model="formData.reportDay" clearable>
              <el-option v-for="item in days" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            天
          </el-form-item>
          <el-form-item label="确认天数:" prop="affirmDay">
            <el-select v-model="formData.affirmDay" clearable>
              <el-option v-for="item in days" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            天
          </el-form-item>
          <el-form-item label="归档天数:" prop="pigeonholeDay">
            <el-select v-model="formData.pigeonholeDay" clearable>
              <el-option v-for="item in days" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            天
          </el-form-item>
          <el-form-item label="提醒频率:" prop="frequency">
            <el-select v-model="formData.frequency" clearable>
              <el-option v-for="item in reminderFrequency" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            小时(9:00-18:00)
          </el-form-item>
          <el-form-item label="描述:" prop="intro" style="margin-top: 10px">
            <el-input type="textarea" show-word-limit maxlength="50" v-model="formData.intro" placeholder="请输入任务描述,不超过50字"></el-input>
          </el-form-item>
          <el-form-item style="display: flex; justify-content: right">
            <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
            <el-button type="primary" @click="confirm('formData')">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-container>
  </div>
</template>

<script>
import { getCName } from '@/utils/auth'
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    const validateReportStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始填报时间'))
        return
      }
      if (this.formData.reportStartTime && new Date(Date.parse(this.format())) > new Date(Date.parse(this.formData.reportStartTime))) {
        callback(new Error('开始填报时间应大于等于当前时间'))
        return
      }
      if (
        this.formData.reportStartTime &&
        this.formData.timePeriod[1] &&
        new Date(Date.parse(this.formData.timePeriod[1])) > new Date(Date.parse(this.formData.reportStartTime))
      ) {
        callback(new Error('开始填报时间应大于等于统计时间段截止时间'))
        return
      }
      callback()
    }
    return {
      //add 添加 edit编辑
      flag: '',
      managerName: '王瑢',
      formData: {
        //统计时间段department
        timePeriod: [],
        //统计部门
        department: [],
        //开始填报时间
        reportStartTime: '',
        //填报天数
        reportDay: '',
        //确认天数
        affirmDay: '',
        //归档天数
        pigeonholeDay: '',
        //提醒频率
        frequency: '',
        //简介
        intro: ''
      },
      days: [
        {
          id: 1,
          name: 1
        },
        {
          id: 2,
          name: 2
        },
        {
          id: 3,
          name: 3
        },
        {
          id: 4,
          name: 4
        },
        {
          id: 5,
          name: 5
        },
        {
          id: 6,
          name: 6
        },
        {
          id: 7,
          name: 7
        }
      ],
      //提醒频率
      reminderFrequency: [
        {
          id: 1,
          name: 1
        },
        {
          id: 2,
          name: 2
        },
        {
          id: 3,
          name: 3
        },
        {
          id: 4,
          name: 4
        },
        {
          id: 5,
          name: 5
        },
        {
          id: 6,
          name: 6
        }
      ],
      //部门
      departments: [],
      empId: '1260',
      rules: {
        timePeriod: [
          {
            type: 'array',
            required: true,
            message: '请选择统计时间段',
            fields: {
              0: { type: 'string', required: true, message: '请选择开始日期' },
              1: { type: 'string', required: true, message: '请选择结束日期' }
            }
          }
        ],
        department: [
          {
            type: 'array',
            required: true,
            message: '请选择要统计的部门'
          }
        ],
        reportStartTime: [
          {
            type: 'string',
            required: true,
            validator: validateReportStartDate,
            trigger: 'change'
          }
        ],
        reportDay: [{ required: true, message: '请选择填报天数', trigger: 'change' }],
        affirmDay: [{ required: true, message: '请选择确认天数', trigger: 'change' }],
        pigeonholeDay: [{ required: true, message: '请选择归档天数', trigger: 'change' }],
        frequency: [{ required: true, message: '请选择提醒频率', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.managerName = getCName()
    this.empId = this.$store.state.user.empId
  },
  created() {},
  methods: {
    //初始化数据
    async init(flag, initData) {
      this.flag = flag.operate
      await this.getDept()
      if (this.flag == 'edit') {
        this.$set(this.formData, 'timePeriod', [initData.startTime, initData.overTime])
        this.formData.department = initData.deptNames.split(',')
        Object.assign(this.formData, initData)
        this.departments.map((item) => {
          this.formData.department.forEach((ele) => {
            if (item.name === ele) {
              item.check = true
            }
          })
        })
      }
    },
    format() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = (month < 10 ? '0' : '') + month
      var datee = date.getDate()
      datee = (datee < 10 ? '0' : '') + datee
      return year + '-' + month + '-' + datee
    },
    //获取部门
    async getDept() {
      const result = await this.$http({
        url: this.$http.adornUrl('/common/getDept'),
        method: 'get'
      })
      if (result.data && result.data.code === 200) {
        result.data.payload.map((item) => {
          item.check = false
        })
        this.departments = result.data.payload.filter((item) => item.id !== 0)
      } else {
        this.$message.error(result.data.msg)
      }
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let dataList = { ...this.formData }
          dataList.startTime = this.formData.timePeriod[0]
          dataList.overTime = this.formData.timePeriod[1]
          let ids = []
          this.departments.forEach((ele) => {
            if (this.formData.department.includes(ele.name)) {
              ids.push(ele.id)
            }
          })
          dataList.deptIds = ids.toString()
          dataList.deptNames = this.formData.department.toString()
          dataList.managerId = this.empId
          dataList.managerName = this.managerName
          let params = {
            startTime: this.formData.timePeriod[0],
            overTime: this.formData.timePeriod[1],
            deptIds: ids.toString()
          }
          if (this.flag == 'add') {
            this.$http({
              url: this.$http.adornUrl('/workload/reportSelectTimeline'),
              method: 'post',
              data: params
            }).then(({ data }) => {
              if (data.code === 200 && data.success) {
                this.$message.error(data.msg)
                return false
              } else {
                this.$http({
                  url: this.$http.adornUrl('/workload/reportAdd'),
                  method: 'post',
                  data: dataList
                }).then(({ data }) => {
                  if (data && data.code === 200 && data.success) {
                    this.$message.success(data.msg)
                    this.cancelDialog()
                    this.$emit('selectTableData')
                  } else {
                    this.$message.error(data.msg)
                    this.cancelDialog()
                  }
                })
              }
            })
          } else {
            //编辑
            this.$http({
              url: this.$http.adornUrl('/workload/updateReport'),
              method: 'post',
              data: dataList
            }).then(({ data }) => {
              if (data && data.code === 200 && data.success) {
                this.$message.success(data.msg)
                this.cancelDialog()
                this.$emit('selectTableData')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    //选择框多选
    isCheck(item) {
      if (item.check && this.formData.department.indexOf(item.name) == -1) {
        this.formData.department.push(item.name)
      } else if (!item.check) {
        this.formData.department.forEach((elm, idx) => {
          if (elm == item.name) {
            this.formData.department.splice(idx, 1)
          }
        })
      }
    },
    removeTag(name) {
      this.departments.forEach((elm, idx) => {
        if (elm.name == name) {
          elm.check = false
        }
      })
    }
  }
}
</script>

<style scoped>
.el-date-editor.el-input {
  width: 190px;
}

.el-button {
  margin-left: 0;
  width: auto;
}
</style>
