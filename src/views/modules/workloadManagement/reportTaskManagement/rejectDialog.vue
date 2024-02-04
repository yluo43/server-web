<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%">
      <div style="width: 100%">
        <el-form ref="formData" label-width="110px" :rules="rules" :model="formData">
          <el-form-item label="用户姓名:" prop="userName">
            {{ formData.userName }}
          </el-form-item>
          <el-form-item label="驳回工作量:" prop="rejectWorkload">
            {{ formData.rejectWorkload }}
          </el-form-item>
          <el-form-item label="驳回理由:" prop="rejectReason">
            <el-input type="textarea" v-model="formData.rejectReason" placeholder="请输入至少5个字符" minlength="5" show-word-limit></el-input>
          </el-form-item>
        </el-form>
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
        //驳回工作量
        rejectWorkload: '50%',
        //驳回理由
        rejectReason: ''
      },
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
