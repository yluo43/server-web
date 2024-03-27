<template>
  <div class="base-pic-upload">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <div class="labellists" style="background: #ecf5ff;">
        <el-form-item label="合同编号:" prop="paperBookName">
          <el-select class="selectlist" v-model="options" multiple placeholder="请选择" @focus="closeIt" ref="selectIt">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
              disabled>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号:" prop="paperBookName">
          <el-select class="selectlist" v-model="options" multiple placeholder="请选择" @focus="closeIt1" ref="selectIt1">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
              disabled>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号:" prop="paperBookName">
          <el-select class="selectlist" v-model="options" multiple placeholder="请选择" @focus="closeIt2" ref="selectIt2">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item"
              disabled>
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataForm: {

      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value1: []
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
    hideAllBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeIt() {
      this.$refs.selectIt.blur()
    },
    closeIt1() {
      this.$refs.selectIt1.blur()
    },
    closeIt2() {
      this.$refs.selectIt2.blur()
    },
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
    }
  }
}
</script>
<style>
/* 取消eb-upload默认的按钮栏样式，用于按钮隐藏多余突出白块 */
.base-pic-upload .el-upload{
  display: block;
  text-align: center;
  line-height: 100px;
}
.base-pic-upload .selectlist{
  width: 1000px;
  height: 200px;
}
.el-form--inline .el-form-item{
  display: block;
}
.selectlist>.el-input--suffix>.el-input__inner{
  width: 1000px;
  height: 200px;
}
.selectlist>.el-select__tags{
  width: 960px;
  height: 160px;
}
.selectlist>.el-input--suffix>.el-input__suffix{
  display: none;
}
.el-form--inline>.inputlist>.el-form-item{
  width: 100%;
}
.labellists{
  padding-left: 20px;
}
.labellists>.el-form-item>.el-form-item__label{
  font-weight: 800;
  font-size: 20px;
}
</style>
