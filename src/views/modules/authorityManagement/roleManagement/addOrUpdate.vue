<template>
  <div class="mdgContent">
    <el-container class="el-container__mdgContent">
      <div style="width: 100%">
        <el-form :rules="roleAddOrUpdateFormRule" :model="roleAddOrUpdateFormData" ref="roleAddOrUpdateForm" style="width: 100%; padding: 0 20px">
          <el-form-item label="角色名称" prop="roleType">
            <el-input v-model="roleAddOrUpdateFormData.roleType" placeholder="请输入角色名称" maxlength="64" show-word-limit clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input
              v-model="roleAddOrUpdateFormData.description"
              type="textarea"
              :rows="2"
              maxlength="256"
              placeholder="请输入角色描述"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-container direction="vertical" style="height: 300px; width: 100%">
              <span style="font-weight: 700; font-size: 14px">角色权限</span>
              <div style="width: 100%; overflow-y: auto">
                <el-tree
                  ref="roleAddOrUpdateTree"
                  v-model="roleAddOrUpdateTreeData"
                  :data="roleAddOrUpdateTreeData"
                  :show-checkbox="true"
                  check-strictly
                  default-expand-all
                  node-key="id"
                  :expand-on-click-node="false"
                  :default-checked-keys="checkPermissionKeys"
                  :render-content="renderContent"
                ></el-tree>
              </div>
            </el-container>
          </el-form-item>
        </el-form>
        <div class="btn-group">
          <el-button plain style="margin-right: 10px" @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="addOrUpdateHandle">确定</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleAddOrUpdateFormData: {
        roleId: '',
        roleType: '',
        description: '',
        permissions: []
      },
      roleAddOrUpdateFormRule: {
        roleType: [{ required: true, message: '角色名称必填', trigger: 'blur' }]
      },
      // 1 新增 2 修改 3 查看
      operateType: '1',
      roleAddOrUpdateTreeData: [],
      checkPermissionKeys: [],
      roleLookTreeData: []
    }
  },
  components: {},
  props: {
    closeDialog: {
      type: Function
    }
  },
  mounted() {},
  created() {},
  methods: {
    // 初始化
    initAddOrViewOrUpdate(initData) {
      this.operateType = initData.operateType
      Object.assign(this.roleAddOrUpdateFormData, initData)
      this.roleAddOrUpdateFormData.roleType = initData.roleName
      if (this.operateType === 1) {
        this.getAllPermission()
      } else if (this.operateType === 2) {
        this.getAllPermission()
        this.$http({
          url: this.$http.adornUrl('/userRole/permission/list'),
          method: 'get',
          params: this.$http.adornParams({
            roleId: this.roleAddOrUpdateFormData.roleId
          })
        }).then((result) => {
          if (result.data.success) {
            this.checkPermissionKeys = result.data.payload
          } else {
            this.$message.error('获取权限信息失败: ' + result.data.msg)
          }
        })
      }
    },

    // 获取所有权限
    getAllPermission() {
      this.$http({
        url: this.$http.adornUrl('/userRole/permission/all'),
        method: 'get'
        // params: this.$http.adornParams()
      }).then((result) => {
        if (result.data.success) {
          this.roleAddOrUpdateTreeData = this.convertMenuToTree(result.data.payload)
        } else {
          this.$message.error('获取权限信息失败: ' + result.data.msg)
        }
      })
    },

    // 新增、修改 保存
    addOrUpdateHandle() {
      let params = this.roleAddOrUpdateFormData
      const checkedIds = this.$refs.roleAddOrUpdateTree.getCheckedKeys()
      const permissions = []
      for (const id of checkedIds) {
        const permission = {
          menuId: id,
          hasPermission: true
        }
        permissions.push(permission)
      }
      params.permissions = permissions
      if (this.operateType == 2) {
        this.$http({
          url: this.$http.adornUrl('/userRole/permission/update'),
          method: 'post',
          data: params
        }).then((result) => {
          if (result.data.success) {
            this.$message.success('修改成功')
            this.closeDialog()
          } else {
            this.$message.error('修改失败：' + result.data.msg)
          }
        })
      }
    },

    // 二级节点增加勾选下属所有项功能
    renderContent(h, { node, data, store }) {
      if (node.level === 2 || (node.level === 3 && node.childNodes && node.childNodes.length > 0)) {
        return (
          <span class='custom-tree-node'>
            <span style='font-size: 14px'>{node.label}</span>
            <span>
              <el-button size='mini' type='text' style='font-size: 12px; color: #8cc5ff' on-click={() => this.selectCurrentNodeChildren(data)}>
                全选/取消
              </el-button>
            </span>
          </span>
        )
      } else {
        return <span>{node.label}</span>
      }
    },

    // 选择当前节点下所有子节点
    selectCurrentNodeChildren(data) {
      let childrenIds = data.children.map((item) => item.id)
      let selectedKeys = this.$refs.roleAddOrUpdateTree.getCheckedKeys()
      childrenIds.push(data.id)
      if (childrenIds.some((item) => selectedKeys.includes(item))) {
        selectedKeys = selectedKeys.filter((item) => !childrenIds.includes(item))
      } else {
        selectedKeys = selectedKeys.concat(childrenIds)
      }
      this.$refs.roleAddOrUpdateTree.setCheckedKeys(selectedKeys)
    },

    // 结构转换
    convertMenuToTree(menus) {
      var tree = []
      for (var i = 0; i < menus.length; i++) {
        var menu = menus[i]
        var node = {
          id: menu.menuId,
          label: menu.menuName,
          children: []
        }
        if (menu.sons && menu.sons.length > 0) {
          node.children = this.convertMenuToTree(menu.sons)
        }
        tree.push(node)
      }
      return tree
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.mdgContent .el-form-item {
  width: 100% !important;
}

.mdgContent .el-form-item__content {
  width: 100% !important;
}
</style>
