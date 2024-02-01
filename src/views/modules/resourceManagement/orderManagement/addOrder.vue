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
        <el-form-item label="订单名称:" prop="orderName">
          <el-input
            v-model="dataForm.orderName" placeholder="请输入订单名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="开始日期:" prop="startDate">
          <el-date-picker
            v-model="dataForm.startDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期:" prop="endDate">
          <el-date-picker
            v-model="dataForm.endDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单金额:" prop="orderAmount">
          <el-input
            v-model="dataForm.orderAmount" placeholder="请输入订单金额"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单人数:" prop="orderMember">
          <el-input
            v-model="dataForm.orderMember" placeholder="请输入订单人数"
          ></el-input>
        </el-form-item>
        <el-form-item label="订单描述:" style="margin-top: 10px">
          <el-input
            type="textarea"
            placeholder="请输入订单描述，不超过50字"
            rows="5"
            v-model="dataForm.remarks"
            maxlength="50"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="上传订单:" style="margin-top: 10px" prop="orderFile">
          <el-upload
            class="upload-demo"
            action="#"
            :before-remove="beforeRemove"
            :on-change="handleFileChange"
            :limit="1"
            :accept="'.pdf,.PDF'"
            :auto-upload="false"
            :file-list="fileList">
            <el-button icon="el-icon-upload2" style="width: 100px;">上传文件</el-button>
            <div slot="tip" class="el-upload__tip">支持扩展名：.pdf</div>
          </el-upload>
        </el-form-item>
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
        orderName: [{required: true, message: '请输入订单名称', trigger: 'blur'}],
        startDate: [{required: true, message: '请选择开始日期', trigger: 'change'}],
        endDate: [{required: true, message: '请选择结束日期', trigger: 'change'}],
        orderAmount: [{required: true, message: '请输入订单金额', trigger: 'blur'}],
        orderFile: [{required: true, message: '请上传订单', trigger: 'change'}],
      },
      fileList: [],
      dataForm: {
        projectId: null,
        orderName: '',
        startDate: '',
        endDate: '',
        orderAmount: null,
        orderMember: null,
        remarks: '',
        orderFile: '',
        orderFilePath: '',
      },
      operateType: 'add'
    }
  },
  methods: {
    init(operateType, data) {
      this.operateType = operateType
      if (operateType === 'add') {
        this.dataForm.projectId = data
      } else {
        if (data) {
          Object.assign(this.dataForm, data)
          this.fileList = [{name: data.orderFilePath.match(/\/([^/]+)$/)[1]}]
          this.dataForm.orderFile = data.orderFilePath
          this.dataForm.orderFilePath = data.orderFilePath
        }
      }
    },
    handleFileChange(file) {
      this.dataForm.orderFile = file.raw // 仅保留最新选择的文件
    },
    beforeRemove(file, fileList) {
      this.dataForm.orderFile = ''
      return this.$confirm(`确定移除 ${file.name}？`);
    },
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
      console.log(this.operateType)
      let url = '/costItems/order/add'
      let method = 'post'
      if (this.operateType === 'update') {
        url = '/costItems/order/update'
        method = 'put'
        if (this.dataForm.orderFilePath === this.dataForm.orderFile) {
          this.dataForm.orderFile = null
        }
      }
      let formData = new FormData()
      for (let key in this.dataForm) {
        if (this.dataForm[key]) {
          formData.set(key, this.dataForm[key])
        }
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: method,
        data: formData
      }).then(({data}) => {
        if (data.success) {
          this.$parent.hide()
          this.$emit('refreshDataList')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.dataForm.orderFile = data.orderFilePath
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
