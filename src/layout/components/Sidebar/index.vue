<template>
  <div :class="{ 'has-logo': showLogo }" id="left-tree">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        @select="handleSelect"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        :default-openeds="['/index']"
        :router="true"
        mode="vertical"
      >
        <div v-for="(route, index) in permission_routes">
          <el-submenu :index="'' + route.meta.menuId" v-if="route.hidden === false">
            <template slot="title">
              <i :class="route.icon"></i>
              <span>{{ route.meta.title }}</span>
            </template>
            <div v-for="(item, i) in route.children">
              <el-menu-item :index="'' + item.path" style="padding-left: 60px">{{ item.meta.title }}</el-menu-item>
            </div>
          </el-submenu>
        </div>
        <!--          <template slot="title" >{{11111111 }}</template>-->
        <!--        </div>-->
        <!--        <sidebar-item v-for="(route,index) in permission_routes" :key="index" :item="route" :base-path="route.path"/>-->
      </el-menu>
      <!--平铺菜单-->
      <!--    <SidebarItemTree />-->
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
//import SidebarItemTree from './SidebarItemTree'

var currentMenu
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar']),
    // ...mapGetters(['permission_routes', 'sidebar']),
    permission_routes() {
      // return  JSON.parse(sessionStorage.getItem('routes'))
      // if(this.$router.options.routes[this.$router.options.routes.length-1].children){
      //   return this.$router.options.routes[this.$router.options.routes.length-1].children
      // }
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    onRoutes() {
      if (this.$route.path.indexOf('projectHome') >= 0) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$store.state.lastMenu = this.$route.path
        return this.$route.path
      } else {
        return this.$store.state.lastMenu
      }
    }
  },
  methods: {
    handleSelect(index) {
      if (index === this.$route.path) {
        this.$emit('reload')
      }
    }
  }
}
</script>
