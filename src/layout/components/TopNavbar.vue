<template>
  <div>
    <div class="topnavbar">

      <breadcrumb class="breadcrumb-container"/>

    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {

  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  }

}
</script>

<style lang="scss" scoped>
.topnavbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  z-index: 100;
  margin-left: 4px;
  margin-right: 300px;

  .breadcrumb-container {
    float: left;
    /* margin-top: -10px;*/
  }
}

.customWidth {
  min-width: 700px;
}
</style>
