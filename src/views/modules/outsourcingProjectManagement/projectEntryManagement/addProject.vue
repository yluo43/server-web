<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" :model="formData" label-width="100px" :rules="rules">
          <el-form-item label="项目名称:" prop="projectIndex">
            <el-select
              v-model="formData.projectIndex"
              placeholder="请选择项目名称"
              clearable
              style="width: 300px"
              @change="changeProject"
            >
              <el-option
                v-for="(item,i) in projectList"
                :key="item.projectId"
                :label="item.name"
                :value="i"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目经理:" prop="managerName">
            <el-input
              v-model="formData.managerName"
              disabled
              type="text"
              style="width: 300px"
              placeholder="请输入项目经理"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目客户" prop="customerName">
            <el-input
              v-model="formData.customerName"
              disabled
              type="text"
              style="width: 300px"
              placeholder="请输入项目客户"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户所属集团" prop="belongGroup">
            <el-input
              v-model="formData.belongGroup"
              disabled
              type="text"
              style="width: 300px"
              placeholder="请输入客户所属集团"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目开始时间:" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              disabled
              style="width: 300px"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="项目开始时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目结束时间:" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              disabled
              style="width: 300px"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="项目结束时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="入场日期:" prop="entryTime">
            <el-date-picker
              v-model="formData.entryTime"
              style="width: 300px"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择入场日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="计划离场日期:" prop="planExitTime">
            <el-date-picker
              v-model="formData.planExitTime"
              style="width: 300px"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择计划离场日期"
              clearable
            />
          </el-form-item>
          <el-form-item label="人员岗位:" prop="postIndex">
            <el-select v-model="formData.postIndex" placeholder="请选择岗位" clearable style="width: 300px" @change="jobChange">
              <el-option v-for="(item,i) in jobList" :key="item.name" :label="item.name" :value="i" />
            </el-select>
          </el-form-item>
          <el-form-item label="人员等级:" prop="postId">
            <el-select v-model="formData.postId" style="width: 300px">
              <el-option v-for="item in postLevelSet" :key="item.postId" :label="item.level" :value="item.postId" />
            </el-select>
          </el-form-item>
          <el-form-item label="入场标记:" prop="entryMark">
            <el-radio-group v-model="formData.entryMark" style="width: 300px" @change="changeEntryMark">
              <el-radio :label="0">
                真实入场
              </el-radio>
              <el-radio :label="1">
                虚拟入场
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入场原因:" prop="entryReason">
            <el-input
              v-model="formData.entryReason"
              type="textarea"
              style="width: 300px;margin-block: 6px"
              placeholder="请输入入场原因"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin-right: 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm('formData')">确定</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initData: {},
      jobList: [],
      pickerOptions: {
        disabledDate(time) {
          // 获取今天的日期
          const today = new Date();
          // 设置今天的日期时间为00:00:00
          today.setHours(0, 0, 0, 0);
          // 如果传入的日期小于今天的日期，则返回true，表示该日期被禁用
          return time.getTime() < today.getTime();
        }
      },
      projectList: [],
      formData: {
        projectIndex: '',
        projectId: '',
        level: '',
        managerName: '',
        customerName: '',
        belongGroup: '',
        startTime: '',
        endTime: '',
        entryTime: '',
        planExitTime: '',
        entryMark: 0,
        empId: '',
        postId: '',
        postName: '',
        postIndex: '',
        entryReason: ''
      },
      postLevelSet: [],
      rules: {
        projectName: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        projectManager: [{ required: true, message: '项目经理不能为空', trigger: 'blur' }],
        customerName: [{ required: true, message: '项目客户不能为空', trigger: 'blur' }],
        belongGroup: [{ required: true, message: '客户所属集团不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '项目开始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '项目结束时间不能为空', trigger: 'blur' }],
        entryTime: [{ required: true, message: '请选择入场时间', trigger: 'change' }],
        planExitTime: [{ required: true, message: '请选择计划离场时间', trigger: 'change' }],
        postIndex: [{ required: true, message: '请选择人员岗位', trigger: 'change' }],
        entryMark: [{ required: true, message: '请选择入场标记', trigger: 'change' }],
        postId: [{ required: true, message: '请选择人员等级', trigger: 'change' }],
        entryReason: [{ required: false, message: '请选择入场原因', trigger: 'change' }]
      }
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    // 初始化数据
    init(initData) {
      this.initData = initData
      this.getProjects()
    },
    jobChange() {
      this.postLevelSet.length = 0
      this.postLevelSet = [...this.jobList[this.formData.postIndex].levels]
      delete this.formData.postId
    },
    // 取消
    cancelDialog() {
      this.$parent.hide()
    },
    getProjects() {
      this.$http({
        url: this.$http.adornUrl('/externalProject/listCouldEntryProject?empId=' + this.initData.empId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.projectList = data.payload.filter((item) => item.id !== 0)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    changeEntryMark() {
      if (this.formData.entryMark === 1) {
        this.rules.entryReason[0].required = true
      } else {
        this.rules.entryReason[0].required = false
      }
    },
    changeProject(row) {
      this.formData = this.projectList[row]
      this.formData.projectIndex = row
      // 人员岗位和level
      this.$http({
        url: this.$http.adornUrl('/externalProject/listProjectUnitPrice?projectId=' + this.formData.projectId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.jobList = data.payload.list.reduce((acc, item) => {
            // 如果acc中还没有这个name，就添加一个新对象
            if (!acc[item.name]) {
              acc[item.name] = { name: item.name, levels: [{ postId: item.id, level: item.level }] }
            } else {
              // 如果已经有了，就把level添加到levels数组中
              acc[item.name].levels.push({ postId: item.id, level: item.level })
            }
            return acc
          }, {})
        } else {
          this.$message.error(data.msg)
        }
      })
      // this.postLevelSet = this.projectList[row].postLevelSet
      // this.jobList = this.projectList[row].postDataList
    },

    // 确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.formData.postName = this.jobList[this.formData.postIndex].name
        this.formData.empId = this.initData.empId
        this.$http({
          url: this.$http.adornUrl('/externalProject/checkEntryProject'),
          method: 'post',
          data: this.formData
        }).then(({ data }) => {
          if (data && data.code === 200) {
            if (data.payload.length !== 0) {
              this.$confirm(data.payload + ', 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.submit()
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消入场'
                })
              })
            } else {
              this.submit()
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    submit() {
      this.$http({
        url: this.$http.adornUrl('/externalProject/entryProject'),
        method: 'post',
        data: this.formData
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            type: 'success',
            message: '入场成功!'
          })
          this.$emit('close')
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
::v-deep .el-input__icon {
  line-height: 20px !important;
}
</style>
