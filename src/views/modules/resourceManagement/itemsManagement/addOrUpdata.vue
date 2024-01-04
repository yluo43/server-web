<template>
  <div class="mdgContent">
    <el-container class="el-container__mdgContent">
      <el-form :inline="true"  :model="dataForm" ref="dataForm">
        <div>
          <el-form-item label="项目（事由）名称" prop="name">
            <el-input v-model="dataForm.name"  placeholder="请输入项目（事由）名称" clearable></el-input>
          </el-form-item>

          <el-form-item label="所属部门" prop="deptId">
            <el-select  v-model="dataForm.deptId" placeholder="请选择所属部门" >
              <el-option      v-for="item in deptList"
                              :key="item.id"
                              :label="item.deptName"
                              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

<!--          <el-form-item label="所属团队" >-->
<!--            <el-select   placeholder="请选择所属团队" >-->
<!--              <option></option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->






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

    return {
      query: false,
      deptList:[],
      dataForm: {
        id:'',
        name: '',
        deptId: '',
        teamId: '',
        createTime:'',
        updateTime:'',
        createUser:'',
        updateUser:''
      }
    }
  },
  methods: {
    init(list, query, managerList) {
      this.query = query
      if(query){
        this.dataForm = {...list}
      }

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
        url = '/costItems/update'
      }else{
        url = '/costItems/add'
      }

      console.log(this.dataForm)
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(
          this.dataForm
        )
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
    width: 140px;
  }
</style>
