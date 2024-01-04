<template>
  <div style="height: 100%;">
    <el-container style="height: 100%; border: 1px solid #eee">
      <baseTable :tableData="tableData" ref="table" :multiSelect="true">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <svg-icon :icon-class="row.item.status? 'switch-open' : 'switch-close'"
                      style="height:1.5em;width:1.5em; margin-right: 2em;" @click="switchConfig(row)"/>
          </template>
        </template>
      </baseTable>
    </el-container>

  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog.vue'

export default {
  data() {
    return {
      titles: '',
      dataForm: {
        account: '',
        phone: '',
        mail: '',
        createTime: '',
        status: ''
      },
      roleList:[],
      tableData: {
        theads: [
          {label: '配置名称', prop: 'configName'},
          {label: '创建时间', prop: 'createTime'},
          {label: '操作', prop: 'clientType', slotName: 'clientType'}
        ],
        url: '/system/list'
      }
    }
  },
  components: {
    baseTable, baseDialog
  },
  mounted() {
    this.$refs.table.refresh(this.dataForm)
    //初始化roleList

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
    switchConfig(row) {
      if (row.item.status) {
        row.item.status = false
      } else {
        row.item.status = true
      }
      var data = {
        status: row.item.status,
        configId: row.item.configId
      }
      this.$http({
        url: this.$http.adornUrl('/system/switch'),
        method: 'post',
        data: data
      }).then(({data}) => {
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

    resetForm() {
      this.$refs.dataForm.resetFields()
    },
    exportExcel(){
        this.$http.download(this.$http.adornUrl('/userInfo/list/excel'),this.$http.adornParams(this.dataForm), this);
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
::v-deep .el-table__cell{
  text-align: center;
}
</style>
<style>
::-webkit-scrollbar { /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}

::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #e1f1f1;
}

::-webkit-scrollbar-track { /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #fff;
}
</style>
