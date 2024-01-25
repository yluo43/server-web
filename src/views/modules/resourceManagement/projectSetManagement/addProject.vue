<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-form
        :rules="rules"
        :model="dataForm"
        ref="dataFormRef"
        label-width="100px"
        style="width: 80%"
        class="form-item"
      >
        <el-form-item label="项目来源:" prop="projectSource">
          <el-radio-group v-model="dataForm.projectSource">
            <el-radio :label="0">添加已有项目</el-radio>
            <el-radio :label="1">新建项目</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="dataForm.projectSource===0">
          <el-form-item label="项目名称:" prop="projectId">
            <el-select v-model="dataForm.projectId" placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="dataForm.projectSource===1">
          <el-form-item label="项目类型:" prop="projectType">
            <el-radio-group v-model="dataForm.vo.projectType">
              <el-radio :label="0">合同立项</el-radio>
              <el-radio :label="1">研发立项</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目名称:" prop="vo.name">
            <el-input
              v-model="dataForm.vo.name"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="归属部门:" prop="vo.deptId">
            <el-select v-model="dataForm.vo.deptId" placeholder="请选择">
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属团队:" prop="vo.teamId">
            <el-select v-model="dataForm.vo.teamId" placeholder="请选择">
              <el-option
                v-for="item in teamList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属项目集:" prop="vo.psName">
            <el-input
              v-model="dataForm.vo.psName" disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="vo.managerId">
            <el-select v-model="dataForm.vo.managerId" placeholder="请选择">
              <el-option
                v-for="item in managerList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="立项时间:" prop="vo.approvalDate">
            <el-date-picker
              v-model="dataForm.vo.approvalDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="计划交付时间:" prop="vo.deliveryDate">
            <el-date-picker
              v-model="dataForm.vo.deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合同类型:" prop="vo.contractType" v-if="dataForm.vo.projectType===0">
            <el-select v-model="dataForm.vo.contractType" placeholder="请选择">
              <el-option
                v-for="item in contractTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目编码:" prop="vo.projectId">
            <el-input
              v-model="dataForm.vo.projectId"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="结算周期:" prop="vo.settlementCycle" v-if="dataForm.vo.projectType===0">
            <el-select v-model="dataForm.vo.settlementCycle" placeholder="请选择">
              <el-option
                v-for="item in settlementCycleList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-row style=" display: flex; justify-content: right;margin-top: 20px">
          <el-button type="primary" @click="addCheck">确认</el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-row>
      </el-form>

    </el-container>

  </div>

</template>
<script>
export default {
  data() {
    return {
      rules: {
        projectId: [{required: true, message: '请选择项目名称', trigger: 'change'}],
        'vo.name': [{required: true, message: '请输入项目名称', trigger: 'blur'}],
        'vo.deptId': [{required: true, message: '请选择归属部门', trigger: 'change'}],
        'vo.teamId': [{required: true, message: '请选择归属团队', trigger: 'change'}],
        'vo.managerId': [{required: true, message: '请选择项目经理', trigger: 'change'}],
        'vo.approvalDate': [{required: true, message: '请选择立项时间', trigger: 'change'}],
        'vo.deliveryDate': [{required: true, message: '请选择计划交付时间', trigger: 'change'}],
        'vo.contractType': [{required: true, message: '请选择合同类型', trigger: 'change'}],
        'vo.settlementCycle': [{required: true, message: '请选择结算周期', trigger: 'change'}],
      },
      dataForm: {
        id: null,
        projectSource: 0,
        projectId: null,
        vo: {
          projectType: 0,
          name: '',
          deptId: null,
          teamId: null,
          psId: null,
          psName: '',
          managerId: null,
          approvalDate: '',
          deliveryDate: '',
          contractType: null,
          projectId: null,
          settlementCycle: null,
        }
      },
      projectList: [],
      managerList: [],
      deptList: [],
      teamList: [],
      contractTypeList: [
        {
          id: 0,
          name: '自研-单价',
        },
        {
          id: 1,
          name: '自研-总价',
        },
        {
          id: 2,
          name: '外协-单价',
        },],
      settlementCycleList: []
    }
  },
  watch: {
    'dataForm.vo.contractType'(newName, oldName) {
      this.settlementCycleList = []
      if (newName === 0 || newName === 2) {
        for (let i = 1; i <= 12; i++) {
          this.settlementCycleList.push(i)
        }
        this.dataForm.vo.settlementCycle = null
      } else {
        this.dataForm.vo.settlementCycle = null
        this.settlementCycleList = [1, 3, 6, 12]
      }
    },
    'dataForm.vo.projectType'(newName, oldName) {
      this.$refs.dataFormRef.clearValidate()
    },
    values: {
      deep: true,
      handler: function (newValues, oldValues) {
        if (newValues.approvalDate !== null && newValues.contractType !== null) {
          let obj = this.contractTypeList.find(item => item.id === newValues.contractType);
          this.$http({
            url: this.$http.adornUrl('/costItems/getProjectId'),
            method: 'get',
            params: {
              approvalDate: this.dataForm.vo.approvalDate,
              contractType: this.dataForm.vo.contractType, contractTypeName: obj.name
            }
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataForm.vo.projectId = data.payload
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    },
  },
  computed: {
    values: function () {
      return {
        approvalDate: this.dataForm.vo.approvalDate,
        contractType: this.dataForm.vo.contractType
      };
    }
  }
  ,
  mounted() {
    this.$http({
      url: this.$http.adornUrl('/common/getProject'),
      method: 'get'
    }).then(({data}) => {
      if (data && data.code === 200) {
        this.projectList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  }
  ,
  methods: {
    init(data) {
      this.dataForm.id = data.dataRow.id
      this.deptList = data.deptList
      this.teamList = data.teamList
      this.dataForm.vo.psId = data.dataRow.psId
      this.dataForm.vo.psName = data.dataRow.psName
      this.$http({
        url: this.$http.adornUrl('/common/getManager'),
        params: {pid: 4},
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.managerList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    }
    ,
    addCheck() {
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.addOrUpdateHandle()
      })
    }
    ,
    // 新增
    addOrUpdateHandle() {
      this.$http({
        url: this.$http.adornUrl('/projectSet/addProject'),
        method: 'post',
        data: this.dataForm
      }).then(({data}) => {
        if (data.success) {
          this.$emit('refreshDataList')
          this.$parent.hide()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    }
    ,
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
.form-item .el-select, .form-item .el-input {
  width: 100%; /* 你可以根据需要调整这个值 */
}
</style>
