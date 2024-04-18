<template>
  <div>
    <el-container class="container">
      <div :class="classObj" class="app-wrapper" style="background-color: #f5f7fa">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" @reload="reload" style="top: 1px; left: 1px" />
        <el-container class="main-container">
          <el-header style="height: 110px">
            <navbar />
            <TopNavbar />
          </el-header>

          <el-main>
            <app-main ref="appMain" />
          </el-main>
        </el-container>
      </div>
    </el-container>
  </div>
</template>

<script>
import { TopNavbar, Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    TopNavbar,
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    reload() {
      this.$refs.appMain.reload()
    }
  }
  /*  beforeCreate(){
      document.querySelector('body').setAttribute('style','overflow:hidden')
    }*/
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 85px);
}

.mobile .fixed-header {
  width: 100%;
}

.el-header {
  padding: 0;
  height: 95px;
}

.el-aside {
  color: #333;
}

.container {
  height: calc(100vh);
  border: 1px solid #eee;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.2);
  background: #e1f1f1;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #fff;
}
</style>
