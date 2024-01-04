<template>
  <div class="mdgContent">
    <el-container class="el-container__mdgContent">
      <el-form :inline="true" :rules="dataRule" :model="dataForm" ref="dataForm">
        <div>
          <el-form-item label="部门ID" prop="id" >
            <el-input v-model="dataForm.id"  clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="phone">
            <el-input v-model="dataForm.deptName"  placeholder="请输入部门名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="部门负责人" prop="managerId">
            <el-select  v-model="managerId" placeholder="请选择部门负责人" >
              <el-option      v-for="item in managerList"
                              :key="item.managerId"
                              :label="item.managerName"
                              :value="item.managerId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上级部门" prop="parentId">
            <el-select  v-model="parentId" placeholder="请选择上级部门" >
              <el-option      v-for="item in deptList"
                              :key="item.id"
                              :label="item.deptName"
                              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <div style="margin-top:20px;text-align:center;">
            <el-form-item>
              <el-button type="primary" @click="addOrUpdateHandle()">提交</el-button>
              <el-button  @click="cancelDialog()">取消</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    // 邮箱验证
    var validEmail = (rule, value, callback) => {
      let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})(,([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}))*$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('邮箱格式错误'))
        }
      }
    }
    return {
      query: false,
      managerList:[],
      deptList:[],
      managerId:"",
      parentId:"",
      dataForm: {
        id:'',
        deptName: '',
        managerName: '',
        managerId: '',
        parentId: ''
      },
      dataRule: {
        deptName: [
          { required: false, message: '部门名称不能为空', trigger: 'blur' }
        ],
        managerId: [
          { required: false, message: '请选择部门负责人', trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    init(list, query, managerList) {
      this.managerList = managerList
      this.query = query
      this.dataForm.id = list.id
      this.dataForm.deptName = list.deptName
      this.managerId = list.managerId
      this.parentId = list.parentId

      //初始化deptList
      this.$http({
        url: this.$http.adornUrl('/deptInfo/listAll'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.deptList = data.payload.list
        } else {
          this.$message.error(data.msg)
        }
      })


    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    // 新增
    addOrUpdateHandle() {
      let url
      if(this.query){
        url = '/deptInfo/update'
      }else{
        url = '/deptInfo/add'
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData({
          'deptName': this.dataForm.deptName,
          'managerName': this.managerName,
          'managerId': this.managerId,
          'parentId': this.parentId,
        })
      }).then(({ data }) => {
        if (data.success) {
          this.$emit('refreshDataList')
          this.$parent.hide()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 取消
    cancelDialog() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-form-item__label{
    width: 100px;
  }
</style>
