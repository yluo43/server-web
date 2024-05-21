<template>
  <div class="container-box">
    <el-container direction="vertical">
      <div class="header-box">
        <div class="header-title">项目信息</div>
        <i class="el-icon-close" style="font-size: 14px" @click="handlerFlag"></i>
      </div>
      <div>
        <el-descriptions>
          <template v-slot:title>
            <div style="display: flex; align-items: center; padding: 16px 0 0 20px">
              <div class="circular"></div>
              <span class="title">{{ order.name }}</span>
            </div>
          </template>
          <el-descriptions-item label="项目编码">{{ order.projectId }}</el-descriptions-item>
          <el-descriptions-item label="项目经理">{{ order.managerName }}</el-descriptions-item>
          <el-descriptions-item label="立项时间">{{ order.approvalDate }}</el-descriptions-item>
          <el-descriptions-item label="合同类型">{{ order.contractTypeName }}</el-descriptions-item>
          <el-descriptions-item label="结算周期">{{ order.settlementCycle }}</el-descriptions-item>
          <el-descriptions-item label="计划交付时间">{{ order.deliveryDate }}</el-descriptions-item>
          <el-descriptions-item label="项目状态">
            <div style="width: 80%">
              <!--            0交付中 1已交付 2关闭 3已回款-->
              <el-steps :active="order.state" finish-status="success">
                <el-step title="交付中"></el-step>
                <el-step title="已交付"></el-step>
                <el-step title="关闭"></el-step>
                <el-step title="已回款"></el-step>
              </el-steps>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="add-box">
        <el-button class="add-btn" type="primary" @click="addOrder()" icon="el-icon-circle-plus-outline" :disabled="viewDisabled">添加订单</el-button>
      </div>
      <div style="margin: 0 24px">
        <el-collapse v-model="activeNames" @change="handleChange">
          <template v-for="(item, index) in orderList">
            <el-collapse-item :name="index" style="margin-bottom: 16px">
              <template slot="title">
                <div class="order-title">
                  <div style="display: flex; align-items: center">
                    <svg-icon :icon-class="activeNames.includes(index) ? 'triangle-down-icon' : 'triangle-up-icon'" style="height: 1.3em; width: 1.3em" />
                    <span style="color: #2462f9; margin-right: 6px">订单:</span>
                    <span>{{ item.orderName }}</span>
                  </div>
                  <div style="display: flex">
                    <el-link type="primary" :underline="false" @click.stop="viewOrder(item)">查看详情 |</el-link>
                    <el-link type="primary" :underline="false" @click.stop="updateOrder(item)" :disabled="viewDisabled">编辑 |</el-link>
                    <el-link type="primary" :underline="false" @click.stop="deleteOrder(item)" :disabled="viewDisabled" style="margin-right: 30px">
                      删除
                    </el-link>
                  </div>
                </div>
              </template>
              <div style="padding: 0 16px">
                <div style="margin-top: 5px">结算回款</div>
                <div class="chooseResult">
                  <i class="el-icon-info" style="color: #108ee9"></i>
                  <span class="chooseResultStr" v-html="chooseStr"></span>
                </div>
                <baseTable :tableData="tableData" ref="table" :multiSelect="true" @select="onSelect" :hidePage="true">
                  <template v-slot:settlementDate="scope">
                    <el-date-picker
                      v-model="scope.item.row.settlementDate"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      type="date"
                      style="width: 100%"
                      placeholder="选择日期"
                      :disabled="scope.item.row.clientTypeShow"
                    ></el-date-picker>
                  </template>
                  <template v-slot:settlementAcount="scope">
                    <el-input v-model="scope.item.row.settlementAcount" :disabled="scope.item.row.clientTypeShow" placeholder="请输入"></el-input>
                  </template>
                  <template v-slot:settlementFile="scope">
                    <el-upload
                      :disabled="scope.item.row.clientTypeShow"
                      class="upload-demo"
                      action="#"
                      :limit="1"
                      :accept="'.pdf,.PDF'"
                      :auto-upload="false"
                      :on-remove="(file, fileList) => handleFirstRemove(file, fileList, scope, index)"
                      :on-change="
                        (file, fileList) => {
                          handleFileChange(file, fileList, scope, index)
                        }
                      "
                      :file-list="scope.item.row.settlementFileList"
                    >
                      <el-button icon="el-icon-upload2" :disabled="scope.item.row.clientTypeShow" style="width: 100px">上传文件</el-button>
                      <div v-if="scope.item.row.settlementFileShow" slot="tip" class="el-upload__tip">支持扩展名：.pdf</div>
                    </el-upload>
                  </template>
                  <template v-slot:expectReturnDate="scope">
                    <el-date-picker
                      v-model="scope.item.row.expectReturnDate"
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
                  <template v-slot:returnDate="scope">
                    <el-date-picker
                      v-model="scope.item.row.returnDate"
                      value-format="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      type="date"
                      style="width: 100%"
                      placeholder="选择日期"
                      :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow"
                    ></el-date-picker>
                  </template>
                  <template v-slot:returnAcount="scope">
                    <el-input
                      v-model="scope.item.row.returnAcount"
                      placeholder="请输入"
                      clearable
                      :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow"
                    ></el-input>
                  </template>
                  <template v-slot:returnFile="scope">
                    <el-upload
                      :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow"
                      class="upload-demo"
                      action="#"
                      :limit="1"
                      :accept="'.pdf,.PDF'"
                      :auto-upload="false"
                      :on-remove="(file, fileList) => handleSecondRemove(file, fileList, scope, index)"
                      :on-change="
                        (file, fileList) => {
                          returnFileShowChange(file, fileList, scope, index)
                        }
                      "
                      :file-list="scope.item.row.returnFileList"
                    >
                      <el-button icon="el-icon-upload2" :disabled="scope.item.row.clientTypeShow || scope.item.row.returnShow" style="width: 100px">
                        上传文件
                      </el-button>
                      <div slot="tip" v-if="scope.item.row.returnFileShow" class="el-upload__tip">支持扩展名：.pdf</div>
                    </el-upload>
                  </template>
                  <template v-slot:clientType="scope">
                    <!--类型插槽-->
                    <template v-if="scope.item.row.clientTypeShow">
                      <el-link :underline="false" type="primary" @click="editSettlement(scope, index)" :disabled="viewDisabled">编辑 |</el-link>
                      <el-link :underline="false" type="primary" @click="deleteSettlement(scope, index)" :disabled="viewDisabled">删除</el-link>
                    </template>
                    <template v-else>
                      <el-link :underline="false" type="primary" @click="updateSettlement(scope, item, index)" :disabled="viewDisabled">保存 |</el-link>
                      <el-link :underline="false" type="primary" @click="cancelSettlement(scope, index)" :disabled="viewDisabled">取消</el-link>
                    </template>
                  </template>
                </baseTable>
              </div>
              <div class="center-button-container">
                <el-button
                  type="primary"
                  plain
                  style="width: 160px; margin-top: 20px; color: #2462f9"
                  @click="addSettlement(index)"
                  icon="el-icon-circle-plus-outline"
                  :disabled="viewDisabled"
                >
                  添加结算回款
                </el-button>
              </div>
            </el-collapse-item>
          </template>
        </el-collapse>
      </div>
      <div class="bottom-btn">
        <el-button type="primary" style="margin-right: 10px" @click="handlerFlag">确定</el-button>
        <!-- <el-button type="primary" style="margin-right: 10px" @click="saveInfo">暂存</el-button> -->
        <el-button @click="handlerFlag">取消</el-button>
      </div>
    </el-container>
    <base-dialog :title="title" ref="addOrUpdateDrawer" :width="'500px'">
      <template>
        <add-order @refreshDataList="refresh" ref="addOrderRef"></add-order>
      </template>
    </base-dialog>
    <base-dialog :title="title" ref="viewOrderDialog" :width="'500px'">
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
import baseTable from '@/views/modules/base/baseTableScope.vue'

export default {
  components: { baseTable, addOrder, baseDialog, viewOrder },
  data() {
    return {
      activeNames: [],
      chooseStr: '已选中 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已回款 0.00',
      title: '',
      order: {
        name: '',
        projectId: '',
        mannagerName: '',
        approvalDate: null,
        contractTypeName: '',
        settlementCycle: ''
      },
      flag: true,
      orderData: { settlementDate: '' },
      tableData: {
        theads: [
          { label: '结算时间', prop: 'settlementDate', slotName: 'settlementDate', width: '160px' },
          { label: '结算金额', prop: 'settlementAcount', slotName: 'settlementAcount', width: '100px' },
          { label: '结算单', prop: 'settlementFile', slotName: 'settlementFile', width: '120px' },
          { label: '预计回款时间', prop: 'expectReturnDate', slotName: 'expectReturnDate', width: '160px' },
          { label: '状态', prop: 'state', slotName: 'state', width: '125px' },
          { label: '回款时间', prop: 'returnDate', slotName: 'returnDate', width: '160px' },
          { label: '回款金额', prop: 'returnAcount', slotName: 'returnAcount', width: '100px' },
          { label: '回款单', prop: 'returnFile', slotName: 'returnFile', width: '120px' },
          { label: '操作', prop: 'clientType', slotName: 'clientType', width: '120px' }
        ],
        height: '150px',
        minHeight: '180px',
        maxHeight: '300px'
      },
      orderList: [],
      activeNames: [],
      // 结算单状态 状态（0实施中、1 提交材料、2 提交开票、3 已收款）
      options: [
        {
          value: 0,
          label: '实施中'
        },
        {
          value: 1,
          label: '提交材料'
        },
        {
          value: 2,
          label: '提交开票'
        },
        {
          value: 3,
          label: '已收款'
        }
      ],
      viewDisabled: false
    }
  },
  methods: {
    handlerFlag() {
      this.$emit('changeFlag', 1)
    },
    init(data) {
      if (data) {
        Object.assign(this.order, data)
      }
      if (this.order.state === 2 || this.order.state === 3) {
        this.viewDisabled = true
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
    // saveInfo() {
    //   console.log(this.orderList)
    // },
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
                let settlementDtos = this.orderList[i].settlementDtos
                settlementDtos.forEach((item) => {
                  this.$set(item, 'clientTypeShow', true)
                  this.$set(item, 'settlementFileShow', true)
                  this.$set(item, 'returnFileShow', true)
                  this.$set(item, 'returnShow', true)
                  //item.clientTypeShow = true
                  // item.settlementFileShow = true
                  //item.returnFileShow = true
                  // item.returnShow = true
                  item.settlementFileList = []
                  item.returnFileList = []
                  if (item.settlementFilePath) {
                    item.settlementFileList = [{ name: item.settlementFilePath.match(/\/([^/]+)$/)[1] }]
                    item.settlementFileShow = false
                  }
                  if (item.state === 0) {
                    item.returnFileList = []
                  } else {
                    if (item.returnFilePath) {
                      item.returnFileList = [{ name: item.returnFilePath.match(/\/([^/]+)$/)[1] }]
                      item.returnFileShow = false
                    }
                  }
                  if (item.state === 3) {
                    item.returnShow = false
                  }
                })
                this.$refs.table[i].options.dataList = settlementDtos
              })
            }
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleChange(activeNames) {
      this.activeName = activeNames
    },
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
        type: 'warning',
        center: true
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
        let returnAcount = 0
        let settlementAcount = 0
        selection.forEach((a) => {
          if (a.returnAcount) {
            returnAcount += parseFloat(a.returnAcount)
          }
          if (a.settlementAcount) {
            settlementAcount += parseFloat(a.settlementAcount)
          }
        })
        this.chooseStr =
          '已选中 ' + selection.length + ' 项&nbsp;&nbsp;&nbsp;&nbsp;合计：' + settlementAcount.toFixed(2) + '，已回款：' + returnAcount.toFixed(2)
      } else {
        this.chooseStr = '已选中 0 项&nbsp;&nbsp;&nbsp;&nbsp;合计：0.00，已回款：0.00'
      }
    },
    addSettlement(index) {
      this.$refs.table[index].options.dataList.push({
        settlementDate: '',
        settlementAcount: null,
        settlementFileList: [],
        settlementFile: null,
        expectReturnDate: '',
        state: 0,
        returnDate: '',
        returnAcount: null,
        returnFileList: [],
        returnFile: null,
        settlementFileShow: true,
        returnFileShow: true,
        clientTypeShow: false,
        returnShow: true
      })
    },
    stateChange(scope) {
      if (scope.item.row.state === 3) {
        scope.item.row.returnShow = false
      } else {
        scope.item.row.returnShow = true
        scope.item.row.returnAcount = ''
        scope.item.row.returnDate = ''
        scope.item.row.returnFile = ''
        scope.item.row.returnFileList = []
        scope.item.row.returnFilePath = ''
        scope.item.row.returnFileShow = true
      }
    },
    editSettlement(scope, index) {
      scope.item.row.clientTypeShow = false
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table[index].__rowClick(scope.item.row)
      })
    },
    handleFirstRemove(file, fileList, scope, index) {
      scope.item.row.settlementFileShow = true
      scope.item.row.settlementFileList = fileList
      scope.item.row.settlementFilePath = ''
      scope.item.row.settlementFile = null
    },
    handleSecondRemove(file, fileList, scope, index) {
      scope.item.row.returnFileShow = true
      scope.item.row.returnFileList = fileList
      scope.item.row.returnFilePath = ''
      scope.item.returnFile = null
    },
    handleFileChange(file, fileList, scope, index) {
      if (file) {
        scope.item.row.settlementFileShow = false
        scope.item.row.settlementFile = file.raw
        scope.item.row.settlementFileList = fileList
      }
      this.$refs.table[index].options.dataList[scope.item.$index] = scope.item.row
    },
    returnFileShowChange(file, fileList, scope, index) {
      if (file) {
        scope.item.row.returnFileShow = false
        scope.item.row.returnFile = file.raw
        scope.item.row.returnFileList = fileList
      }
      this.$refs.table[index].options.dataList[scope.item.$index] = scope.item.row
    },
    deleteSettlement(scope, index) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          if (scope.item.row.id) {
            this.$http({
              url: this.$http.adornUrl('/costItems/settlement/delete'),
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
            this.$refs.table[index].options.dataList.splice(scope.item.$index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    updateSettlement(scope, item, index) {
      let obj = scope.item.row
      const regex = /^[0-9-.]*$/
      if (!obj.settlementAcount || obj.settlementAcount == '0.00' || obj.settlementAcount == '0') {
        this.$message.warning('结算金额不能为空和0')
        return
      }
      if (!regex.test(obj.settlementAcount)) {
        this.$message.warning('结算金额须为数字')
        return
      }
      if (obj.settlementDate && obj.expectReturnDate && obj.expectReturnDate < obj.settlementDate) {
        this.$message.warning('预计回款时间要大于等于结算时间')
        return
      }

      if (obj.state === 3) {
        if (!obj.returnDate || !obj.returnAcount || (!obj.returnFile && !obj.returnFilePath)) {
          this.$message.warning('当状态为“已收款”时，列表中回款时间、回款金额、回款单信息必须填写上传！')
          return
        }
        if (!obj.returnAcount || obj.returnAcount == '0.00' || obj.returnAcount == '0') {
          this.$message.warning('回款金额不能为空和0')
          return
        }
        if (!regex.test(obj.returnAcount)) {
          this.$message.warning('结算金额须为数字')
          return
        }
        if (obj.settlementDate && obj.returnDate && obj.returnDate < obj.settlementDate) {
          this.$message.warning('回款时间要大于等于结算时间')
          return
        }
        if (obj.returnAcount > obj.settlementAcount) {
          this.$message.warning('回款金额要小于等于结算金额')
          return
        }
      } else {
        if (obj.returnDate || (obj.returnAcount && obj.returnAcount !== '0.00') || obj.returnFile) {
          this.$message.warning('当状态为“实施中、提交材料、提交开票”时，列表中回款时间、回款金额、回款单信息无需填写上传！')
          return
        }
        if (!obj.settlementFile && !obj.settlementFilePath) {
          this.$message.warning('当状态为"实施中、提交材料、提交开票”时，结算单为必填项!')
          return
        }
      }

      let formData = new FormData()
      for (let key in obj) {
        if (obj[key] || obj[key] === 0) {
          formData.set(key, obj[key])
        }
      }
      formData.set('orderId', item.id)
      formData.set('projectId', this.order.id)
      if (this.flag) {
        this.flag = false
        this.$http({
          url: this.$http.adornUrl('/costItems/settlement/update'),
          method: 'put',
          data: formData
        })
          .then(({ data }) => {
            this.flag = true
            if (data.success) {
              // this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.cancelSettlement(scope, index)
            } else {
              this.$message.error(data.msg)
              this.dataForm.orderFile = data.orderFilePath
            }
          })
          .catch(() => {
            this.flag = true
          })
      }
    },
    cancelSettlement(scope, index) {
      scope.item.row.clientTypeShow = true
      // 手动触发重新渲染
      this.$nextTick(() => {
        this.$refs.table[index].__rowClick(scope.item.row)
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

<style lang="scss" scoped>
::v-deep .is-success {
  .el-step__line {
    background-color: #2462f9;
  }
}
.container-box {
  height: 100%;
  background: white;
  .header-box {
    height: 60px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f0f1f3;
    .header-title {
      font-size: 16px;
    }
  }
  .circular {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(311deg, #3d6ce1 0%, #4d82ff 100%);
  }
  .add-box {
    margin: 0 0 16px 24px;
    .add-btn {
      width: 110px;
    }
  }
  .order-title {
    width: 100%;
    padding-left: 8px;
    background: #f5f7fa;
    display: flex;
    justify-content: space-between;
  }
  .bottom-btn {
    height: 60px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px -3px 12px 0px rgba(0, 0, 0, 0.1);
  }
}
::v-deep .el-collapse-item__arrow {
  display: none;
  margin: 0;
}
::v-deep .el-collapse-item {
  border: 1px solid #dddfe6;
}
::v-deep .el-step__head.is-success {
  color: #2462f9;
  border-color: #2462f9;
}

::v-deep .el-step__title.is-success {
  color: #262b39;
}
::v-deep .el-step__title.is-process {
  color: #2462f9;
}
::v-deep .el-step__head.is-process {
  color: #2462f9;
  border-color: #2462f9;
}
::v-deep .el-step__head.is-process .el-step__icon.is-text {
  border-color: #2462f9;
  background: #2462f9;
  color: white;
}
::v-deep .el-input__icon {
  line-height: 30px;
}
.title {
  /* color: #008aff;  */
  font-size: 20px;
  margin-left: 10px;
}

::v-deep .el-descriptions-item__label {
  /*color: #008aff;  设置描述项label字体颜色为绿色 */
  color: #4e5969;
  font-size: 14px;
}

.el-link {
  margin-right: 10px;
}

.chooseResult {
  height: 30px;
  line-height: 30px;
  margin: 10px auto;
  display: block;
  background: #e8f3ff;
  border-radius: 4px;
}

.center-button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.el-select {
  width: 100px !important;
}
::v-deep .el-descriptions__body {
  padding-left: 42px;
}
</style>
