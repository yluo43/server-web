<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%" direction="vertical">
      <el-main style="width: 100%" class="main">
        <div class="top">
          <div class="header-title">工作量统计：{{ headerData.workLoad }}</div>
        </div>
        <div class="info-box">
          <div>
            <span>填报人:</span>
            <span>{{ headerData.Informant }}</span>
          </div>
          <div>
            <span>团队名称:</span>
            <span>xxxx</span>
          </div>
          <div>
            <span>团队成员:</span>
            <span>20</span>
          </div>
          <div>
            <span>填报开始时间:</span>
            <span>2024-2-2</span>
          </div>
        </div>
        <div class="desc">
          <span>简介:</span>
          <span>这是一条简介</span>
        </div>

        <div class="table">
          <div style="display: flex; align-items: center">
            <div class="table-title">填报工作量</div>
            <div style="margin-left: 20px">
              <el-button type="text" @click="add()">添加</el-button>
            </div>
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="card" label="工号"></el-table-column>
              <el-table-column prop="address" label="开始时间"></el-table-column>
              <el-table-column prop="address" label="结束时间"></el-table-column>
              <el-table-column prop="costItem" label="成本项目">
                <template slot-scope="scope">
                  <div @dblclick="handlerSelect(scope.row, scope.column)">
                    <el-select
                      v-if="scope.row.isSelect"
                      v-model="scope.row.costItem"
                      @blur="selectBlur(scope.row)"
                      @keyup.enter.native="selectBlur(scope.row)"
                      @change="handlerSel"
                      ref="costItem"
                    >
                      <el-option v-for="item in costItems" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <span v-else>{{ scope.row.costItem }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="项目经理"></el-table-column>
              <el-table-column prop="actualInvestment" label="实际投入">
                <template slot-scope="scope">
                  <div @dblclick="handler(scope.row, scope.column)">
                    <el-input
                      v-if="scope.row.isEdit"
                      ref="actualInvestment"
                      clearable
                      v-model="scope.row.actualInvestment"
                      @blur="onBlur(scope.row)"
                      @keyup.enter.native="onBlur(scope.row)"
                    ></el-input>
                    <span v-else>{{ scope.row.actualInvestment }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="goToDelete(scope.row)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 添加一条数据 -->
    <base-dialog ref="addDataDialog" title="添加" :width="'500px'">
      <template>
        <addDataDialog ref="addData" :cancelDialog="closeDialog"></addDataDialog>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import baseDialog from '@/views/modules/base/baseDialog.vue'
import addDataDialog from '@/views/modules/workloadManagement/teamWorkload/addDataDialog.vue'
export default {
  props: {},
  components: { baseDialog, addDataDialog },
  data() {
    return {
      headerData: {
        workLoad: '',
        //填报人
        Informant: ''
      },
      tableData: [
        {
          name: 'zhangsan',
          card: '01212',
          costItem: '哈哈',
          actualInvestment: 60,
          isSelect: false,
          isEdit: false
        },
        {
          name: 'zhangsan',
          card: '01212',
          costItem: '嘻嘻',
          actualInvestment: 50,
          isSelect: false,
          isEdit: false
        }
      ],
      costItems: [
        {
          id: 1,
          name: '哈哈哈'
        },
        {
          id: 2,
          name: '嘻嘻嘻'
        }
      ]
    }
  },
  mounted() {},
  created() {},
  methods: {
    //初始化
    init(initData) {
      Object.assign(this.headerData, initData)
    },
    //查询
    selectWorkload() {
      this.$refs.workloadListTable.refresh()
    },
    //增加
    add() {
      this.$refs.addDataDialog.show()
    },
    //关闭弹窗
    closeDialog() {
      this.$refs.addDataDialog.hide()
    },
    //删除
    goToDelete(row) {
      let message = '确认删除?'
      let data = { id: row.item.id }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/projectSet/delete'),
            method: 'post',
            data: data
          }).then(({ res }) => {
            if (res && res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.refresh()
            } else {
              this.$message.error(res.msg)
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
    handlerSelect(row, column) {
      row.isSelect = true
      this.$nextTick(() => {
        this.$refs[column.property].focus()
      })
    },
    handlerSel(sel) {
      alert(sel)
    },
    selectBlur(row) {
      row.isSelect = false
    },
    handler(row, column) {
      row.isEdit = true
      this.$nextTick(() => {
        this.$refs[column.property].focus()
      })
    },
    onBlur(row) {
      row.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio-button__inner {
  padding: 6px 15px;
}
.main {
  .top {
    background: white;
    padding-left: 30px;
  }
  .header-title {
    font-size: 16px;
    font-weight: 600;
  }
  .info-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 70%;
    margin: 20px 0 20px 30px;
  }
  .desc {
    height: 40px;
    margin-left: 30px;
  }
}
.table {
  background-color: white;
  margin-top: 10px;
  border: 1px solid lightgray;
  .table-title {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    padding-left: 20px;
    font-weight: 600;
  }
}
</style>
