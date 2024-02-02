<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%; margin: 0 10px" direction="vertical">
      <el-form ref="editProjectInfoForm" :rules="editProjectInfoFormRules" :model="editProjectInfoFormData" label-width="auto" class="form-item">
        <el-form-item label="项目类型:" prop="projectType">
          <el-radio-group v-model="editProjectInfoFormData.projectType" :disabled="operateType !== 'add'" @input="changeProjectType">
            <el-radio :label="0">合同立项</el-radio>
            <el-radio :label="1">研发立项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目名称:" prop="name">
          <el-input v-model="editProjectInfoFormData.name" placeholder="请输入项目名称" style="width: 80%" maxlength="50" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item label="归属部门:" prop="deptId">
          <el-select v-model="editProjectInfoFormData.deptId" style="width: 80% !important" placeholder="请选择归属部门">
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属团队:" prop="teamId">
          <el-select v-model="editProjectInfoFormData.teamId" style="width: 80% !important" placeholder="请选择归属团队">
            <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属项目集:" prop="psId">
          <el-select v-model="editProjectInfoFormData.psId" style="width: 80% !important" placeholder="请选择归属项目集">
            <el-option v-for="item in psList" :key="item.id" :label="item.psName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目经理:" prop="managerId">
          <el-select v-model="editProjectInfoFormData.managerId" style="width: 80% !important" placeholder="请选择项目经理">
            <el-option v-for="item in managerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="立项时间:" prop="approvalDate">
          <el-date-picker
            v-model="editProjectInfoFormData.approvalDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择立项时间"
            style="width: 80% !important"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="计划交付时间:" prop="deliveryDate">
          <el-date-picker
            v-model="editProjectInfoFormData.deliveryDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择计划交付时间"
            style="width: 80% !important"
          ></el-date-picker>
        </el-form-item>
        <el-form-item v-if="projectContractFlag" label="合同类型:" prop="contractType">
          <el-select v-model="editProjectInfoFormData.contractType" style="width: 80% !important" placeholder="请选择合同类型">
            <el-option v-for="item in contractTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="projectContractFlag" label="合同金额:" prop="contractAmount">
          <el-input v-model="editProjectInfoFormData.contractAmount" style="width: 80% !important" placeholder="请输入合同金额" clearable>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="总预算:" prop="generalBudget">
          <el-input v-model="editProjectInfoFormData.generalBudget" style="width: 80% !important" placeholder="请输入总预算" clearable>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="目标利润率:" prop="targetRate">
          <el-input v-model="editProjectInfoFormData.targetRate" style="width: 80% !important" placeholder="请输入目标利润率" clearable>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="projectContractFlag" label="结算周期:" prop="settlementCycle">
          <div style="display: flex; width: 80%">
            <el-input-number v-model="editProjectInfoFormData.settlementCycle" :min="1" :max="12"></el-input-number>
            <div style="margin-left: 10px">个月/次</div>
          </div>
        </el-form-item>
        <el-form-item v-if="operateType !== 'add'" label="项目编码:" prop="projectId">
          <el-input v-model="editProjectInfoFormData.projectId" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="operateType === 'update'" label="状态:" prop="state">
          <el-radio-group v-model="editProjectInfoFormData.state">
            <el-radio :label="0">交付中</el-radio>
            <el-radio :label="1">已交付</el-radio>
            <el-radio v-if="editProjectInfoFormData.projectType === 0" :label="3">已回款</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-row style="display: flex; justify-content: right; margin-top: 20px">
        <el-button type="primary" @click="saveCheck">确认</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-row>
    </el-container>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    const validateApprovalDate = (rule, value, callback) => {
      const approvalDate = this.editProjectInfoFormData.approvalDate
      const deliveryDate = this.editProjectInfoFormData.deliveryDate
      if (!value) {
        callback(new Error('请选择立项时间'))
      } else if (approvalDate && deliveryDate && approvalDate > deliveryDate) {
        callback(new Error('立项时间不得大于计划交付时间'))
      } else {
        callback()
      }
    }
    const validateDeliveryDate = (rule, value, callback) => {
      const approvalDate = this.editProjectInfoFormData.approvalDate
      const deliveryDate = this.editProjectInfoFormData.deliveryDate
      if (!value) {
        callback(new Error('请选择计划交付时间'))
      } else if (approvalDate && deliveryDate && approvalDate > deliveryDate) {
        callback(new Error('计划交付时间不得小于立项时间'))
      } else {
        callback()
      }
    }
    const validateTargetRate = (rule, value, callback) => {
      const regex = /^100(\.0{1,2})?$|^\d{1,2}(\.\d{1,2})?$/
      if (!value) {
        callback(new Error('请输入目标利润率'))
      } else if (!regex.test(value)) {
        callback(new Error('请输入最多两位小数的数字'))
      } else {
        callback()
      }
    }
    const validateGeneralBudget = (rule, value, callback) => {
      const regex = /^\d{1,13}(\.\d{1,2})?$/
      if (!value) {
        callback(new Error('请输入总预算'))
      } else if (!regex.test(value)) {
        callback(new Error('请输入一个最多带有两位小数的最大13位的正数'))
      } else {
        callback()
      }
    }
    return {
      editProjectInfoFormRules: {
        name: [{ required: true, message: '请输入项目名称', trigger: ['blur', 'change'] }],
        deptId: [{ required: true, message: '请选择归属部门', trigger: 'change' }],
        teamId: [{ required: true, message: '请选择归属团队', trigger: 'change' }],
        managerId: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
        approvalDate: [{ required: true, validator: validateApprovalDate, trigger: ['blur', 'change'] }],
        deliveryDate: [{ required: true, validator: validateDeliveryDate, trigger: ['blur', 'change'] }],
        contractType: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
        contractAmount: [{ required: true, message: '请选择合同金额', trigger: ['blur', 'change'] }],
        generalBudget: [{ required: true, validator: validateGeneralBudget, trigger: ['blur', 'change'] }],
        targetRate: [{ required: true, validator: validateTargetRate, trigger: ['blur', 'change'] }],
        settlementCycle: [{ required: true, message: '请输入结算周期', trigger: ['blur', 'change'] }]
      },
      editProjectInfoFormData: {
        projectType: 0,
        name: '',
        deptId: '',
        teamId: '',
        psId: '',
        managerId: '',
        approvalDate: '',
        deliveryDate: '',
        contractType: '',
        contractAmount: '',
        generalBudget: '',
        targetRate: '',
        settlementCycle: 1,
        projectId: '',
        state: ''
      },
      operateType: 'add',
      deptList: [],
      teamList: [],
      psList: [],
      managerList: [],
      contractTypeList: []
    }
  },
  computed: {
    projectContractFlag() {
      return this.editProjectInfoFormData.projectType === 0
    }
  },
  methods: {
    // 初始化
    init(initData) {
      this.operateType = initData.operateType
      this.deptList = initData.deptList
      this.teamList = initData.teamList
      this.psList = initData.psList
      this.managerList = initData.managerList
      this.contractTypeList = initData.contractTypeList
      if (initData.rowData) {
        Object.assign(this.editProjectInfoFormData, initData.rowData)
      }
    },

    // 项目类型变更时
    changeProjectType(projectType) {
      this.editProjectInfoFormRules.contractType[0].required = projectType === 0
      this.editProjectInfoFormRules.contractAmount[0].required = projectType === 0
      this.editProjectInfoFormData = {
        projectType: projectType,
        name: '',
        deptId: '',
        teamId: '',
        psId: '',
        managerId: '',
        approvalDate: '',
        deliveryDate: '',
        contractType: '',
        contractAmount: '',
        generalBudget: '',
        targetRate: '',
        settlementCycle: projectType === 0 ? 1 : '',
        projectId: '',
        state: ''
      }
    },

    // 保存前校验
    saveCheck() {
      this.$refs.editProjectInfoForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.save()
      })
    },

    // 保存
    save() {
      let url = '/costItems/add'
      let method = 'post'
      if (this.operateType === 'update') {
        url = '/costItems/update'
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: method,
        data: this.$http.adornData(this.editProjectInfoFormData)
      }).then(({ data }) => {
        if (data.success) {
          this.cancel()
          this.$message.success('操作成功')
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 取消
    cancel() {
      this.$emit('closeDrawer')
    }
  }
}
</script>

<style scoped>
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
</style>
