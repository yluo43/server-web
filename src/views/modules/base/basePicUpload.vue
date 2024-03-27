<template>
  <div class="base-pic-upload">
    <el-upload
      action="#"
      multiple
      ref="upload"
      list-type="picture-card"
      :on-change="handleOnChange"
      :on-remove="handleOnRemove"
      :accept="accept"
      :file-list="fileList"
      :auto-upload="false">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click="handlePictureCardPreview(file)"></i>
            <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete" style="margin-left: 20px;"></i>
            </span>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      nowFileList: this.fileList
    }
  },
  props: {
    name: {
      type: String,
      defualt: 'file'
    },
    propName:{
      type: String,
      defualt: ''
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
    hideAllBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    cancelFiles() {
      if (this.getFileList().length > 0) {
        this.$refs.upload.clearFiles()
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
      this.nowFileList = fileList
      this.getFileList()
    },
    handleOnRemove(file, fileList) {
      this.nowFileList = fileList
      this.getFileList()
    },
    handleRemove(file, fileList) {
      fileList = this.nowFileList
      let index = fileList.indexOf(file);
      fileList.splice(index, 1)
    },
    hasFile() {
      return this.$refs.upload.fileList.length > 0
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
<style scoped>
/* 取消eb-upload默认的按钮栏样式，用于按钮隐藏多余突出白块 */
.base-pic-upload .el-upload{
  display: block;
  text-align: center;
  line-height: 100px;
  width: 100px;
  height: 100px;
}
.el-upload-list--picture-card .el-upload-list__item{
  width: 100px;
  height: 100px;
}
.base-pic-upload>div{
  display: inline-flex;
}
</style>
