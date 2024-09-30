<template>
  <div>
    <el-container class="container" direction="vertical">
      <el-form
          ref="customerFormData"
          :rules="customerFormRules"
          :model="customerFormData"
          label-width="auto"
          class="form-item">
        <el-form-item label="项目客户:" prop="name">
          <el-input v-model="customerFormData.name" placeholder="请输入项目客户" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="operateType == 'update'" label="客户编号:" prop="id">
          <el-input v-model="customerFormData.id" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="所属集团:" prop="belongGroup">
          <el-input v-model="customerFormData.belongGroup" placeholder="请输入所属集团" clearable></el-input>
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
        name: [{required: true, message: '请输入项目客户', trigger: ['blur', 'change']},
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                callback(new Error('项目客户最长不能超过30个字符'));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change']
          }],
        belongGroup: [{required: true, message: '请输入所属集团', trigger: ['blur', 'change']},
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                callback(new Error('所属集团最长不能超过30个字符'));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change']
          }]
      },
      customerFormData: {
        name: '',
        belongGroup: '',
        id: ''
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
      let url = '/externalProject/insertCustomer'
      if (this.operateType === 'update') {
        url = '/externalProject/updateCustomer'
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: this.operateType === 'update' ? 'put' : 'post',
        data: this.$http.adornData(this.customerFormData)
      }).then(({data}) => {
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
