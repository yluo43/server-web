<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <div class="sidebar-logo-link" v-if="collapse" key="collapse">
        <img v-if="logo" :src="logo" class="sidebar-logo hider" />
      </div>
      <div class="sidebar-logo-link" v-else key="expand">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <br />
        <h1 class="sidebar-title">{{ title }}</h1>
      </div>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/pmis-logo-small.png'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'PMIS ',
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  //margin-bottom: 5px;
  background: #fff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & .sidebar-logo {
      width: 32px;
      height: 32px;
      // height: 36px;
      /*margin: 25px 12px 12px 31px;*/
      //float: left;
    }

    & .hider {
      width: 32px;
      height: 32px;
      // margin: 25px 0px 0px 15px;
      vertical-align: middle;
    }

    & .sidebar-title {
      //  display: inline-block;
      color: #333;
      font-weight: 600;
      margin-left: 16px;
      // line-height: 32px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      // margin: 26px 0px 10px -20px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
