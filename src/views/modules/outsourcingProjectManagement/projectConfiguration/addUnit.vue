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
        <el-form-item v-show="false" label="id:" prop="id">
          <el-input v-model="projectFormData.id" placeholder="id" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位名称:" prop="name">
          <el-input v-model="projectFormData.name" placeholder="岗位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位级别:" prop="level">
          <el-input v-model="projectFormData.level" placeholder="岗位级别" clearable></el-input>
        </el-form-item>
        <el-form-item label="单价（含税/元）:" prop="unitPrice">
          <el-input
              ref="unitPrice"
              v-model="projectFormData.unitPrice"
              placeholder="单价（含税/元）"
              clearable
              @input="handleInput1"
          ></el-input>
        </el-form-item>
        <el-form-item label="税率（百分比）:" prop="taxRate">
          <el-input
              ref="unitPrice"
              v-model="projectFormData.taxRate"
              placeholder="税率（百分比）"
              clearable
              @input="handleInput0"
          ></el-input>
        </el-form-item>
        <el-form-item label="单价（不含税/元）:" prop="taxUnitPrice">
          <el-input
              ref="taxUnitPrice"
              v-model="projectFormData.taxUnitPrice"
              placeholder="单价（不含税/元）"
              clearable
              @input="handleInput2"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型（按n天计）:" prop="type">
          <el-input
              ref="type"
              v-model="projectFormData.type"
              placeholder="类型（按n天计）"
              clearable
              @input="handleInput"
          ></el-input>
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
      editFlag: false,
      projectFormRules: {
        name: [{required: true, message: '请输入岗位名称', trigger: ['blur', 'change']}],
        level: [{required: true, message: '请输入级别', trigger: 'change'}],
        unitPrice: [{required: true, message: '请输入单价（含税/元）', trigger: 'change'}],
        taxRate: [{required: true, message: '请输入税率', trigger: 'change'},
          {
            validator: (rule, value, callback) => {
              let numValue = Number(value) || 0;

              // 检查是否为NaN或超过23
              if (isNaN(numValue) || numValue >= 100) {
                callback(new Error('请输入小于100的整数'))
              } else {
                // 如果需要，可以在这里处理小数点后多余的零，但在这个场景下可能不是必需的
                // numValue = parseFloat(numValue.toFixed(1));
                callback()
              }
            },
            trigger: ['blur', 'change']
          }],
        taxUnitPrice: [{required: true, message: '请输入单价（不含税/元）', trigger: 'change'}],
        type: [{required: true, message: '请输入类型（按n天计）', trigger: 'change'},
          {
            validator: (rule, value, callback) => {
              let numValue = Number(value) || 0;

              // 检查是否为NaN或超过23
              if (isNaN(numValue) || numValue > 23) {
                callback(new Error('请输入小于或等于23的整数或一位小数'))
              } else {
                // 如果需要，可以在这里处理小数点后多余的零，但在这个场景下可能不是必需的
                // numValue = parseFloat(numValue.toFixed(1));
                callback()
              }
            },
            trigger: ['blur', 'change']
          }]
      },
      projectFormData: {
        id: '',
        // 岗位
        name: '',
        taxRate: '6',
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
  mounted() {
  },
  methods: {
    init(initData, projectId) {
      if (projectId) {
        this.projectFormData.projectId = projectId
      } else {
        Object.assign(this.projectFormData, initData)
        this.editFlag = true
      }
    },
    handleInput(value) {
      const regex = /^\d*(\.\d{0,1})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,1})?/)[0] || ''
          this.projectFormData.type = validValue
        })
      }
    },
    handleInput0(value) {
      // 使用正则表达式匹配并保留数字部分
      let numericValue = value.replace(/\D/g, '');
      // 如果输入值发生了变化（即包含非数字字符），则更新绑定的数据
      if (value !== numericValue) {
        // 直接更新绑定的数据，Vue 会自动更新 DOM
        this.projectFormData.taxRate = numericValue;
      }
    },
    handleInput1(value) {
      const regex = /^\d*(\.\d{0,2})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
          this.projectFormData.unitPrice = validValue
        })
      }
    },
    handleInput2(value) {
      const regex = /^\d*(\.\d{0,2})?$/
      // 如果不匹配，处理输入
      if (!regex.test(value)) {
        this.$nextTick(() => {
          // 找到最后一个有效的数字部分并更新输入框的值
          const validValue = value.match(/^\d*(\.\d{0,2})?/)[0] || ''
          this.projectFormData.taxUnitPrice = validValue
        })
      }
    },
    confirm() {
      this.$refs.projectFormData.validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.projectFormData.taxUnitPrice >= this.projectFormData.unitPrice) {
          this.$message.error('单价（含税/元）一定要大于 单价（不含税/元）')
          return false
        }
        this.$http({
          url: this.$http.adornUrl(this.editFlag ? '/externalProject/updateProjectUnitPrice' : '/externalProject/insertProjectUnitPrice'),
          method: this.editFlag ? 'put' : 'post',
          data: this.$http.adornData(this.projectFormData)
        }).then(({data}) => {
          if (data.success) {
            this.cancel()
            this.$message.success(this.editFlag ? '修改成功' : '新增成功')
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
