<template>
  <div>
    <el-container class="container" direction="vertical">
      <el-form
          ref="projectFormData"
          :rules="projectFormRules"
          :model="projectFormData"
          label-width="auto"
          class="form-item"
      >
        <el-form-item label="项目名称:" prop="name">
          <el-input v-model="projectFormData.name" placeholder="请输入项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目经理:" prop="projectManagerId">
          <el-cascader
              v-model="projectFormData.projectManagerId"
              :options="projectManagers"
              placeholder="请选择项目经理"
              :show-all-levels="false"
              style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="关联项目:" prop="associatedProjectId">
          <el-select v-model="projectFormData.projectId" placeholder="请选择关联项目" clearable>
            <el-option
                v-for="item in associatedProjects"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目客户:" prop="customerId">
          <el-select v-model="projectFormData.customerId" placeholder="请选择项目客户" clearable @change="customChange">
            <el-option v-for="item in customerNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属集团:" prop="membershipGroup">
          <el-input v-model="projectFormData.membershipGroup" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="开始日期:" prop="startTime">
          <el-date-picker
              v-model="projectFormData.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始日期"
              clearable
          />
        </el-form-item>
        <el-form-item label="结束日期:" prop="endTime">
          <el-date-picker
              v-model="projectFormData.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择结束日期"
              clearable
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="projectFormData.remark" style="margin-block: 6px" type="textarea" maxlength="100"
                    show-word-limit></el-input>
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
        name: [{required: true, message: '请输入项目名称', trigger: ['blur', 'change']}],
        projectManagerId: [{required: true, message: '请选择项目经理', trigger: 'change'}],
        customerId: [{required: true, message: '请选择项目客户', trigger: 'change'}],
        startTime: [{required: true, message: '请选择开始日期', trigger: 'change'}],
        endTime: [{required: true, message: '请选择结束日期', trigger: 'change'}]
      },
      projectFormData: {
        // 项目名称
        name: '',
        // 项目经理
        managerId: '',
        // 关联项目
        projectId: '',
        // 项目客户
        customerId: '',
        // 客户所属集团
        membershipGroupId: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 备注
        remark: '',
        projectManagerId: []
      },
      projectManagers: [],
      associatedProjects: [],
      customerNames: [],
      customers: {}
    }
  },
  computed: {},
  mounted() {
    this.$http({
      url: this.$http.adornUrl('/common/getManagerData'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.projectManagers = data.payload.map(dept => {
          const transformedDept = {
            value: dept.deptId.toString(), // 将deptId转换为字符串，因为value可能是字符串类型
            label: dept.deptName,
            children: dept.managerDtoList.map(manager => ({
              value: manager.id.toString(), // 同样，将id转换为字符串
              label: manager.name
            }))
          }
          return transformedDept
        })
      } else {
        this.$message.error(data.msg)
      }
    })

    this.$http({
      url: this.$http.adornUrl('/projectSet/listRelProject'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.associatedProjects = data.payload.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })

    this.$http({
      url: this.$http.adornUrl('/externalProject/listCustomer?pageSize=999'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.customerNames = data.payload.list.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    confirm() {
      this.$refs.projectFormData.validate((valid) => {
        if (!valid) {
          return false
        }
        this.projectFormData.managerId = this.projectFormData.projectManagerId[1]
        this.$http({
          url: this.$http.adornUrl('/externalProject/insertExternalProject'),
          method: 'post',
          data: this.$http.adornData(this.projectFormData)
        }).then(({data}) => {
          if (data.success) {
            this.cancel()
            this.$emit('goDetail',data.payload)
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 取消
    cancel() {
      this.$emit('closeDrawer')
    },
    customChange(i) {
      this.customerNames.forEach(e => {
        if (e.id === i) {
          this.projectFormData.membershipGroup = e.belongGroup
          return
        }
      })
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
