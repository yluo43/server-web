<template>
    <div>
        <el-transfer v-model="value" :data="data"></el-transfer>
        <el-button type="primary" @click="save()">保存</el-button>
    </div>
</template>
<script>
export default {
  data() {
    const generateData = _ => {
      const data = []
      this.tableTheads.forEach(function(item, index) {
        data.push({
          key: item.prop,
          label: item.label
        })
      })
      return data
    }
    return {
      data: generateData(),
      value: []
    }
  },
  props: {
    tableTheads: {
      type: Array
    },
    tableId: {
      type: String,
      default: '1'
    }
  },
  methods: {
    init() {

    },
    save() {
      let tableSet = {
        tableId: this.tableId,
        cols: this.value
      }
      this.$alert(tableSet)
      let storage = localStorage
      // eslint-disable-next-line no-unused-vars
      let colSetArray = []
      if (storage.baseTableColSet != null) {
        colSetArray = JSON.parse()
      }
      storage.baseTableColSet = []
    }
  }
}
</script>
