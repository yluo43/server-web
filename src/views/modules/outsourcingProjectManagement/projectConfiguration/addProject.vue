<template>
  <div>
    <el-container class="container" direction="vertical">
      <el-form ref="projectFormData" :rules="projectFormRules" :model="projectFormData" label-width="auto" class="form-item">
        <el-form-item label="项目名称:" prop="projectName">
          <el-input v-model="projectFormData.projectName" placeholder="请输入项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目经理:" prop="projectManagerId">
          <el-select v-model="projectFormData.projectManagerId" placeholder="请选择项目经理" clearable>
            <el-option v-for="item in projectManagers" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联项目:" prop="associatedProjectId">
          <el-select v-model="projectFormData.associatedProjectId" placeholder="请选择关联项目" clearable>
            <el-option v-for="item in associatedProjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户名称:" prop="customerId">
          <el-select v-model="projectFormData.customerId" placeholder="请选择客户名称" clearable>
            <el-option v-for="item in customerNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属集团:" prop="membershipGroup">
          <el-input v-model="projectFormData.membershipGroup" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="开始日期:" prop="startTime">
          <el-date-picker v-model="projectFormData.startTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始日期" clearable />
        </el-form-item>
        <el-form-item label="结束日期:" prop="endTime">
          <el-date-picker v-model="projectFormData.endTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束日期" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="notes">
          <el-input type="textarea" v-model="projectFormData.notes" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <el-row class="btn-box">
        <el-button type="primary" class="confirm-btn" @click="confirm()">确定</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-row>
    </el-container>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      projectFormRules: {
        projectName: [{ required: true, message: '请输入项目名称', trigger: ['blur', 'change'] }],
        projectManagerId: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
        customerId: [{ required: true, message: '请选择客户名称', trigger: 'change' }],
        startTime: [{ type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }],
        endTime: [{ type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }]
      },
      projectFormData: {
        //项目名称
        projectName: '',
        //项目经理
        projectManagerId: '',
        //关联项目
        associatedProjectId: '',
        //客户名称
        customerId: '',
        //客户所属集团
        membershipGroupId: '',
        //开始时间
        startTime: '',
        //结束时间
        endTime: '',
        //备注
        notes: ''
      },
      projectManagers: [],
      associatedProjects: [],
      customerNames: []
    }
  },
  computed: {},
  mounted() {},
  methods: {
    confirm() {
      this.$refs.projectFormData.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http({
          url: this.$http.adornUrl(''),
          method: post,
          data: this.$http.adornData(this.projectFormData)
        }).then(({ data }) => {
          if (data.success) {
            this.cancel()
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 取消
    cancel() {
      this.$emit('closeDrawer')
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  padding: 0 50px;
}
.btn-box {
  display: flex;
  justify-content: flex-end;
  margin: 60px 0;
  .confirm-btn {
    margin-right: 20px;
  }
}
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
.el-select {
  width: 100%;
}
.el-date-editor.el-input {
  width: 100%;
}
</style>
