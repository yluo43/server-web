<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-form :rules="rules" :model="dataForm" ref="dataFormRef" label-width="100px" style="width: 80%" class="form-item">
        <el-form-item label="项目来源:" prop="projectSource">
          <el-radio-group v-model="dataForm.projectSource">
            <el-radio :label="0">添加已有项目</el-radio>
            <el-radio :label="1">新建项目</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="dataForm.projectSource === 0">
          <el-form-item label="项目名称:" prop="projectId">
            <el-select v-model="dataForm.projectId" placeholder="请选择">
              <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="dataForm.projectSource === 1">
          <el-form-item label="项目类型:" prop="projectType">
            <el-radio-group v-model="dataForm.vo.projectType" style="width: 320px" @input="changeProjectType">
              <el-radio :label="0">合同立项</el-radio>
              <el-radio :label="1">研发立项</el-radio>
              <el-radio :label="2">运营管理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目名称:" prop="vo.name">
            <el-input v-model="dataForm.vo.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="归属部门:" prop="vo.deptName">
            <el-input v-model="dataForm.vo.deptName" disabled></el-input>
            <!-- <el-select v-model="dataForm.vo.deptId" placeholder="请选择" @change="changeManagerList">
              <el-option
                v-for="item in deptList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.name == '新讯数字科技有限公司'"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="归属团队:" prop="vo.teamId">
            <el-select v-model="dataForm.vo.teamId" placeholder="请选择">
              <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属项目集:" prop="vo.psName">
            <el-input v-model="dataForm.vo.psName" disabled></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="vo.managerId">
            <el-select v-model="dataForm.vo.managerId" placeholder="请选择">
              <el-option v-for="item in managerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目标签:" prop="vo.labels" v-if="dataForm.vo.projectType != 2">
            <el-select clearable v-model="dataForm.vo.labels" multiple collapse-tags placeholder="请选择项目标签">
              <el-option v-for="item in itemLabels" :key="item.id" :label="item.labelName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="立项时间:" prop="vo.approvalDate">
            <el-date-picker
              v-model="dataForm.vo.approvalDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="计划交付时间:"
            prop="vo.deliveryDate"
            :rules="[
              dataForm.vo.projectType == 0
                ? { required: true, validator: validateDeliveryDate, trigger: ['blur', 'change'] }
                : { validator: validateDeliveryDate, trigger: ['blur', 'change'] }
            ]"
          >
            <el-date-picker
              v-model="dataForm.vo.deliveryDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="甲方名称:" prop="vo.firstParty" v-if="dataForm.vo.projectType == 0">
            <el-input v-model="dataForm.vo.firstParty" placeholder="请输入甲方名称" maxlength="50" show-word-limit clearable></el-input>
          </el-form-item>
          <el-form-item label="合同名称:" prop="vo.contractName" v-if="dataForm.vo.projectType == 0">
            <el-input v-model="dataForm.vo.contractName" placeholder="请输入合同名称" maxlength="50" show-word-limit clearable></el-input>
          </el-form-item>
          <el-form-item label="合同编号:" prop="vo.contractNo" v-if="dataForm.vo.projectType == 0">
            <el-input v-model="dataForm.vo.contractNo" placeholder="请输入合同编号" maxlength="50" show-word-limit clearable></el-input>
          </el-form-item>
          <el-form-item label="合同类型:" prop="vo.contractType" v-if="dataForm.vo.projectType === 0">
            <el-select v-model="dataForm.vo.contractType" placeholder="请选择">
              <el-option v-for="item in contractTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目编码:" prop="vo.projectId" v-if="false">
            <el-input v-model="dataForm.vo.projectId" disabled></el-input>
          </el-form-item>
          <el-form-item label="合同金额:" prop="vo.contractAmount" v-if="dataForm.vo.projectType === 0">
            <el-input style="margin-top: 6px" v-model="dataForm.vo.contractAmount" placeholder="请输入合同金额" clearable>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总预算:" prop="vo.generalBudget" v-if="dataForm.vo.projectType !== 2">
            <el-input style="margin-top: 6px" v-model="dataForm.vo.generalBudget" placeholder="请输入总预算" clearable>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="目标利润率:" prop="vo.targetRate" v-if="dataForm.vo.projectType !== 2">
            <el-input style="margin-top: 6px" v-model="dataForm.vo.targetRate" placeholder="请输入目标利润率" clearable>
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="结算周期:" prop="vo.settlementCycle" v-if="dataForm.vo.projectType === 0">
            <div style="display: flex; align-items: center">
              <el-input-number v-model="dataForm.vo.settlementCycle" :min="1" :max="12"></el-input-number>

              <div style="margin-left: 10px">个月/次</div>
            </div>
          </el-form-item>
        </template>
        <el-row style="display: flex; justify-content: right; margin-top: 20px">
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
        projectId: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
        'vo.name': [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        // 'vo.deptId': [{ required: true, message: '请选择归属部门', trigger: 'change' }],
        'vo.teamId': [{ required: true, message: '请选择归属团队', trigger: 'change' }],
        'vo.managerId': [{ required: true, message: '请选择项目经理', trigger: 'change' }],
        'vo.labels': [{ required: true, message: '请选择项目标签', trigger: 'change' }],
        'vo.approvalDate': [{ required: true, message: '请选择立项时间', trigger: 'change' }],
        // 'vo.deliveryDate': [{ required: true, message: '请选择计划交付时间', trigger: 'change' }],
        'vo.firstParty': [{ required: true, message: '请输入甲方名称', trigger: 'blur' }],
        'vo.contractName': [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        'vo.contractNo': [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        'vo.contractType': [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        'vo.contractAmount': [{ required: true, message: '请输入合同金额', trigger: 'blur' }],
        'vo.generalBudget': [{ required: true, message: '请输入总预算', trigger: 'blur' }],
        'vo.targetRate': [{ required: true, message: '请输入目标利润率', trigger: 'change' }],
        'vo.settlementCycle': [{ required: true, message: '请选择结算周期', trigger: 'change' }]
      },
      dataForm: {
        id: null,
        projectSource: 0,
        projectId: null,
        vo: {
          projectType: 0,
          name: '',
          deptId: null,
          deptName: null,
          teamId: null,
          psId: null,
          psName: '',
          managerId: null,
          labels: [],
          approvalDate: '',
          deliveryDate: '',
          firstParty: null,
          contractName: null,
          contractNo: null,
          contractType: null,
          projectId: null,
          settlementCycle: null
        }
      },
      projectList: [],
      managerList: [],
      deptList: [],
      teamList: [],
      itemLabels: [],
      contractTypeList: [
        {
          id: 0,
          name: '自研-单价'
        },
        {
          id: 1,
          name: '自研-总价'
        },
        {
          id: 2,
          name: '外协-单价'
        }
      ],
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
    }
    // values: {
    //   deep: true,
    //   handler: function (newValues, oldValues) {
    //     if (newValues.approvalDate !== null && newValues.contractType !== null) {
    //       let obj = this.contractTypeList.find((item) => item.id === newValues.contractType)
    //       this.$http({
    //         url: this.$http.adornUrl('/costItems/getProjectId'),
    //         method: 'get',
    //         params: {
    //           approvalDate: this.dataForm.vo.approvalDate,
    //           contractType: this.dataForm.vo.contractType,
    //           contractTypeName: obj.name
    //         }
    //       }).then(({ data }) => {
    //         if (data && data.code === 200) {
    //           this.dataForm.vo.projectId = data.payload
    //         } else {
    //           this.$message.error(data.msg)
    //         }
    //       })
    //     }
    //   }
    // }
  },
  computed: {
    values: function () {
      return {
        approvalDate: this.dataForm.vo.approvalDate,
        contractType: this.dataForm.vo.contractType
      }
    }
  },
  mounted() {
    this.selectItemLabes()
    this.$http({
      url: this.$http.adornUrl('/common/getProject'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.projectList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    validateDeliveryDate(rule, value, callback) {
      const approvalDate = this.dataForm.vo.approvalDate
      const deliveryDate = this.dataForm.vo.deliveryDate
      if (!value && this.dataForm.vo.projectType == 0) {
        callback(new Error('请选择计划交付时间'))
      } else if (approvalDate && deliveryDate && approvalDate > deliveryDate) {
        callback(new Error('计划交付时间不得小于立项时间'))
      } else {
        callback()
      }
    },
    //查询项目标签
    selectItemLabes() {
      this.$http({
        url: this.$http.adornUrl('/common/getProjectLabel'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.itemLabels = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 项目类型变更时
    changeProjectType(projectType) {
      // this.editProjectInfoFormRules.contractType[0].required = projectType === 0
      // this.editProjectInfoFormRules.contractAmount[0].required = projectType === 0
      this.dataForm.vo = {
        projectType: projectType,
        name: null,
        deptId: this.dataForm.vo.deptId,
        deptName: this.dataForm.vo.deptName,
        teamId: null,
        psId: this.dataForm.vo.psId,
        psName: this.dataForm.vo.psName,
        managerId: null,
        labels: [],
        approvalDate: null,
        deliveryDate: null,
        firstParty: null,
        contractName: null,
        contractNo: null,
        contractType: null,
        projectId: null,
        settlementCycle: projectType === 0 ? 1 : null
      }
    },
    selectTeam(deptId) {
      this.$http({
        url: this.$http.adornUrl('/common/getTeamByDept?deptId=' + deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    init(data) {
      console.log(data)
      this.dataForm.id = data.dataRow.id
      this.deptList = data.deptList
      this.dataForm.vo.deptId = data.dataRow.deptId
      this.dataForm.vo.deptName = data.dataRow.deptName
      // this.teamList = data.teamList
      this.dataForm.vo.psId = data.dataRow.id
      this.dataForm.vo.psName = data.dataRow.psName
      if (this.dataForm.vo.deptId == '' || this.dataForm.vo.deptId == null) {
        return false
      }
      this.selectTeam(this.dataForm.vo.deptId)
      this.$http({
        url: this.$http.adornUrl('/common/getManagerByDept?roleId=4&deptId=' + this.dataForm.vo.deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.managerList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
      // this.$http({
      //   url: this.$http.adornUrl('/common/getManager'),
      //   params: { pid: 4 },
      //   method: 'get'
      // }).then(({ data }) => {
      //   if (data && data.code === 200) {
      //     this.managerList = data.payload
      //   } else {
      //     this.$message.error(data.msg)
      //   }
      // })
    },
    // changeManagerList() {
    //   if (this.dataForm.vo.deptId == '' || this.dataForm.vo.deptId == null) {
    //     return false
    //   }
    //   this.dataForm.vo.teamId = ''
    //   this.dataForm.vo.managerId = ''
    //   let deptId = this.dataForm.vo.deptId
    //   this.selectTeam(deptId)
    //   this.$http({
    //     url: this.$http.adornUrl('/common/getManagerByDept?roleId=4&deptId=' + deptId),
    //     method: 'get'
    //   }).then(({ data }) => {
    //     if (data && data.code === 200) {
    //       this.managerList = data.payload
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   })
    // },
    addCheck() {
      console.log(this.dataForm)
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.addOrUpdateHandle()
      })
    },
    // 新增
    addOrUpdateHandle() {
      this.$http({
        url: this.$http.adornUrl('/projectSet/addProject'),
        method: 'post',
        data: this.dataForm
      }).then(({ data }) => {
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
    },
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
.form-item .el-input {
  width: 260px; /* 你可以根据需要调整这个值 */
}
::v-deep .el-select {
  width: 260px !important;
}
.el-input-number {
  line-height: 26px;
}
</style>
