<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-form :rules="rules" :model="dataForm" ref="dataFormRef" label-width="100px" style="width: 80%" class="form-item">
        <el-form-item label="项目集名称:" prop="psName">
          <el-input v-model="dataForm.psName" :maxlength="50" show-word-limit :placeholder="placeholderFlag ? '请输入项目集名称' : ''" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目集ID:" prop="psId">
          <el-input v-model="dataForm.psId" disabled></el-input>
        </el-form-item>
        <el-form-item label="启动时间:" prop="startDate">
          <el-date-picker v-model="dataForm.startDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="归属部门:" prop="deptId">
          <el-select v-model="dataForm.deptId" placeholder="请选择" @change="changeManagerList">
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.name == '新讯数字科技有限公司'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属团队:" prop="teamId">
          <el-select v-model="dataForm.teamId" placeholder="请选择">
            <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人:" prop="managerId">
          <el-select v-model="dataForm.managerId" placeholder="请选择">
            <el-option v-for="item in managerList" :key="item.id" :label="item.name + '(' + item.id + ')'" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="state" v-if="operateType === 'update'">
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="0">交付中</el-radio>
            <el-radio :label="1">已交付</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="结束时间:"
          prop="endDate"
          v-if="operateType === 'update'"
          :rules="
            dataForm.state == 0
              ? [{ type: 'string', validator: validateEndDate, trigger: 'change' }]
              : [{ type: 'string', required: true, validator: validateEndDate, trigger: 'change' }]
          "
        >
          <el-date-picker v-model="dataForm.endDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="简介:" style="margin-top: 10px">
          <el-input
            type="textarea"
            :placeholder="placeholderFlag ? '请输入项目集简介，不超过50字' : ''"
            rows="3"
            v-model="dataForm.remarks"
            maxlength="50"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-row style="display: flex; justify-content: right; margin-top: 20px">
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
    const validateStartDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择启动时间'))
        return
      }
      // if (this.dataForm.startDate && new Date(Date.parse(this.format())) < new Date(Date.parse(this.dataForm.startDate))) {
      //   callback(new Error('启动时间应小于等于当前时间'))
      //   return
      // }
      callback()
    }

    return {
      rules: {
        psName: [{ required: true, message: '请输入项目集名称', trigger: 'blur' }],
        startDate: [{ type: 'string', required: true, validator: validateStartDate, trigger: 'change' }],
        //  endDate: [{ type: 'string', validator: validateEndDate, trigger: 'change' }],
        deptId: [{ required: true, message: '请选择归属部门', trigger: 'change' }],
        teamId: [{ required: true, message: '请选择归属团队', trigger: 'change' }],
        managerId: [{ required: true, message: '请选择负责人', trigger: 'change' }]
      },
      dataForm: {
        psName: '',
        psId: '',
        startDate: '',
        deptId: '',
        teamId: '',
        managerId: '',
        state: null,
        endDate: '',
        remarks: ''
      },
      operateType: 'add',
      placeholderFlag: true,
      managerList: [],
      deptList: [],
      teamList: []
    }
  },
  methods: {
    selectTeam(deptId) {
      this.$http({
        url: this.$http.adornUrl('/common/getTeamByDept?deptId=' + deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.teamList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    validateEndDate(rule, value, callback) {
      if (!value && this.dataForm.state != 0) {
        callback(new Error('请选择结束时间'))
        return
      }
      if (value) {
        if (this.dataForm.startDate && this.dataForm.endDate && new Date(Date.parse(this.dataForm.endDate)) < new Date(Date.parse(this.dataForm.startDate))) {
          callback(new Error('结束时间应大于启动时间'))
          return
        }
        if ((this.dataForm.state == 1 || this.dataForm.state == 2) && new Date(Date.parse(this.format())) < new Date(Date.parse(this.dataForm.endDate))) {
          callback(new Error('结束时间应小于等于当前时间'))
          return
        }
      }
      callback()
    },
    format() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      month = (month < 10 ? '0' : '') + month
      var datee = date.getDate()
      datee = (datee < 10 ? '0' : '') + datee
      return year + '-' + month + '-' + datee
    },
    changeManagerList() {
      if (this.dataForm.deptId == '' || this.dataForm.deptId == null) {
        return false
      }
      this.dataForm.teamId = ''
      this.dataForm.managerId = ''
      let deptId = this.dataForm.deptId
      this.selectTeam(deptId)
      this.$http({
        url: this.$http.adornUrl('/common/getManagerByDept?roleId=4&deptId=' + deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.managerList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    init(operateType, placeholderFlag, data) {
      this.operateType = operateType
      this.placeholderFlag = placeholderFlag
      //this.managerList = data.managerList
      this.deptList = data.deptList
      // this.teamList = data.teamList
      if (data.dataRow) {
        Object.assign(this.dataForm, data.dataRow)
      }
      // 获取项目集ID
      if (operateType === 'add') {
        this.$http({
          url: this.$http.adornUrl('/projectSet/getPsId'),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.dataForm.psId = data.payload
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        if (this.dataForm.deptId == '' || this.dataForm.deptId == null) {
          return false
        }
        let deptId = this.dataForm.deptId
        this.selectTeam(deptId)
        this.$http({
          url: this.$http.adornUrl('/common/getManagerByDept?roleId=4&deptId=' + deptId),
          method: 'get'
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.managerList = data.payload
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    addCheck() {
      this.$refs.dataFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        this.addOrUpdateHandle()
      })
    },
    // 新增
    addOrUpdateHandle() {
      let url = '/projectSet/add'
      let method = 'post'
      if (this.operateType === 'update') {
        url = '/projectSet/update'
        method = 'put'
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: method,
        data: this.$http.adornData(this.dataForm)
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
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
.form-item .el-select,
.form-item .el-input {
  width: 100% !important; /* 你可以根据需要调整这个值 */
}
</style>
