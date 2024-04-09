<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%; margin: 0 10px" direction="vertical">
      <el-form ref="editPersonnelInfoForm" :rules="editPersonnelInfoFormRules" :model="editPersonnelInfoFormData" label-width="auto" class="form-item">
        <el-form-item label="人员姓名:" prop="empId">
          <el-select
            clearable
            v-model="editPersonnelInfoFormData.empId"
            :disabled="operateType == 'update'"
            filterable
            style="width: 80% !important"
            placeholder="请选择人员姓名"
          >
            <el-option v-for="item in personnelList" :key="item.empId" :label="item.empId + '-' + item.name" :value="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始支撑时间:" prop="supportDate">
          <el-date-picker
            v-model="editPersonnelInfoFormData.supportDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择开始支撑时间"
            style="width: 80% !important"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束支撑时间:" prop="endSupportDate">
          <el-date-picker
            v-model="editPersonnelInfoFormData.endSupportDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择结束支撑时间"
            style="width: 80% !important"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="投入占比:" prop="investRate">
          <el-input v-model="editPersonnelInfoFormData.investRate" style="width: 80% !important" placeholder="请输入目标利润率" clearable>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>

      <el-row style="display: flex; justify-content: right; margin: 20px 10px">
        <el-button type="primary" @click="saveCheck">确认</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-row>
    </el-container>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    const validateInvestRate = (rule, value, callback) => {
      const regex = /^100(\.0{1,2})?$|^\d{1,2}(\.\d{1,2})?$/
      if (!value) {
        callback(new Error('请输入投入占比'))
      } else if (value > 100) {
        callback(new Error('投入占比不得超过100%'))
      } else if (value < 0) {
        callback(new Error('投入占比需大于等于0'))
      } else if (!regex.test(value)) {
        callback(new Error('投入占比最多保留2位小数'))
      } else {
        callback()
      }
    }
    const validateSupportDate = (rule, value, callback) => {
      const supportDate = this.editPersonnelInfoFormData.supportDate
      const endSupportDate = this.editPersonnelInfoFormData.endSupportDate
      if (!value) {
        callback(new Error('请选择开始支撑时间'))
      } else if (supportDate && endSupportDate && supportDate > endSupportDate) {
        callback(new Error('开始支撑时间不得大于结束支撑时间'))
      } else {
        callback()
      }
    }
    const validateEndSupportDate = (rule, value, callback) => {
      const supportDate = this.editPersonnelInfoFormData.supportDate
      const endSupportDate = this.editPersonnelInfoFormData.endSupportDate
      if (!value) {
        callback(new Error('请选择结束支撑时间'))
      } else if (supportDate && endSupportDate && supportDate > endSupportDate) {
        callback(new Error('结束支撑时间不能小于开始支撑时间'))
      } else {
        callback()
      }
    }
    return {
      operateType: 'add',
      personnelList: [],
      editPersonnelInfoFormData: {
        id: '',
        empId: '',
        projectId: '',
        supportDate: '',
        endSupportDate: '',
        investRate: ''
      },
      editPersonnelInfoFormRules: {
        empId: [{ required: true, message: '请选择人员姓名', trigger: 'change' }],
        supportDate: [{ required: true, validator: validateSupportDate, trigger: 'change' }],
        endSupportDate: [{ required: true, validator: validateEndSupportDate, trigger: 'change' }],
        investRate: [{ required: true, validator: validateInvestRate, trigger: ['blur', 'change'] }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    // 初始化
    initPersonnelInfo(initData) {
      this.operateType = initData.operateType
      console.log(this.operateType)
      this.editPersonnelInfoFormData.projectId = initData.projectId
      if (initData.rowData) {
        Object.assign(this.editPersonnelInfoFormData, initData.rowData)
      }
      this.queryEmpList()
    },

    // 获取人员信息
    queryEmpList() {
      this.$http({
        url: this.$http.adornUrl('/common/getProjectMember'),
        method: 'get'
      }).then(({ data }) => {
        if (data.success) {
          this.personnelList = [...data.payload]
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 保存前校验
    saveCheck() {
      this.$refs.editPersonnelInfoForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.save()
      })
    },

    // 保存
    save() {
      let url = '/costItems/member/add'
      let method = 'post'
      if (this.operateType === 'update') {
        url = '/costItems/member/update'
        method = 'put'
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: method,
        data: this.$http.adornData(this.editPersonnelInfoFormData)
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
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
</style>
