<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :rules="rules" :model="formData">
          <el-form-item label="姓名:" prop="userName">
            <el-select v-model="formData.userName" clearable>
              <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="成本项目:" prop="costItem">
            <el-select v-model="formData.costItem" placeholder="请选择" clearable>
              <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form-item label="实际投入:" prop="actualInvestment">
          <el-input v-model="formData.actualInvestment" placeholder="请输入" clearable />
          %
        </el-form-item>
        <div class="btn-group">
          <el-button plain style="margin: 0 10px" @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="confirm('formData')">确认</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {
    cancelDialog: {
      type: Function
    }
  },
  data() {
    return {
      formData: {
        //姓名
        userName: '张三',
        //成本项目
        costItem: '',
        //实际投入
        actualInvestment: ''
      },
      users: [],
      costItems: [
        {
          id: 1,
          name: '哈哈哈'
        },
        {
          id: 2,
          name: '嘻嘻嘻'
        }
      ],

      rules: {
        rejectReason: [{ required: true, message: '请填写驳回理由', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    init(initData) {
      Object.assign(this.formData, initData)
    },
    //确认
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //发起请求
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.el-dialog__body {
  padding: 25px 0 2px 0;
}
.el-date-editor.el-input {
  width: 190px;
}
.el-dialog__body {
  width: 50%;
}
.btn-group {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid lightgray;
  margin-top: 20px;
}
</style>
