<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-form :rules="rules" :model="dataForm" ref="dataFormRef" label-width="100px" style="width: 80%" class="form-item">
        <el-form-item label="项目集名称:" prop="psName">
          <el-input v-model="dataForm.psName" :placeholder="placeholderFlag ? '请输入项目集名称' : ''" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目集ID:" prop="psId">
          <el-input v-model="dataForm.psId" disabled></el-input>
        </el-form-item>
        <el-form-item label="启动时间:" prop="startDate">
          <el-date-picker v-model="dataForm.startDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="归属部门:" prop="deptId">
          <el-select  clearable v-model="dataForm.deptId" placeholder="请选择">
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属团队:" prop="teamId">
          <el-select  clearable v-model="dataForm.teamId" placeholder="请选择">
            <el-option v-for="item in teamList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人:" prop="managerId">
          <el-select  clearable v-model="dataForm.managerId" placeholder="请选择">
            <el-option v-for="item in managerList" :key="item.id"
                       :label='item.name+"("+item.id+")"'
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="state" v-if="operateType === 'update'">
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="0">交付中</el-radio>
            <el-radio :label="1">已交付</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endDate" v-if="operateType === 'update'">
          <el-date-picker v-model="dataForm.endDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="简介:" style="margin-top: 10px">
          <el-input
            type="textarea"
            :placeholder="placeholderFlag ? '请输入项目集简介，不超过50字' : ''"
            rows="5"
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
    return {
      rules: {
        psName: [{ required: true, message: '请输入项目集名称', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择启动时间', trigger: 'change' }],
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
    init(operateType, placeholderFlag, data) {
      this.operateType = operateType
      this.placeholderFlag = placeholderFlag
      this.managerList = data.managerList
      this.deptList = data.deptList
      this.teamList = data.teamList
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
  width: 100%; /* 你可以根据需要调整这个值 */
}
</style>
