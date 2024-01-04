<template>
  <div class="base-pic-upload">
    <el-upload
      :action="url?url:'#'"
      :on-preview="handlePictureCardPreview"
      :auto-upload="url?true:false"
      :name="name"
      :on-change="handleOnChange"
      :on-remove="handleOnRemove"
      :on-success="handleOnSuccess"
      :on-error="handleOnError"
      :file-list="fileList"
      :accept="accept"
      ref="upload"
    >
      <div v-show="!hideAllBtn" class="test">
        <el-button   ref="button" slot="trigger" size="small" type="primary">选择文件</el-button>
<!--        <el-button size="small" type="danger" @click.stop="cancelFiles()">删除文件</el-button>-->
      </div>
    </el-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      isChanged: false,
      nowFileList: this.fileList
    }
  },
  props: {
    name: {
      type: String,
      defualt: 'file'
    },
    onValid: {
      type: Function
    },
    fileList: {
      type: Array,
      default: function() {
        return []
      }
    },
    accept: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    hideAllBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlePictureCardPreview(file) {
    },
    click(){
      this.$refs.button.$el.click()
    },
    cancelFiles() {
      if (this.getFileList().length > 0) {
        this.$refs.upload.clearFiles()
        this.isChanged = true
      }
    },
    handleOnChange(file, fileList) {
      let filetype = file.name.substr(file.name.lastIndexOf('.') + 1, file.name.length)
      let flag = true
      if (this.accept) {
        let types = this.accept.replaceAll('.', '').split(',')
        types.forEach((item, i) => {
          if (item === filetype) {
            flag = false
          }
        })
      } else {
        flag = false
      }
      if (flag) {
        fileList.pop()
        this.$message.warning('格式不正确')
        return
      } else {
        if (this.onValid != null && !this.onValid(file, fileList)) {
          fileList.pop()
          // fileList.splice(0, fileList.length)
          return
        }
      }
      if (fileList.length > 1) {
        fileList.shift()
      }
      this.isChanged = true
      this.nowFileList = fileList
    },
    handleOnRemove(file, fileList) {
      this.isChanged = true
      this.nowFileList = fileList
    },
    hasFile() {
      return this.$refs.upload.uploadFiles.length > 0
    },
    getFileList() {
      return this.$refs.upload.uploadFiles
    },
    handleOnSuccess(response, file, fileList){
      if(response.code === 200) {
        this.$message.success('上传成功')
      }else{
        this.$message.warning(response.msg)
      }
      this.fileList.splice(0,1)
    },
    handleOnError(error, file, fileList){

      this.$message.warning('上传失败，请联系管理员查看处理～～')
    }
  }
}
</script>
