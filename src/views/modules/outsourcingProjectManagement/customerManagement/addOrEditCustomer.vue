<template>
  <div>
    <el-container class="container" direction="vertical">
      <el-form ref="customerFormData" :rules="customerFormRules" :model="customerFormData" label-width="auto" class="form-item">
        <el-form-item label="客户名称:" prop="customerName">
          <el-input v-model="customerFormData.customerName" placeholder="请输入客户名称" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="operateType == 'update'" label="客户编号:" prop="customerNumber">
          <el-input v-model="customerFormData.customerNumber" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="所属集团:" prop="membershipGroup">
          <el-input v-model="customerFormData.membershipGroup" placeholder="请输入所属集团" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-row class="btn-box">
        <el-button type="primary" class="confirm-btn" @click="saveCheck">确定</el-button>
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
      customerFormRules: {
        customerName: [{ required: true, message: '请输入客户名称', trigger: ['blur', 'change'] }],
        customerNumber: [{ required: true, message: '请输入客户编号', trigger: ['blur', 'change'] }],
        membershipGroup: [{ required: true, message: '请输入所属集团', trigger: ['blur', 'change'] }]
      },
      customerFormData: {
        customerName: '',
        membershipGroup: '',
        customerNumber: ''
      },
      operateType: 'add'
    }
  },
  computed: {},
  methods: {
    // 初始化数据
    init(initData) {
      console.log(initData)
      this.operateType = initData.operateType
      if (initData.rowData) {
        Object.assign(this.customerFormData, initData.rowData)
      }
    },
    // 保存前校验
    saveCheck() {
      this.$refs.customerFormData.validate((valid) => {
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
        data: this.$http.adornData(this.customerFormData)
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

<style scoped lang="scss">
.el-form-item__content .el-input-group {
  vertical-align: middle;
}

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
</style>
