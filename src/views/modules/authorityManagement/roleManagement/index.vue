<template>
  <div style="height: 100%">
    <el-container style="height: 100%; border: 1px solid #eee" direction="vertical">
      <baseTable ref="table" :table-data="tableData" :multi-select="true" :type="null">
        <template v-slot:clientType="row">
          <!--类型插槽-->
          <template>
            <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
              <svg-icon :icon-class="'edit-icon'" style="height: 1.5em; width: 1.5em; margin-right: 2em" @click="updateRoleInfoAndPermission(row.item)" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看用户清单" placement="bottom">
              <svg-icon :icon-class="'detials-icon'" style="height: 1.5em; width: 1.5em" @click="viewRoleAndUserRef(row)" />
            </el-tooltip>
            <!-- <el-tooltip  class="item" effect="dark" content="修改" placement="bottom">
                            <el-button type="text" icon="el-icon-edit" @click="updateRoleInfoAndPermission(row.item)" />
                        </el-tooltip>
                        <el-tooltip  class="item" effect="dark" content="查看用户清单" placement="bottom">
                            <el-button type="text" icon="el-icon-document" @click="viewRoleAndUserRef(row)" />
                        </el-tooltip> -->
          </template>
        </template>
      </baseTable>
    </el-container>

    <baseDialog ref="addOrViewOrUpdateDialog" :title="addOrViewOrUpdateDialogTitle" :width="'400px'">
      <template>
        <addOrUpdate ref="addOrViewOrUpdate" :close-dialog="closeAddOrViewOrUpdateDialog" />
      </template>
    </baseDialog>

    <baseDialog ref="examineDialog" :title="titles" :width="'800px'" :height="'600px'">
      <template>
        <examine ref="examine" @refreshDataList="refresh" />
      </template>
    </baseDialog>
    <baseDialog ref="choiceDialog" :title="titles" :width="'550px'" :height="'800px'">
      <template>
        <choice ref="choice" @refreshDataList="refresh" />
      </template>
    </baseDialog>
  </div>
</template>
<script>
import baseTable from '../../base/baseTable.vue'
import baseDialog from '../../base/baseDialog.vue'
import examine from './examine.vue'
import addOrUpdate from '@/views/modules/authorityManagement/roleManagement/addOrUpdate.vue'

export default {
  components: {
    baseTable,
    baseDialog,
    examine,
    addOrUpdate
  },
  data() {
    return {
      titles: '',
      dataForm: {
        // isbn: ''
      },
      tableData: {
        theads: [
          { label: '角色名称', prop: 'roleName' },
          { label: '创建时间', prop: 'createTime' },
          { label: '操作', prop: 'clientType', slotName: 'clientType' }
        ],
        dataList: [],

        url: '/userRole/list'
      },
      addOrViewOrUpdateDialogTitle: ''
    }
  },
  mounted() {
    this.init()
    //this.$refs.table.refresh(this.dataForm)
    //this.refresh()
  },
  created() {},
  methods: {
    init() {
      let that = this
      this.$http({
        method: 'get',
        url: that.$http.adornUrl('/userRole/list'),
        params: that.$http.adornParams(this.dataForm)
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.tableData.dataList.length = 0
          that.tableData.dataList.push(...data.payload)
        } else {
          that.$message.warning(data.msg)
        }
      })
    },
    refresh() {
      this.$refs.table.refresh()
    },

    // 修改角色
    updateRoleInfoAndPermission(item) {
      this.$refs.addOrViewOrUpdateDialog.show()
      this.$nextTick(() => {
        item.operateType = 2
        this.$refs.addOrViewOrUpdate.initAddOrViewOrUpdate(item)
      })
    },

    // 关闭新增、修改、查看页面
    closeAddOrViewOrUpdateDialog() {
      this.$refs.addOrViewOrUpdateDialog.hide()
      this.init()
    },

    // 查看用户清单
    viewRoleAndUserRef(row) {
      this.titles = '用户清单'
      this.$refs.examineDialog.show()
      this.$nextTick(() => {
        this.$refs.examine.init(row.item.roleId)
      })
    },

    choice(row) {
      this.titles = '绑定权限'
      this.$refs.choiceDialog.show()
      this.$nextTick(() => {
        this.$refs.choice.init(row.item.roleId)
      })
    }
  }
}
</script>
<style scoped>
::v-deep .el-icon-view,
::v-deep .el-icon-edit,
::v-deep .el-icon-delete,
::v-deep .el-icon-document {
  color: black;
}
</style>
