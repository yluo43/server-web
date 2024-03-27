<!-- 自动发书管理-新增图书-新增 -->
<template>
  <div class="mdgContent">
    <el-container class="el-container__mdgContent">
      <el-form :inline="true" :rules="dataRule" :model="dataForm" ref="dataForm">
        <div>
          <el-form-item label="用户账号" prop="account">
            <el-input v-model="dataForm.account"  clearable :disabled="query"></el-input>
          </el-form-item>
          <el-form-item label="用户手机号" prop="phone">
            <el-input v-model="dataForm.phone" maxlength="11" placeholder="请输入手机号" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="mail">
            <el-input v-model="dataForm.mail" placeholder="请输入邮箱" clearable></el-input>
          </el-form-item>
<!--          <el-form-item label="密码" prop="password">-->
<!--            <el-input v-model="dataForm.password" placeholder="请输入密码" clearable></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="角色类型" prop="roleIds">
            <el-select :multiple="true" v-model="roleIds" placeholder="请选择角色类型" >
              <el-option      v-for="item in roleList"
                              :key="item.roleId"
                              :label="item.roleName"
                              :value="item.roleId">
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
      imageSizeList: '',
      roleIds: [],
      roleList:[],
      dataForm: {
        account: '',
        phone: '',
        mail: '',
        roleId: '',
        password: '',
        userId: ''
      },
      dataRule: {
        phone: [
          { required: false, message: '手机不能为空', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '密码不能为空', trigger: 'blur' }
        ],
        mail: [
          { required: false, message: '用户账号不能为空', trigger: 'blur' },
          { validator: validEmail, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init(list, query, name) {
      this.$http({
        url: this.$http.adornUrl('/userRole/list'),
        method: 'get'
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.roleList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
      this.query = query
      this.dataForm.account = list.account
      this.dataForm.phone = list.phone
      this.dataForm.mail = list.mail
      this.dataForm.password = list.password
      if (list.roleId) {
        let array = list.roleId.split(',')
        for(let i in array)
          this.roleIds.push(array[i])
      }
      this.dataForm.roleId = list.roleName
      this.dataForm.userId = list.userId
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    // 新增
    addOrUpdateHandle() {
      this.$http({
        url: this.$http.adornUrl('/userInfo/add'),
        method: 'post',
        data: this.$http.adornData({
          'account': this.dataForm.account,
          'phone': this.dataForm.phone,
          'mail': this.dataForm.mail,
          'password': this.dataForm.password,
          'roleId': this.roleIds,
          'userId': this.dataForm.userId
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
