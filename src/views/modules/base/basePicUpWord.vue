<template>
  <div class="base-pic-upload">
    <el-upload
      action="#"
      :on-preview="handlePictureCardPreview"
      :auto-upload="false"
      :name="name"
      :on-change="handleOnChange"
      :on-remove="handleOnRemove"
      :file-list="fileList"
      :accept="accept"
      ref="upload">
      <el-button size="small" type="primary" style="display: block;">选择文件</el-button>
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
      default: '.jpg,.png,.JPG,.PNG,.gif'
    },
    propName:{
      type: String,
      defualt: ''
    },
    hideAllBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
        this.$message.warning('图片格式不正确')
        return
      } else {
        if (this.onValid != null && !this.onValid(file, fileList)) {
          fileList.pop()
          // fileList.splice(0, fileList.length)
          return
        }
      }
      this.isChanged = true
      this.nowFileList = fileList
      this.getFileList()
    },
    handleOnRemove(file, fileList) {
      this.isChanged = true
      this.nowFileList = fileList
      this.getFileList()
    },
    hasFile() {
      return this.$refs.upload.uploadFiles.length > 0
    },
    getFileList() {
      let data = {propName:this.propName,file:this.nowFileList}
      this.$emit("getFileList",data)
      // this.$refs.upload.fileList=this.nowFileList
      // this.fileList=this.nowFileList
      return this.nowFileList
    }
  }
}
</script>
<style>
/* 取消eb-upload默认的按钮栏样式，用于按钮隐藏多余突出白块 */
/*.base-pic-upload .el-upload{*/
/*  display: block;*/
/*  text-align: center;*/
/*}*/
</style>
