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
        <el-descriptions-item label="结算周期">{{ order.settlementCycle }}</el-descriptions-item>
        <el-descriptions-item label="计划交付时间">{{ order.deliveryDate }}</el-descriptions-item>
        <el-descriptions-item label="项目状态">
          <div style="width: 80%">
            <el-steps :active="order.state + 1">
              <el-step title="交付中"></el-step>
              <el-step title="已交付"></el-step>
              <el-step title="已回款"></el-step>
              <el-step title="关闭"></el-step>
            </el-steps>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-button
        class="el-button-func"
        style="width: 500px; background-color: #f5fbff; margin: 30px auto; border: solid 1px #008aff"
        @click="addOrder()"
        icon="el-icon-circle-plus-outline"
      >
        添加订单
      </el-button>
      <el-collapse v-model="activeNames" @change="handleChange">
        <template v-for="(item, index) in orderList">
          <div style="display: flex; justify-content: right">
            <el-link type="primary" @click="viewOrder(item)">查看详情 |</el-link>
            <el-link type="primary" @click="updateOrder(item)">编辑 |</el-link>
            <el-link type="primary" @click="deleteOrder(item)" style="margin-right: 30px">删除</el-link>
          </div>
          <el-collapse-item :title="item.orderName" :name="index">
            <span style="font-weight: bold; font-size: medium">结算回款</span>
            <div class="chooseResult">
              <i class="el-icon-info" style="color: #108ee9"></i>
              <span class="chooseResultStr" v-html="chooseStr"></span>
            </div>
            <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect(index)" :hidePage="true">
              <template v-slot:settlementDate="row">
                <el-date-picker
                  v-model="row.item.settlementDate"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  style="width: 100%"
                  placeholder="选择日期"
                ></el-date-picker>
              </template>
              <template v-slot:clientType="row">
                <!--类型插槽-->
                <template v-if="clientTypeShow">
                  <el-link type="primary" @click="editSettlement(row, index)">编辑 |</el-link>
                  <el-link type="primary" @click="deleteSettlement(index)">删除</el-link>
                </template>
                <template v-else>
                  <el-link type="primary" @click="updteSettlement(index)">保存 |</el-link>
                  <el-link type="primary" @click="cancelSettlement(index)">取消</el-link>
                </template>
              </template>
            </baseTable>
          </el-collapse-item>
          <div class="center-button-container">
            <el-button
              class="el-button-func"
              style="width: 500px; background-color: #f5fbff; border: solid 1px #008aff"
              @click="addSettlement(index)"
              icon="el-icon-circle-plus-outline"
            >
              添加结算回款
            </el-button>
          </div>
        </template>
      </el-collapse>
    </el-container>
    <base-dialog :title="title" ref="addOrUpdateDrawer" :width="'40%'">
      <template>
        <add-order @refreshDataList="refresh" ref="addOrderRef"></add-order>
      </template>
    </base-dialog>
    <base-dialog :title="title" ref="viewOrderDialog" :width="'40%'">
      <template>
        <view-order @refreshDataList="refresh" ref="viewOrderRef"></view-order>
      </template>
    </base-dialog>
  </div>
</template>
<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addOrder from './addOrder.vue'
import viewOrder from './viewOrder.vue'
import baseTable from '@/views/modules/base/baseTable.vue'

export default {
  components: { baseTable, addOrder, baseDialog, viewOrder },
  data() {
    return {
      clientTypeShow: true,
      chooseStr: '已选择 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已回款 0.00',
      title: '',
      order: {
        name: '',
        projectId: '',
        mannagerName: '',
        approvalDate: null,
        contractTypeName: '',
        settlementCycle: ''
      },
      orderData: { settlementDate: '' },
      tableData: {
        theads: [
          { label: '结算时间', prop: 'settlementDate', slotName: 'settlementDate', width: '80px' },
          { label: '结算金额', prop: 'settlementAcount', slotName: 'settlementAcount' },
          { label: '结算单', prop: 'settlementFile', slotName: 'settlementFile' },
          { label: '预计回款时间', prop: 'expectReturnDate', slotName: 'expectReturnDate' },
          { label: '状态', prop: 'state', slotName: 'state' },
          { label: '回款时间', prop: 'returnDate', slotName: 'returnDate' },
          { label: '回款金额', prop: 'returnAcount', slotName: 'returnAcount' },
          { label: '回款单', prop: 'returnFile', slotName: 'returnFile' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '80px' }
        ],
        height: '150px',
        minHeight: '180px',
        maxHeight: '300px'
      },
      orderList: [],
      activeNames: []
    }
  },
  methods: {
    init(data) {
      if (data) {
        Object.assign(this.order, data)
      }
      this.refresh()
    },
    addOrder() {
      this.title = '添加订单'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrderRef.init('add', this.order.id)
      })
    },
    refresh() {
      this.$http({
        url: this.$http.adornUrl('/costItems/order/list'),
        params: { projectId: this.order.id },
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.orderList = data.payload
          if (this.orderList) {
            for (let i = 0; i < this.orderList.length; i++) {
              this.activeNames.push(i)
              this.$nextTick(() => {
                this.$refs.table[i].options.dataList = this.orderList[i].settlementDtos
              })
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleChange() {},
    viewOrder(item) {
      this.title = '订单详情'
      this.$refs.viewOrderDialog.show()
      this.$nextTick(() => {
        this.$refs.viewOrderRef.init(item)
      })
    },
    updateOrder(item) {
      this.title = '编辑订单'
      this.$refs.addOrUpdateDrawer.show()
      this.$nextTick(() => {
        this.$refs.addOrderRef.init('update', item)
      })
    },
    deleteOrder(item) {
      this.$confirm('确定删除该订单信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/costItems/order/delete'),
            method: 'delete',
            params: { id: item.id }
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
    onSelect(selection) {
      if (selection.length > 0) {
        this.chooseStr = '已选中' + selection.length + '项'
      } else {
        this.chooseStr = '已选择 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已回款 0.00'
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
    addSettlement(index) {
      this.$refs.table[index].options.dataList.push({ settlementDate: '' })
    },
    editSettlement(row, index) {
      console.log(1123)
      console.log(row.item, index)
      this.clientTypeShow = !this.clientTypeShow
    },
    deleteSettlement() {},
    updteSettlement() {},
    cancelSettlement() {},
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
</style>
