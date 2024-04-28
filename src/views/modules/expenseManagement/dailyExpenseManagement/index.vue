<template>
  <div style="height: 100%">
    <el-container>
      <el-header style="height: 100%">
        <el-form :inline="true" label-width="65px" label-position="left" :model="dataForm" ref="dataForm">
          <el-form-item label="用户姓名:" prop="account">
            <el-input v-model="dataForm.account" placeholder="请输入用户姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="归属团队:" prop="teamNames">
            <el-select v-model="dataForm.teamNames" placeholder="请选择归属团队" :multiple="true" :collapse-tags="true">
              <el-option v-for="team in teamNames" :key="team.id" :label="team.name" :value="team.id" multiple="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="费用名称:" prop="costNames">
            <el-select v-model="dataForm.costNames" placeholder="请选择费用名称" :multiple="true" :collapse-tags="true">
              <el-option v-for="costName in costNames" :key="costName" :label="costName" :value="costName" multiple="true"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="showFlag" style="display: contents">
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="dataForm.empId" placeholder="请输入工号" oninput="this.value = this.value.replace(/[^0-9]/g, '')" clearable></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptNames">
              <el-select v-model="dataForm.deptNames" placeholder="请选择归属部门" :multiple="true" :collapse-tags="true">
                <el-option v-for="dept in deptNames" :key="dept.id" :label="dept.deptName" :value="dept.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成本中心:" prop="costCenters">
              <el-select v-model="dataForm.costCenters" placeholder="请选择成本中心" :multiple="true" :collapse-tags="true">
                <el-option v-for="costCenter in deptNames" :key="costCenter.id" :label="costCenter.deptName" :value="costCenter.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期:" prop="createTime">
              <el-date-picker
                style="width: 200px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="costDate"
                type="daterange"
                range-separator="~"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="导入日期:" prop="createTime">
              <el-date-picker
                style="width: 200px"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="createTime"
                type="daterange"
                range-separator="~"
                start-placeholder="年/月/日"
                end-placeholder="年/月/日"
              ></el-date-picker>
            </el-form-item>
          </div>
          <el-form-item>
            <div style="display: inline-block; margin-right: 15px" @click="showFlag = !showFlag">
              <svg-icon :icon-class="showFlag ? 'arrow-up-icon' : 'arrow-down-icon'" style="height: 1.5em; width: 1.5em; position: relative; top: 3px" />
              <span v-if="showFlag" style="color: #2462f9">收起</span>
              <span v-else style="color: #2462f9">展开</span>
            </div>
            <el-button type="primary" @click="refresh()" icon="el-icon-search" style="margin-right: 10px">查询</el-button>
            <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
        </el-form>
      </el-header>

      <div class="chooseResult">
        <span v-text="chooseStr"></span>
        <el-button type="text" @click="batchDelete()" v-auth="'dailyCost:deletes'">批量删除</el-button>
      </div>
      <div class="operate-button">
        <el-button
          style="width: 110px"
          icon="
          el-icon-download"
          type="primary"
          @click="download()"
          v-auth="'dailyCost:export'"
        >
          批量下载
        </el-button>
      </div>

      <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="alter(row)" v-auth="'dailyCost:update'" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <svg-icon
                :icon-class="'delete-icon'"
                style="height: 1.5em; width: 1.5em; margin-right: 2em"
                @click="deleteList(row.item)"
                v-auth="'dailyCost:delete'"
              />
            </el-tooltip>

            <!-- <svg-icon :icon-class="'delete-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="deleteList(row)" v-auth="'dailyCost:delete'" />
            <svg-icon :icon-class="'amend'" style="height: 1.5em; width: 1.5em" @click="alter(row)" v-auth="'dailyCost:update'" /> -->
          </template>
        </template>
      </baseTable>

      <el-drawer title="编辑" :visible.sync="drawer" :direction="direction" size="23%">
        <div style="padding-left: 20px">
          <el-form :inline="true" :model="editDataForm" ref="editdataForm" class="editForm">
            <el-form-item label="姓名:" prop="account">
              <el-input v-model="editDataForm.account" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="工号:" prop="empId">
              <el-input v-model="editDataForm.empId" clearable oninput="this.value = this.value.replace(/[^0-9]/g, '')" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="归属部门:" prop="deptName">
              <el-input v-model="editDataForm.deptName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="归属团队:" prop="teamName">
              <el-input v-model="editDataForm.teamName" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="成本中心:" prop="costCenters">
              <el-select clearable v-model="editDataForm.centerId">
                <el-option
                  v-for="costCenter in costCenters"
                  :key="costCenter.id"
                  :label="costCenter.deptName"
                  :value="costCenter.id"
                  multiple="true"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="日期:" prop="empId" disabled="disabled">
              <el-input v-model="editDataForm.costDate" clearable disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="事由:" prop="reason">
              <el-input v-model="editDataForm.reason" clearable maxlength="50" show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="费用名称:" prop="backCitys">
              <el-select clearable v-model="editDataForm.costName">
                <el-option v-for="costName in costNames" :key="costName" :label="costName" :value="costName" multiple="true"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="成本项目:" prop="costItems">
              <el-select clearable v-model="editDataForm.costItems">
                <el-option v-for="item in reasonByDept" :key="item.id" :label="item.name" :value="item.id" multiple="true"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="单数张数:" prop="backCitys">
              <el-input v-model="editDataForm.documentNum" clearable disabled="disabled"></el-input>
            </el-form-item>

            <el-form-item label="金额:" prop="totalMoney">
              <el-input v-model="editDataForm.totalMoney" clearable disabled="disabled"></el-input>
            </el-form-item>

            <div style="display: flex; justify-content: flex-end; margin-top: 60px; margin-right: 20px">
              <el-button type="primary" style="margin-right: 20px" @click="editSubmit()">保存</el-button>
              <el-button @click="drawer = false">取消</el-button>
            </div>
          </el-form>
        </div>
      </el-drawer>
    </el-container>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog'
import { getCName } from '@/utils/auth'

export default {
  data() {
    return {
      showFlag: true,
      chooseStr: '已选择 0 项',
      drawer: false,
      direction: 'rtl',
      deleteIds: [],
      createTime: '' || undefined,
      costDate: '' || undefined,

      dataForm: {
        costNames: [] || undefined,
        account: '' || undefined,
        empId: '' || undefined,
        deptNames: [] || undefined,
        teamNames: [] || undefined,
        reason: '' || undefined,
        costCenters: [] || undefined,
        costDateStart: '' || undefined,
        costDateEnd: '' || undefined,
        createTimeStart: '' || undefined,
        createTimeEnd: '' || undefined,

        ids: '' || undefined
      },

      editDataForm: {
        id: '',
        account: '',
        empId: '',
        deptName: '',
        teamName: '',
        reason: '',
        costCenter: '',
        costDate: '',
        costName: '',
        createTime: '',
        totalMoney: '',
        documentNum: '',
        updateUser: '',
        costItems: '',
        centerId: ''
      },
      costCenters: [],
      costNames: [],
      deptNames: [],
      teamNames: [],
      // reason:[],
      reasonByDept: [],
      tableData: {
        theads: [
          { label: '用户姓名', prop: 'account', width: '70px;' },
          { label: '工号', prop: 'empId', width: '70px' },
          { label: '归属部门', prop: 'deptName', width: '100px' },
          { label: '归属团队', prop: 'teamName', width: '100px' },
          { label: '成本中心', prop: 'costCenter', width: '100px' },
          { label: '日期', prop: 'costDate', width: '90px' },
          { label: '事由', prop: 'reason' },
          { label: '费用名称', prop: 'costName' },
          { label: '单据张数', prop: 'documentNum', width: '70px' },
          { label: '报销金额（元）', prop: 'totalMoney' },
          { label: '成本项目', prop: 'costItemsName', width: '210px' },
          { label: '导入时间', prop: 'createTime', width: '140px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        url: '/dailyCost/dailyCostListPage'
      }
    }
  },
  components: {
    baseTable,
    baseDialog
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    //初始化成本中心
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllDept'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.costCenters = data.payload.filter((item) => item.id != 0)
        this.deptNames = data.payload.filter((item) => item.id != 0)
      } else {
        this.$message.error(data.msg)
      }
    })

    //初始化团队
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllTeam'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.teamNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
    // //初始化事由
    // this.$http({
    //   url: this.$http.adornUrl('/report/amount/getAllReasonFromStatic'),
    //   method: 'get'
    // }).then(({data}) => {
    //   if (data && data.code === 200) {
    //     this.reason = data.payload
    //   } else {
    //     this.$message.error(data.msg)
    //   }
    // })
    //初始化报销费用名称
    this.$http({
      url: this.$http.adornUrl('/report/amount/getAllCostName'),
      method: 'get'
    }).then(({ data }) => {
      if (data && data.code === 200) {
        this.costNames = data.payload
      } else {
        this.$message.error(data.msg)
      }
    })
  },
  methods: {
    alter(row) {
      let data = row.item

      //刷新事由
      this.$http({
        url: this.$http.adornUrl('/report/amount/getAllReasonFromStaticByDept?deptId=' + data.deptId),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.reasonByDept = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })

      this.drawer = true
      this.editDataForm = { ...data }
    },
    editSubmit() {
      let user = getCName()
      this.editDataForm.updateUser = user

      this.$http({
        url: this.$http.adornUrl('/dailyCost/update'),
        method: 'put',
        data: this.$http.adornData(this.editDataForm)
      }).then(({ data }) => {
        if (data.success) {
          this.refresh()
          this.$message({
            message: '编辑成功！',
            type: 'success'
          })
          this.drawer = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    refresh() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        }

        if (this.createTime != null && this.createTime != '') {
          this.dataForm.createTimeStart = this.createTime[0] + ' 00:00:00'
          this.dataForm.createTimeEnd = this.createTime[1] + ' 23:59:59'
        }

        if (this.costDate != null && this.costDate != '') {
          this.dataForm.costDateStart = this.costDate[0]
          this.dataForm.costDateEnd = this.costDate[1]
        }

        let form = { ...this.dataForm }

        if (form.costNames.length > 0) {
          form.costNames = form.costNames + ''
        }

        if (form.deptNames.length > 0) {
          form.deptNames = form.deptNames + ''
        }
        if (form.costCenters.length > 0) {
          form.costCenters = form.costCenters + ''
        }
        if (form.teamNames.length > 0) {
          form.teamNames = form.teamNames + ''
        }
        this.$refs.table.refresh(form)
      })
    },

    batchDelete() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }

      this.$confirm('已选中' + this.deleteIds.length + '条报销数据,您确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/dailyCost/deleteTripCost'),
            method: 'post',
            data: this.deleteIds
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    download() {
      if (this.deleteIds.length <= 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      let form = { ...this.dataForm }

      form.ids = this.deleteIds
      this.$http.downloadPost(this.$http.adornUrl('/dailyCost/export'), this.$http.adornParams(form), this)
    },
    onSelect(selection) {
      this.deleteIds = []
      let totalMoney = 0
      if (selection.length > 0) {
        selection.forEach((a) => {
          this.deleteIds.push(a.id)
          totalMoney += parseFloat(a.totalMoney)
        })
        this.chooseStr = '已选中' + this.deleteIds.length + '项，合计：' + totalMoney.toFixed(2) + '元'
      } else {
        this.chooseStr = '已选中 0 项'
      }
    },
    deleteList(row) {
      this.deleteIds = []
      this.deleteIds.push(row.id)
      const message = `【确定删除[${row.deptName}-${row.account}]${row.costDate}的日常费用(${row.reason}:${row.costName}:${row.totalMoney})记录吗？删除后将无法恢复!】`
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/dailyCost/deleteTripCost'),
            method: 'post',
            data: this.deleteIds
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetForm() {
      this.clear(this.dataForm)
      this.costDate = ''
      this.createTime = ''
    },
    clear(form) {
      Object.keys(form).forEach((key) => (form[key] = ''))
    }
  }
}
</script>
<style scoped>
.el-header {
  color: #333;
  padding: 0 0;
}
.el-input {
  width: 200px;
}
/* .el-form--inline > .inputlist {
  padding-top: 20px;
  padding-left: 20px;
  display: flex;
} */

::v-deep .editForm .el-form-item__label {
  width: 80px !important;
}
::v-deep .editForm .el-form-item {
  width: 100% !important;
}
/* .el-input {
  width: 190px;
} */

.el-button-func {
  width: 86px;
  height: 30px;
  text-align: center;
}
::v-deep .el-table__cell {
  text-align: center;
}

/* .chooseResult {
  width: 98%;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
  margin-top: 15px;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
  padding-left: 20px;
} */
</style>
