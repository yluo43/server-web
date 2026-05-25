<template>
  <div class="page-header">
    <div class="header-left">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        background-color="transparent"
        text-color="#303133"
        active-text-color="#409EFF"
        class="nav-menu"
      >
        <el-menu-item index="home" @click="$router.push('/home')">
          <i class="el-icon-s-data" />
          <span slot="title">数据统计</span>
        </el-menu-item>
        <el-menu-item index="users" @click="$router.push('/users')">
          <i class="el-icon-user-solid" />
          <span slot="title">用户列表</span>
        </el-menu-item>
        <!-- GoalDay 专用菜单 -->
        <el-menu-item
          v-if="currentSystem === 'goalday'"
          index="adminManagement"
          @click="$router.push('/adminManagement')"
        >
          <i class="el-icon-s-custom" />
          <span slot="title">后台用户管理</span>
        </el-menu-item>
        <!-- EggNote 专用菜单（生产和测试环境菜单相同） -->
        <el-menu-item
          v-if="currentSystem === 'eggnote' || currentSystem === 'eggnote-test'"
          index="appleReceipt"
          @click="$router.push('/appleReceipt')"
        >
          <i class="el-icon-apple" />
          <span slot="title">Apple收据验证</span>
        </el-menu-item>
        <el-menu-item
          v-if="currentSystem === 'eggnote' || currentSystem === 'eggnote-test'"
          index="redemptionCode"
          @click="$router.push('/redemptionCode')"
        >
          <i class="el-icon-key" />
          <span slot="title">兑换码管理</span>
        </el-menu-item>
        <el-menu-item
          v-if="currentSystem === 'eggnote' || currentSystem === 'eggnote-test'"
          index="taskManagement"
          @click="$router.push('/taskManagement')"
        >
          <i class="el-icon-s-check" />
          <span slot="title">任务管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="header-right">
      <el-select
        v-model="currentSystem"
        placeholder="选择系统"
        class="system-selector"
        @change="handleSystemChange"
      >
        <el-option
          v-for="item in systemOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="danger"
        icon="el-icon-switch-button"
        plain
        class="logout-btn"
        @click="handleLogout"
      >
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script>
import { logout } from '@/api/user'
import { removeToken, removeCName } from '@/utils/auth'

export default {
  name: 'PageHeader',
  props: {
    activeMenu: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      currentSystem: 'goalday',
      systemOptions: [
        { label: 'GoalDay', value: 'goalday' },
        { label: 'Eggnote', value: 'eggnote' },
        { label: 'Eggnote-Test', value: 'eggnote-test' }
      ]
    }
  },
  mounted() {
    // 从 localStorage 读取当前选择的系统
    const savedSystem = localStorage.getItem('currentSystem')
    if (savedSystem) {
      this.currentSystem = savedSystem
    }
  },
  methods: {
    handleSystemChange(system) {
      // 保存当前选择的系统到 localStorage
      localStorage.setItem('currentSystem', system)
      this.$message.success(`已切换到 ${this.systemOptions.find(s => s.value === system).label}`)

      // 触发页面刷新，让组件重新获取数据
      this.$emit('system-changed', system)

      // 使用事件总线广播系统切换事件
      this.$root.$emit('system-changed', system)
    },

    async handleLogout() {
      try {
        await this.$confirm('确认退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 调用退出登录接口
        await logout()

        // 清除本地存储的 token 和用户信息
        removeToken()
        removeCName()

        // 清除系统选择（可选，如果希望下次登录恢复默认）
        localStorage.removeItem('currentSystem')

        this.$message.success('退出成功')

        // 跳转到登录页
        this.$router.push({ name: 'login' })
      } catch (error) {
        if (error !== 'cancel') {
          console.error('退出登录失败:', error)
          this.$message.error('退出失败，请重试')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header-left {
    flex: 1;

    .nav-menu {
      border: none;

      ::v-deep .el-menu-item {
        border: none;
        font-size: 16px;

        &:hover {
          background-color: transparent;
        }

        &.is-active {
          border-bottom: 2px solid #409EFF;
        }

        i {
          margin-right: 5px;
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;

    .system-selector {
      width: 150px;
    }

    .logout-btn {
      ::v-deep .el-icon-switch-button {
        margin-right: 5px;
      }
    }
  }
}
</style>
