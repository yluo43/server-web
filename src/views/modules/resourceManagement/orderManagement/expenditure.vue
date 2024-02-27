<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-descriptions>
        <template v-slot:title>
          <span class="title">● {{ order.name }}</span>
        </template>
        <el-descriptions-item label="项目编码">{{ order.projectId }}</el-descriptions-item>
        <el-descriptions-item label="项目经理">{{ order.mannagerName }}</el-descriptions-item>
        <el-descriptions-item label="立项时间">{{ order.approvalDate }}</el-descriptions-item>
        <el-descriptions-item label="合同类型">{{ order.contractTypeName }}</el-descriptions-item>
        <el-descriptions-item label="支付合计">{{ order.expenditureAmount }}元</el-descriptions-item>
        <el-descriptions-item label="计划交付时间">{{ order.deliveryDate }}</el-descriptions-item>
        <el-descriptions-item label="项目状态">
          <div style="width: 80%">
            <!--            0交付中 1已交付 2关闭 3已回款-->
            <el-steps :active="order.state">
              <el-step title="交付中"></el-step>
              <el-step title="已交付"></el-step>
              <el-step title="关闭"></el-step>
              <el-step title="已回款"></el-step>
            </el-steps>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <div>
        <span style="font-weight: bold; font-size: medium">支出统计</span>
        <div class="chooseResult">
          <i class="el-icon-info" style="color: #108ee9"></i>
          <span class="chooseResultStr" v-html="chooseStr"></span>
        </div>
        <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect" :hidePage="true">
          <template v-slot:costName="scope">
            <el-input v-model="scope.item.row.costName" :disabled="scope.item.row.clientTypeShow" placeholder="请输入"></el-input>
          </template>
          <template v-slot:expenditureAmount="scope">
            <el-input v-model="scope.item.row.expenditureAmount" :disabled="scope.item.row.clientTypeShow" placeholder="请输入"></el-input>
          </template>
          <template v-slot:plannedPaymentDate="scope">
            <el-date-picker
              v-model="scope.item.row.plannedPaymentDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              :disabled="scope.item.row.clientTypeShow"
            ></el-date-picker>
          </template>
          <template v-slot:managerName="scope">
            <el-select v-model="scope.item.row.managerName" placeholder="请选择" :disabled="scope.item.row.clientTypeShow" @change="stateChange(scope)">
              <el-option v-for="item in memberList" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </template>
          <template v-slot:actualPaymentDate="scope">
            <el-date-picker
              v-model="scope.item.row.actualPaymentDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              :disabled="scope.item.row.clientTypeShow"
            ></el-date-picker>
          </template>
          <template v-slot:state="scope">
            <el-select v-model="scope.item.row.state" placeholder="请选择" :disabled="scope.item.row.clientTypeShow" @change="stateChange(scope)">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
          <template v-slot:clientType="scope">
            <!--类型插槽-->
            <template v-if="scope.item.row.clientTypeShow">
              <el-link type="primary" @click="editSettlement(scope)" :disabled="viewDisabled">编辑 |</el-link>
              <el-link type="primary" @click="deleteSettlement(scope)" :disabled="viewDisabled">删除</el-link>
            </template>
            <template v-else>
              <el-link type="primary" @click="updateSettlement(scope)" :disabled="viewDisabled">保存 |</el-link>
              <el-link type="primary" @click="cancelSettlement(scope)" :disabled="viewDisabled">取消</el-link>
            </template>
          </template>
        </baseTable>
        <div class="center-button-container">
          <el-button
            class="el-button-func"
            style="width: 500px; background-color: #f5fbff; border: solid 1px #008aff"
            @click="addSettlement()"
            icon="el-icon-circle-plus-outline"
            :disabled="viewDisabled"
          >
            添加
          </el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import baseTable from '@/views/modules/base/baseTableScope.vue'

export default {
  components: { baseTable, baseDialog },
  data() {
    return {
      chooseStr: '已选择 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已付款 0.00',
      title: '',
      order: {
        name: '',
        projectId: '',
        mannagerName: '',
        approvalDate: null,
        contractTypeName: '',
        settlementCycle: ''
      },
      tableData: {
        theads: [
          { label: '费用名称', prop: 'costName', slotName: 'costName', width: '112px' },
          { label: '支出金额', prop: 'expenditureAmount', slotName: 'expenditureAmount', width: '50px' },
          { label: '计划付款时间', prop: 'plannedPaymentDate', slotName: 'plannedPaymentDate', width: '112px' },
          { label: '实际付款时间', prop: 'actualPaymentDate', slotName: 'actualPaymentDate', width: '112px' },
          { label: '责任人', prop: 'managerName', slotName: 'managerName', width: '112px' },
          { label: '状态', prop: 'state', slotName: 'state', width: '80px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '80px' }
        ],
        height: '150px',
        minHeight: '300px',
        maxHeight: '400px'
      },
      orderList: [],
      memberList: [],
      options: [
        {
          value: 0,
          label: '待付款'
        },
        {
          value: 1,
          label: '已付款'
        }
      ],
      viewDisabled: false
    }
  },
  methods: {
    init(data) {
      if (data) {
        Object.assign(this.order, data)
        this.order.expenditureAmount = data.expenditureAmount === null ? 0 : data.expenditureAmount
      }
      if (this.order.state === 2 || this.order.state === 3) {
        this.viewDisabled = true
      }
      this.refresh()
      this.getMemberByProjectId(data.id)
    },
    getMemberByProjectId(id) {
      this.$http({
        url: this.$http.adornUrl('/common/getMemberByProjectId'),
        params: { id: id },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.memberList = data.payload
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    refresh() {
      this.$http({
        url: this.$http.adornUrl('/costItems/expenditure/list'),
        params: { projectId: this.order.id },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.orderList = data.payload
          if (this.orderList) {
            this.$nextTick(() => {
              this.orderList.forEach((item) => {
                item.clientTypeShow = true
              })
              this.$refs.table.options.dataList = this.orderList
            })
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    onSelect(selection) {
      if (selection.length > 0) {
        let total = 0
        let expenditureAmount = 0
        selection.forEach((a) => {
          if (a.expenditureAmount) {
            total += parseFloat(a.expenditureAmount)
            if (a.state === 1) {
              expenditureAmount += parseFloat(a.expenditureAmount)
            }
          }
        })
        this.chooseStr = '已选中' + selection.length + '项&nbsp;&nbsp;&nbsp;&nbsp;合计：' + total.toFixed(2) + '，已付款：' + expenditureAmount.toFixed(2)
      } else {
        this.chooseStr = '已选择 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已付款：0.00'
      }
    },
    addSettlement() {
      this.$refs.table.options.dataList.push({
        costName: '',
        expenditureAmount: null,
        plannedPaymentDate: null,
        actualPaymentDate: null,
        managerName: '',
        state: 0,
        clientTypeShow: true
      })
    },
    stateChange(scope) {},
    editSettlement(scope) {
      scope.item.row.clientTypeShow = false
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table.__rowClick(scope.item.row)
      })
    },
    deleteSettlement(scope, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (scope.item.row.id) {
            this.$http({
              url: this.$http.adornUrl('/costItems/expenditure/delete'),
              method: 'delete',
              params: { id: scope.item.row.id }
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
          } else {
            this.$refs.table.options.dataList.splice(scope.item.$index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    updateSettlement(scope) {
      let obj = scope.item.row
      obj.projectId = this.order.id
      if (obj.state === 1) {
        if (!obj.actualPaymentDate) {
          this.$message.warning('请选择实际付款时间！')
          return
        }
      }
      if (obj.managerName) {
        const member = this.memberList.find((item) => item.managerName === obj.managerName)
        obj.managerId = member.id
      } else {
        this.$message.warning('请选择负责人！')
        return
      }
      this.$http({
        url: this.$http.adornUrl('/costItems/expenditure/update'),
        method: 'put',
        data: obj
      }).then(({ data }) => {
        if (data.success) {
          this.$emit('refreshDataList')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.cancelSettlement(scope)
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    cancelSettlement(scope) {
      scope.item.row.clientTypeShow = true
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table.__rowClick(scope.item.row)
      })
      this.refresh()
    },
    // 取消
    cancel() {
      this.$parent.hide()
    }
  }
}
</script>

<style scoped>
.title {
  color: #008aff; /* 设置标题字体颜色为红色 */
  font-size: 20px;
}

::v-deep .el-descriptions-item__label {
  color: #008aff; /* 设置描述项label字体颜色为绿色 */
}

.el-link {
  margin-right: 10px;
}

.chooseResult {
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e9f3ff;
  border-radius: 6px;
}

.center-button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.el-select {
  width: 100px !important;
}
</style>
