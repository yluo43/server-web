<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <div class="sidebar-logo-link" v-if="collapse" key="collapse">
        <img v-if="logo" :src="logo" class="sidebar-logo hider" />
        <br />
      </div>
      <div class="sidebar-logo-link" v-else key="expand">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <br />
        <!--        <h1 class="sidebar-title">{{ title }}</h1>-->
      </div>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/logo.jpg'

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
      title: '新讯 ',
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
  height: 90px;
  margin-bottom: 5px;
  background: #4070e6;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 125px;
      /*height: 36px;*/
      /*margin: 25px 12px 12px 31px;*/
      float: left;
    }

    & .hider {
      width: 36px;
      height: 36px;
      margin: 25px 0px 0px 15px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      color: #333;
      font-weight: 600;
      line-height: 32px;
      font-size: 32px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      margin: 26px 0px 10px -20px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
