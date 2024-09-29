<template>
  <div class="el-main__mdgMainTable" style="width: 100%; height: 100%">
    <div>
      <el-table
        v-if = "showTable"
        ref="table"
        v-loading="options.tableLoading"
        :row-key="(row) => row.id"
        :cell-style="cellStyle"
        :header-cell-style="{ 'text-align': 'center' }"
        border
        stripe
        highlight-current-row
        fixed
        :data="options.dataList"
        default-expand-all
        :height="options.height"
        :max-height="options.maxHeight"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        size="mini"
        :style="{ 'min-height': options.minHeight }"
        @sort-change="__changeTableSort"
        @row-dblclick="__rowDblclick"
        @row-click="__rowClick"
        @select="__select"
        @select-all="__selectAll"
      >
        <!-- @selection-change="__handleSelectionChange" -->
        <el-table-column
          :key="9999"
          :type="type"
          v-if="type != null"
          header-align="center"
          align="center"
          width="50"
          :reserve-selection="memberTypeFlag"
        ></el-table-column>
        <template v-for="(item, index) in options.theads">
          <template v-if="item.slotName != null">
            <el-table-column
              :key="index"
              align="center"
              :label="item.label"
              :prop="item.prop"
              :show-overflow-tooltip="true"
              :formatter="item.formatter"
              :sortable="item.sortName != null"
              :min-width="item.prop === propName?getWidth(item,item.width):item.width"
              :fixed="item.fixed"
            >
              <template slot="header" slot-scope="scope">
                <!-- 使用 el-tooltip 包裹表头内容 -->
                <el-tooltip v-if="item.prop === propName" class="item" effect="black"  style="display: block;" placement="top" >
                  <div slot="content" v-html="html"></div>
                  <span>{{item.label}}</span>
                </el-tooltip>
                <div v-else>{{item.label}}</div>
              </template>
              <template slot-scope="scope">
                <div style="display: inline" @click.stop="__clickStop">
                  <slot :name="item.slotName" :item="scope.row"></slot>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :show-overflow-tooltip="true"
              :formatter="item.formatter"
              :sortable="item.sortName != null"
              :width="item.width"
              :min-width="item.minWidth"
              :fixed="item.fixed"
            >
            </el-table-column>
          </template>
        </template>
        <el-table-column type="expand" v-if="options.expandHtml != null">
          <template>
            <div v-html="options.expandHtml"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- Footer Area -->
    <div v-if="!hidePage" style="margin-top: 10px">
      <el-pagination
        style="text-align: center"
        :current-page="options.curPage"
        :page-sizes="[20, 50, 100]"
        :page-size="options.pageSize"
        :total="options.count"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="__sizeChangeHandle"
        @current-change="__currentChangeHandle"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object
    },
    type: {
      type: String,
      default: 'selection'
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    hidePage: {
      type: Boolean,
      default: false
    },
    propName: {
      type: String,
    },
    afterSelect: {
      type: Function
    },
    auth: {
      type: Boolean,
      default: true
    },
    memberTypeFlag: {
      type: Boolean,
      default: false
    },
    propHeight: {
      type: String
    },
    html: {
      type: String
    }
  },
  data() {
    return {
      options: {
        tableLoading: true,
        // 查询元数据
        data: {},
        dataList: [],
        dataListSelected: [], // 选中添加的会员类型
        expendHtml: null,
        theads: [],
        curPage: 1,
        pageSize: parseInt('20'),
        order: null,
        orderKey: null,
        count: 0,
        url: '',
        multipleSelection: [],
        height: null,
        minHeight: null
      },
      propSize: null,
      showTable: true,
      searchParams: {}
    }
  },
  created() {
    this.__initTable(this.tableData)
    this.options.tableLoading = false
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  mounted() {},
  methods: {
    cellStyle() {
      return 'text-align:center'
    },
    getWidth(item,width){
      if (!this.propSize) {
        return width
      }
      console.log(width.replace('px',''))
      return this.propSize *  width.replace('px','') + 'px'
    },
    __calculateHeight() {
      // 根据屏幕高度算表格高度
      if (this.propHeight) {
        this.options.maxHeight = this.propHeight
        this.options.height = '100%'
        this.options.minHeight = this.propHeight
      } else if (window.innerHeight < 450) {
        this.options.maxHeight = '300px'
        this.options.height = '100%'
        this.options.minHeight = '300px'
      } else {
        this.options.maxHeight = '525px'
        this.options.height = '100%'
        this.options.minHeight = '525px'
      }
    },
    __initTable(tableData) {
      this.$emit('select', [])
      this.__calculateHeight()
      Object.assign(this.options, tableData)
    },
    __sizeChangeHandle(val) {
      this.options.pageSize = val
      if (this.options.dataListSelected.length !== 0) {
        if (val === 10) {
          this.options.dataList = this.options.dataListSelected.slice(0, 10)
        } else if (val === 20) {
          this.options.dataList = this.options.dataListSelected.slice(0, 20)
        } else if (val === 30) {
          this.options.dataList = this.options.dataListSelected.slice(0, 30)
        }
      }
      this.options.curPage = 1
      this.options.order = null
      this.options.orderKey = null
      this.refresh()
    },
    // __handleSelectionChange(val) {
    //   this.$emit('select', val)
    //   this.options.multipleSelection = val
    //   if (this.afterSelect != null) {
    //     this.afterSelect()
    //   }
    // },
    // 当前页
    __currentChangeHandle(val) {
      this.$refs.table.bodyWrapper.scrollTop = 0
      this.$emit('select', [])
      this.$emit('selectData', this.options.multipleSelection)
      // this.$refs.table.clearSelection()
      this.options.curPage = val
      if (this.options.dataListSelected.length !== 0) {
        // 已选会员类型列表不为空
        if (this.options.pageSize === 10) {
          this.options.dataList = this.options.dataListSelected.slice((val - 1) * 10, (val - 1) * 10 + 10)
        } else if (this.options.pageSize === 20) {
          this.options.dataList = this.options.dataListSelected.slice((val - 1) * 20, (val - 1) * 20 + 20)
        } else if (this.options.pageSize === 30) {
          this.options.dataList = this.options.dataListSelected.slice((val - 1) * 30, (val - 1) * 30 + 30)
        }
      }
      this.refresh()
    },
    // 排序
    __changeTableSort(val) {
      // 获取字段名称和排序类型
      this.options.curPage = 1
      if (val.order === 'ascending') {
        this.options.orderKey = val.sortName
        this.options.order = 'asc'
      } else if (val.order === 'descending') {
        this.options.orderKey = val.sortName
        this.options.order = 'desc'
      } else {
        this.options.order = null
        this.options.orderKey = null
      }
      this.refresh()
    },
    // 双击
    __rowDblclick(row) {
      if (this.options.dblclick) {
        this.options.dblclick(row)
      }
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    __rowClick(row, column, event) {
      let foundIndex = this.options.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(row))
      if (foundIndex != -1) {
        this.options.multipleSelection.splice(foundIndex, 1)
        this.$refs.table.toggleRowSelection(row, false)
      } else {
        this.options.multipleSelection.push(row)
        this.$refs.table.toggleRowSelection(row)
      }
      this.$emit('selectData', this.options.multipleSelection)
      if (this.afterSelect != null) {
        this.afterSelect()
      }
    },
    selectone(row) {
      this.$refs.table.clearSelection()
      this.$refs.table.setCurrentRow(row)
      this.$refs.table.toggleRowSelection(row, true)
    },
    __select(selection, row) {
      let foundIndex = this.options.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(row))
      if (foundIndex != -1) {
        this.options.multipleSelection.splice(foundIndex, 1)
      } else {
        this.options.multipleSelection.push(row)
      }
      this.$emit('selectData', this.options.multipleSelection)
      if (this.afterSelect != null) {
        this.afterSelect()
      }
    },
    __selectAll(selection) {
      let foundIndex
      if (selection.length > 0) {
        const result = []
        this.options.dataList.forEach((ele) => {
          if (this.options.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(ele)) == -1) result.push(ele)
        })
        this.options.multipleSelection.push(...result)
      } else {
        this.options.dataList.forEach((ele) => {
          foundIndex = this.options.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(ele))
          if (foundIndex != -1) {
            this.options.multipleSelection.splice(foundIndex, 1)
          }
        })
      }
      this.$emit('selectData', this.options.multipleSelection)
    },
    __clickStop: function () {
      // 该方法为了阻止冒泡事件，没什么软用
    },
    // 获取当前选项
    getSelectRow() {
      return this.$refs.table.selection
    },
    // 只获取一条，用于单选表格
    getSingleSelectRow() {
      return this.$refs.table.selection[0]
    },
    query(params) {
      if (this.$listeners['beforeQuery']) {
        this.$emit('beforeQuery')
      }
      this.options.tableLoading = true
      let searchParams = {}
      if (params != null) {
        // 这里要clone下对象，不能直接操作外部数据
        searchParams = JSON.parse(JSON.stringify(params))
      }
      if (!this.options.url) {
        this.options.tableLoading = false
        this.$emit('refresh', this.options.curPage, this.options.pageSize)
        return
      }
      for (const key in searchParams) {
        if (searchParams[key] === '' || searchParams[key] === null) {
          delete searchParams[key]
        }
      }
      this.searchParams = searchParams
      this.$http({
        auth: this.auth,
        url: this.$http.adornUrl(this.options.url),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(searchParams, {
            curPage: this.options.curPage,
            pageSize: this.options.pageSize,
            order: this.options.order,
            orderKey: this.options.orderKey
          })
        )
      })
        .then(({ data }) => {
          if (data && data.code === 200) {
            data.page = data.payload
            this.options.dataList = data.page.list
            this.options.count = data.page.totalCount
            this.options.data = data
            this.$nextTick(() => {
              let foundIndex
              this.options.dataList.forEach((ele, index) => {
                foundIndex = this.options.multipleSelection.findIndex((item) => JSON.stringify(item) === JSON.stringify(ele))
                if (foundIndex != -1) {
                  this.$refs.table.toggleRowSelection(this.$refs.table.data[index], true)
                }
              })
            })
            if(this.propName) {
              let propSize = 0
              for (let i = 0; i < data.page.list.length; i++) {
                propSize = data.page.list[i][this.propName].length>propSize?data.page.list[i][this.propName].length:propSize
              }
              this.propSize = propSize
              this.showTable = false
              this.showTable = true
            }
          } else {
            this.options.dataList = []
            this.options.totalPage = 0
            this.$alert(data.msg)
          }
          this.options.tableLoading = false
          if (this.$listeners['afterQuery']) {
            this.$emit('afterQuery')
          }
          // 修改错位问题
          this.$nextTick(() => {
            this.$refs.table.doLayout()
          })
        })
        .catch(() => {
          this.options.tableLoading = false
        })
    },
    refresh(params) {
      // 对象为空刷新，就是找上一次的查询条件刷
      if (params == null) {
        this.query(this.searchParams)
        return
      }
      this.options.curPage = 1
      this.$nextTick(() => {
        this.query(params)
      })
    },
    showColSetPage() {
      this.$refs.tableColSetDialog.show()
      this.$nextTick(() => {
        this.$refs.tableColSetPage.init()
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.labelLevel === 0) {
        return 'all-match-row'
      } else if (row.labelLevel === 1) {
        return 'strong-match-row'
      } else if (row.labelLevel === 2) {
        return 'weak-match-row'
      }
      return ''
    }
  }
}
</script>
<style scoped>
.el-table--border {
  height: 100% !important;
}

.el-table .el-table__cell {
  text-align: center !important;
}

::v-deep .el-table__body tr.el-table__row--striped td {
  background-color: unset !important;
}

::v-deep .el-table__row {
  /*background: unset !important;*/
}

::v-deep .el-table__body tr:hover > td {
  background-color: unset !important;
}

.el-table__row >>> .all-match-row {
  background: #f59898 !important;
}

::v-deep .el-table__body tr.all-match-row td {
  background-color: #f59898 !important;
}

::v-deep .el-table__row tr.strong-match-row td {
  background-color: #e7e798 !important;
}

.el-table >>> .strong-match-row {
  background: #e7e798 !important;
}

::v-deep .el-table__body tr.weak-match-row td {
  background-color: #89ab89 !important;
}

.el-table >>> .weak-match-row {
  background: #89ab89 !important;
}

.el-table--mini .el-table__cell {
  height: 30px !important;
  padding: 0 0 !important;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 12px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #e1f1f1;
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #fff;
}
</style>
