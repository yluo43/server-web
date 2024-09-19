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
        <el-form-item label="岗位名称:" prop="name">
          <el-input v-model="projectFormData.name" placeholder="岗位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位级别:" prop="level">
          <el-input v-model="projectFormData.level" placeholder="岗位级别" clearable></el-input>
        </el-form-item>
        <el-form-item label="单价（含税/元）:" prop="unitPrice">
          <el-input v-model="projectFormData.unitPrice" placeholder="单价（含税/元）" clearable ref="unitPrice" @input="handleInput1"></el-input>
        </el-form-item>
        <el-form-item label="单价（不含税/元）:" prop="unitPrice">
          <el-input v-model="projectFormData.taxUnitPrice" placeholder="单价（不含税/元）" clearable ref="taxUnitPrice" @input="handleInput2"></el-input>
        </el-form-item>
        <el-form-item label="类型（按n天计）:" prop="type">
          <el-input v-model="projectFormData.type" placeholder="类型（按n天计）" clearable ref="type" @input="handleInput"></el-input>
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
        name: [{required: true, message: '请输入岗位名称', trigger: ['blur', 'change']}],
        level: [{required: true, message: '请输入级别', trigger: 'change'}],
        unitPrice: [{required: true, message: '请输入单价（含税/元）', trigger: 'change'}],
        taxUnitPrice: [{required: true, message: '请输入单价（不含税/元）', trigger: 'change'}],
        type: [{required: true, message: '请输入类型（按n天计）', trigger: 'change'}]
      },
      projectFormData: {
        // 岗位
        name: '',
        // 级别
        level: '',
        // 单价（含税/元）
        unitPrice: '',
        // 单价（不含税/元）
        taxUnitPrice: '',
        // 类型（按n天计）
        type: '',
        projectId: ''
      }
    }
  },
  computed: {},
  mounted() {},
  methods: {
    init(initData){
      this.projectFormData.projectId = initData.id
    },
    handleInput(value) {
      // 使用正则表达式来匹配数字
      const regex = /^\d+$/
      if (!regex.test(value)) {
        this.$refs.type.blur()
        this.$nextTick(() => {
          // 更新输入框的值，可能需要手动截取最后一个有效的数字部分
          this.projectFormData.type = value.substring(0, value.length - 1)
          // 或者，你可以考虑使用其他逻辑来确保输入框的值为数字
        })
      }
    },
    handleInput1(value) {
      // 使用正则表达式来匹配数字
      const regex = /^\d*(\.\d{0,2})?$/ // 示例：允许最多两位小数的数字
      if (!regex.test(value)) {
        this.$refs.unitPrice.blur()
        this.$nextTick(() => {
          // 更新输入框的值，可能需要手动截取最后一个有效的数字部分
          this.projectFormData.unitPrice = value.substring(0, value.length - 1)
          // 或者，你可以考虑使用其他逻辑来确保输入框的值为数字
        })
      }
    },
    handleInput2(value) {
      // 使用正则表达式来匹配数字
      const regex = /^\d*(\.\d{0,2})?$/ // 示例：允许最多两位小数的数字
      if (!regex.test(value)) {
        this.$refs.taxUnitPrice.blur()
        this.$nextTick(() => {
          // 更新输入框的值，可能需要手动截取最后一个有效的数字部分
          this.projectFormData.taxUnitPrice = value.substring(0, value.length - 1)
          // 或者，你可以考虑使用其他逻辑来确保输入框的值为数字
        })
      }
    },
    confirm() {
      this.$refs.projectFormData.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http({
          url: this.$http.adornUrl('/externalProject/insertProjectUnitPrice'),
          method: 'post',
          data: this.$http.adornData(this.projectFormData)
        }).then(({data}) => {
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
