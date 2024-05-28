<template>
  <div style="height: 100%">
    <el-container>
      <el-header>
        <el-form :inline="true" :model="dataForm" ref="dataForm">
          <div class="inputlist">
            <el-form-item label="用户账号:" prop="account">
              <el-input v-model="dataForm.account" placeholder="请输入用户账号" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户手机号:" prop="phone">
              <el-input v-model="dataForm.phone" placeholder="请输入用户手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色类型:" prop="roleId">
              <el-select v-model="dataForm.roleId" clearable placeholder="请选择角色类型">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
              </el-select>
            </el-form-item>
            <div style="display: contents">
              <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 20px">查询</el-button>
              <el-button type="primary" @click="resetForm()" icon="el-icon-search">重置</el-button>
            </div>
          </div>
        </el-form>
      </el-header>
      <div style="padding: 20px 0 10px 2px">
        <el-button class="el-button-func" type="danger" @click="deleteList()">批量删除</el-button>
        <el-button class="el-button-func" type="primary" @click="addOrAlter()">添加用户</el-button>
        <!--        <el-button class="el-button-func" type="warning" @click="exportExcel()">导出Excel</el-button>-->
      </div>
      <baseTable :tableData="tableData" ref="table" :multiSelect="true">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <svg-icon
              :icon-class="row.item.status == '0' ? 'switch-close' : 'switch-open'"
              style="height: 1.5em; width: 1.5em; margin-right: 2em"
              @click="swith(row)"
            />
            <svg-icon :icon-class="'delete'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteList(row)" />
            <svg-icon :icon-class="'amend'" style="height: 1.5em; width: 1.5em" @click="alter(row)" />
          </template>
        </template>
        <template v-slot:status="row">
          <template v-if="row.item.status == 0">
            <el-tag type="success">正常</el-tag>
          </template>
          <template v-if="row.item.status == 1">
            <el-tag type="primary">冻结</el-tag>
          </template>
        </template>
      </baseTable>
    </el-container>
    <baseDialog :title="titles" ref="addOrUpdateDialog" :width="'450px'" :height="'600px'">
      <template>
        <addOrUpdate @refreshDataList="refresh" ref="addOrUpdate"></addOrUpdate>
      </template>
    </baseDialog>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog.vue'
import addOrUpdate from './addOrUpdata.vue'

export default {
  data() {
    return {
      passwordType: true,
      titles: '',
      dataForm: {
        account: '',
        phone: '',
        mail: '',
        createTime: '',
        status: ''
      },
      roleList: [],
      tableData: {
        theads: [
          { label: '用户账号', prop: 'account' },
          { label: '手机号', prop: 'phone' },
          { label: '邮箱', prop: 'mail' },
          { label: '开通时间', prop: 'createTime' },
          { label: '角色类型', prop: 'roleName' },
          { label: '用户状态', prop: 'status', slotName: 'status' },
          { label: '操作', prop: 'clientType', slotName: 'clientType' }
        ],
        url: '/userInfo/list'
      }
    }
  },
  components: {
    baseTable,
    baseDialog,
    addOrUpdate
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    //初始化roleList

    this.$http({
      url: this.$http.adornUrl('/userRole/list'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.roleList = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.table.refresh(this.dataForm)
      })
    },
    swith(row) {
      if (row.item.status === 0) {
        row.item.status = 1
        this.passwordType = false
      } else if (row.item.status === 1) {
        row.item.status = 0
        this.passwordType = true
      }
      var data = {
        status: row.item.status,
        userId: row.item.userId
      }
      this.$http({
        url: this.$http.adornUrl('/userInfo/status'),
        method: 'post',
        data: data
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          // this.$parent.hide()
          this.$emit('refreshDataList')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    addOrAlter() {
      this.titles = '添加用户'
      this.$refs.addOrUpdateDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init('add', false)
      })
    },
    alter(row) {
      this.titles = '修改用户'
      this.$refs.addOrUpdateDialog.show()
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row.item, true)
      })
    },
    deleteList(row) {
      let userIds = []
      let userName = ''
      if (!row) {
        let list = this.$refs.table.getSelectRow()
        userIds = list.map((item) => {
          return item.userId
        })
        userName = list
          .map((item) => {
            return item.account
          })
          .join(',')
      } else {
        userIds.push(row.item.userId)
        userName = row.item.account
      }
      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/userInfo/del'),
            method: 'post',
            data: userIds
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(data.msg)
            }
          })
          this.refresh()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    exportExcel() {
      this.$http.download(this.$http.adornUrl('/userInfo/list/excel'), this.$http.adornParams(this.dataForm), this)
    }
  }
}
</script>
<style scoped>
.el-header {
  color: #333;
  padding: 0 0;
}

.el-form--inline > .inputlist {
  padding-top: 20px;
  padding-left: 20px;
  display: flex;
}

.el-form--inline > .inputlist > .el-form-item {
  width: 26%;
  margin-bottom: 20px;
}

.el-form-item__content {
  width: 200px;
}

.el-button {
  width: 80px;
  height: 35px;
}

.el-button-func {
  width: 86px;
  height: 30px;
  text-align: center;
}
::v-deep .el-table__cell {
  text-align: center;
}
</style>
