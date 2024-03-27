<template>
  <div class="mdgContent">
    <el-container class="el-container__mdgContent">
      <el-form :inline="true"  :model="dataForm" ref="dataForm">
        <div>
          <el-form-item label="姓名" prop="name" >
            <el-input v-model="dataForm.name"  clearable placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="phone">
            <el-input v-model="dataForm.mailbox"  placeholder="请输入邮箱" clearable></el-input>
          </el-form-item>

          <el-form-item label="职位" prop="empPost">
            <el-input v-model="dataForm.empPost"  placeholder="请输入职位" clearable ></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="empId">
            <el-input v-model="dataForm.empId"  placeholder="请输入工号" clearable></el-input>
          </el-form-item>


          <el-form-item label="入职时间" prop="entryDate">
            <el-date-picker class="picker-width"
              v-model="dataForm.entryDate"
              type="date"
              format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
              placeholder="选择入职时间">
            </el-date-picker>


<!--            <el-input v-model="dataForm.entryDate"  placeholder="请输入入职时间" clearable></el-input>-->
          </el-form-item>


          <el-form-item label="离职时间" prop="dapartDate">
            <el-date-picker class="picker-width"
              v-model="dataForm.departDate"
              type="date"
              format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
              placeholder="选择离职时间">
            </el-date-picker>

<!--            <el-input v-model="dataForm.departDate"  placeholder="请输入离职时间" clearable></el-input>-->
          </el-form-item>





          <el-form-item label="工作地点" prop="empLocation">
            <el-input v-model="dataForm.empLocation"  placeholder="请输入工作地点" clearable></el-input>
          </el-form-item>


          <el-form-item label="部门" prop="deptId">
            <el-select   clearable v-model="dataForm.deptId" placeholder="请选择所属部门" >
              <el-option      v-for="item in deptList"
                              :key="item.id"
                              :label="item.deptName"
                              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="是否管理员" prop="admin">
            <el-select  clearable  v-model="dataForm.admin" placeholder="是否为管理员" >
              <el-option key="0" label="不是" value="0"></el-option>
              <el-option key="1" label="是" value="1"></el-option>
            </el-select>
          </el-form-item>



          <el-form-item label="状态" prop="state">
            <el-select   clearable v-model="dataForm.state" placeholder="请选择员工状态" >
              <el-option key="0" label="正式" value="0"></el-option>
              <el-option key="1" label="试用" value="1"></el-option>
              <el-option key="2" label="临时" value="2"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="员工类型" prop="empType">
            <el-select  clearable  v-model="dataForm.empType" placeholder="请选择员工类型" >
              <el-option key="0" label="总公司员工" value="0"></el-option>
              <el-option key="1" label="子公司员工" value="1"></el-option>
              <el-option key="2" label="专项员工" value="2"></el-option>
              <el-option key="3" label="研究生员工" value="3"></el-option>
              <el-option key="4" label="委培研究生员工" value="4"></el-option>
              <el-option key="5" label="实习生" value="5"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="级别" prop="empLevel">
            <el-select  clearable  v-model="dataForm.empLevel" placeholder="请选择员工级别" >
              <el-option key="3" label="3" value="3"></el-option>
              <el-option key="4" label="4" value="4"></el-option>
              <el-option key="5" label="5" value="5"></el-option>
              <el-option key="6-" label="6-" value="6-"></el-option>
              <el-option key="6" label="6" value="6"></el-option>
              <el-option key="6+" label="6+" value="6+"></el-option>
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
        mailbox: '',
        empPost: '',
        teamId: '',
        empId: '',
        entryDate: '',
        departDate: '',
        admin: '',
        state: '',
        empType: '',
        empLevel: '',
        empLocation: '',
        deptId:''
      }
    }
  },
  methods: {
    init(list, query, managerList) {
      this.query = query
      if(query){
        this.dataForm = {...list}
        this.dataForm.deptId = 2
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
        url = '/employee/updateEmployee'
      }else{
        url = '/employee/insertEmployee'
      }
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
    width: 100px;
  }

  .picker-width{
    width: 200px !important;
  }
</style>
