<template>
  <component :is="type" v-bind="linkProps(to)" :style="test(to)" >
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
    /*  console.log(this.isExternal)*/
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    },
    test(to) {
      if (to !== '/index') {
        return {
          'font-weight': 'normal'
        }
      }
    }
  }
}
</script>
