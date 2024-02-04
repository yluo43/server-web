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
            <el-select v-model="formData.department" multiple clearable @remove-tag="removeTag">
              <el-option disabled v-for="item in departments" :key="item.id" :label="item.name" :value="item.id">
                <el-checkbox v-model="item.check" @change="isCheck(item)">
                  {{ item.name }}
                </el-checkbox>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开始填报时间:" prop="startTime">
            <el-date-picker v-model="formData.startTime" type="date" value-format="yyyy-MM-dd" placeholder="开始填报时间" clearable />
          </el-form-item>
          <el-form-item label="填报天数:" prop="reportingDays">
            <el-select v-model="formData.reportingDays" clearable>
              <el-option v-for="item in reportingDays" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            天
          </el-form-item>
          <el-form-item label="确认天数:" prop="confirmDays">
            <el-select v-model="formData.confirmDays" clearable>
              <el-option v-for="item in confirmDays" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            天
          </el-form-item>
          <el-form-item label="归档天数:" prop="archiveDays">
            <el-select v-model="formData.archiveDays" clearable>
              <el-option v-for="item in archiveDays" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            天
          </el-form-item>
          <el-form-item label="提醒频率:" prop="reminderFrequency">
            <el-select v-model="formData.reminderFrequency" clearable>
              <el-option v-for="item in reminderFrequency" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            小时(9:00-18:00)
          </el-form-item>
          <el-form-item label="描述:" prop="desc" style="margin-top: 10px">
            <el-input type="textarea" v-model="formData.desc" placeholder="请输入项目集简介，不超过50字"></el-input>
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
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      //add 添加 edit编辑
      flag: '',
      formData: {
        //统计时间段
        timePeriod: [],
        //统计部门
        department: [],
        //开始填报时间
        startTime: '',
        //填报天数
        reportingDays: '',
        //确认天数
        confirmDays: '',
        //归档天数
        archiveDays: '',
        //提醒频率
        reminderFrequency: '',
        //简介
        desc: ''
      },
      reportingDays: [
        {
          id: 1,
          name: 2
        },
        {
          id: 2,
          name: 3
        }
      ],
      confirmDays: [],
      archiveDays: [],
      reminderFrequency: [],
      departments: [
        {
          id: 1,
          name: 2,
          check: false
        },
        {
          id: 2,
          name: 3,
          check: false
        }
      ],
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
        startTime: [
          {
            type: 'string',
            required: true,
            message: '请选择开始填报时间',
            trigger: 'change'
          }
        ],
        reportingDays: [{ required: true, message: '请选择填报天数', trigger: 'change' }],
        confirmDays: [{ required: true, message: '请选择确认天数', trigger: 'change' }],
        archiveDays: [{ required: true, message: '请选择归档天数', trigger: 'change' }],
        reminderFrequency: [{ required: true, message: '请选择提醒频率', trigger: 'change' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    //初始化数据
    init(flag, initData) {
      this.flag = flag
      Object.assign(this.formData, initData)
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        } else {
          return false
        }
      })
    },
    //选择框多选
    isCheck(item) {
      if (item.check && this.formData.department.indexOf(item.id) == -1) {
        this.formData.department.push(item.id)
      } else if (!item.check) {
        this.formData.department.forEach((elm, idx) => {
          if (elm == item.id) {
            this.formData.department.splice(idx, 1)
          }
        })
      }
    },
    removeTag(id) {
      this.departments.forEach((elm, idx) => {
        if (elm.id == id) {
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
.chooseResult {
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
}

.chooseResultStr {
  margin-left: 10px;
}

.el-button {
  margin-left: 0;
  width: auto;
}
</style>
