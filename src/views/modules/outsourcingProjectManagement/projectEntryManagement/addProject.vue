<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" :model="formData" label-width="100px" :rules="rules">
          <el-form-item label="项目名称:" prop="projectIndex">
            <el-select v-model="formData.projectIndex" placeholder="请选择项目名称" clearable @change="changeProject">
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
                style="width: 200px"
                placeholder="请输入项目经理"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目客户" prop="customerName">
            <el-input
                v-model="formData.customerName"
                disabled
                type="text"
                style="width: 200px"
                placeholder="请输入项目客户"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户所属集团" prop="belongGroup">
            <el-input
                v-model="formData.belongGroup"
                disabled
                type="text"
                style="width: 200px"
                placeholder="请输入客户所属集团"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目开始时间:" prop="startTime">
            <el-date-picker
                v-model="formData.startTime"
                disabled
                style="width: 200px"
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
                style="width: 200px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="项目结束时间"
                clearable
            />
          </el-form-item>
          <el-form-item label="入场日期:" prop="entryTime">
            <el-date-picker
                v-model="formData.entryTime"
                style="width: 200px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择入场日期"
                clearable
            />
          </el-form-item>
          <el-form-item label="计划离场日期:" prop="planExitTime">
            <el-date-picker
                v-model="formData.planExitTime"
                style="width: 200px"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择计划离场日期"
                clearable
            />
          </el-form-item>
          <el-form-item label="人员岗位:" prop="postId">
            <el-select v-model="formData.postId" placeholder="请选择岗位" clearable>
                            <el-option v-for="item in jobList" :key="item.postId" :label="item.postName" :value="item.postId"/>
<!--              <el-option v-for="item in jobList" :key="item" :label="item" :value="item"/>-->
            </el-select>
          </el-form-item>
          <el-form-item label="人员等级:" prop="level">
            <el-select v-model="formData.level" style="width: 200px">
              <el-option v-for="item in postLevelSet" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="入场标记:" prop="entryMark">
            <el-radio-group v-model="formData.entryMark" style="width: 200px">
              <el-radio :label="0">
                真实入场
              </el-radio>
              <el-radio :label="1">
                虚拟入场
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="入场原因:" prop="projectManager">
            <el-input
                v-model="formData.projectManager"
                type="textarea"
                style="width: 200px"
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
        entryMark: '',
        empId: '',
        postId: '',
        postName: ''
      },
      postLevelSet: [],
      rules: {
        projectName: [{required: true, message: '请选择项目名称', trigger: 'change'}],
        projectManager: [{required: true, message: '项目经理不能为空', trigger: 'blur'}],
        customerName: [{required: true, message: '项目客户不能为空', trigger: 'blur'}],
        belongGroup: [{required: true, message: '客户所属集团不能为空', trigger: 'blur'}],
        startTime: [{required: true, message: '项目开始时间不能为空', trigger: 'blur'}],
        endTime: [{required: true, message: '项目结束时间不能为空', trigger: 'blur'}],
        entryTime: [{required: true, message: '请选择入场时间', trigger: 'change'}],
        planExitTime: [{required: true, message: '请选择计划离场时间', trigger: 'change'}]
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
    // 取消
    cancelDialog() {
      this.$parent.hide()
    },
    getProjects() {
      this.$http({
        url: this.$http.adornUrl('/externalProject/listCouldEntryProject?empId=' + this.initData.empId),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.projectList = data.payload.filter((item) => item.id !== 0)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    changeProject(row) {
      this.formData = this.projectList[row]
      this.formData.projectIndex = row
      this.postLevelSet = this.projectList[row].postLevelSet
      this.jobList = this.projectList[row].postDataList
    },

    // 确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return
        }
        this.formData.empId = this.initData.empId
        this.$http({
          url: this.$http.adornUrl('/externalProject/checkEntryProject'),
          method: 'post',
          data: this.formData
        }).then(({data}) => {
          if (data && data.code === 200) {
            if (data.payload.length !== 0) {
              this.$confirm(data.payload + ', 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.submit();
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
      }).then(({data}) => {
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
