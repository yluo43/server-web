<template>
  <div>
    <div class="navbar">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"></hamburger>
      <span class="welcomeTitle">欢迎进入PMIS项目管理信息系统</span>
      <div class="right-menu">
        <!-- 用户信息 -->
        <span v-html="'\u00a0\u00a0\u00a0\u00a0'" />
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span>您好，{{ userChineseName }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item @click.native.prevent="layout">退出登录</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getCName, getUserID, removeToken, removeCName } from '@/utils/auth'

export default {
  mounted() {
    // 监听是大屏还是小屏
    this.monitor()
  },
  data() {
    return {
      userChineseName: getCName(),
      userID: getUserID(),
      display: false
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar'])
  },
  methods: {
    /*personalPage() {
      return '/personalInfo/' + this.userID
    },*/
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    layout() {
      removeToken()
      removeCName()
      this.$http({
        url: this.$http.adornUrl(`/userLogin/logout`),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message({
            type: 'success',
            message: '退出成功！'
          })
        } else {
          this.$message.warning('发生错误')
        }
      })

      this.$router.push({ name: 'login' })
      // setTimeout(() => {
      // location.reload() //强制刷新
      // },0)
    },

    // 监听屏幕宽度
    monitor() {
      //左侧菜单默认展开状态
      this.$store.dispatch('app/defaultSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.welcomeTitle {
  line-height: 60px;
  // margin-top: 20px;
  display: inline-block;
  font-weight: bold;
  font-size: 14px;
}

.navbar {
  height: 60px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  z-index: 100;
  // margin-left: 4px;

  .hamburger-container {
    line-height: 59px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        cursor: pointer;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 39%;
          font-size: 12px;
        }
      }
    }
  }
}

.customWidth {
  min-width: 700px;
}

.el-dropdown {
  color: #242933;
}

.leaveColor {
  background-color: white;
}

.overColor {
  background-color: #e4e7ed;
}

/* 服务信息样式 */
.service-footer li {
  line-height: 30px;
  list-style-type: none;
  color: #1c1e21;
}

.service-footer {
  padding-left: 0;
  margin-top: 50px;
}

.webServiceBtn.el-link.is-underline:hover:after {
  border-bottom: none !important;
  color: #242933;
  margin-top: -2px;
}

.horizon-line {
  width: 1px;
  height: 16px;
  background: #d7dbe5;
  border-radius: 2px;
  display: -webkit-inline-box;
  vertical-align: middle;
  margin-bottom: 4px;
}
</style>
