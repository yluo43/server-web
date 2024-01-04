<template>
  <div>
    <el-form
      :model="dataForm"
      :rules="rules"
      ref="dataForm"
      label-position="left"
      label-width="150px"
      size="small"
      v-if="this.k"
    >

      <el-form-item label="上传" prop="file">
        <baseUpload
          name="file"
          ref="uploadFile"
          :accept="'.xls,.xlsx'"
          :file-list="uploadFile"
          :hideAllBtn="true"
        ></baseUpload>
      </el-form-item>

      <div style="text-align: right; padding: 10px 7px">
        <el-button
          type="primary"
          @click="btnSubmit()"
          >确定</el-button
        >
        <el-button type="danger" @click="cancelBtn">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    let that = this
    return {
      rules: {
        file: [
          { trigger: 'change',
            validator: function (rule, value, callback) {
              const boolean = that.$refs.uploadFile.getFileList().length <= 0
              if (boolean) {
                // alert('请先选择文件')
                that.$message.error('请先选择文件') 
                return
              }
              callback()
            } }
        ]
      },
      uploadFile: [],
      k: true,
      message: '',
      dataForm: {
      }
    }
  },
  props: {
    parentRefresh: {
      type: Function
    }
  },
  components: {
  },

  methods: {
    init () {
    },

    btnSubmit () {
      let formData = this.global.buildFormData(this.$refs.dataForm.$el)
      console.log(formData.get('file'));
      let that = this
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http
          .post('/rankingOperation/import', formData)
          .then(function ({ data }) {
            if (data.code === 0) {
              that.$message.success(data.msg)
              that.k = false
              that.cancelBtn()
              that.parentRefresh()
            } else {
              that.$message.error(data.msg)
            }
          })
      })
    },
    cancelBtn () {
      this.$parent.hide()
    }
  }
}
</script>

