<template>
  <div class="el-main__mdgMainTable" style="width: 100%; height: 100%">
    <div>
      <el-table
          border
          stripe
          highlight-current-row
          fixed
          :data="options.dataList"
          :header-cell-style="{ 'text-align': 'center' }"
          default-expand-all
          :cell-style="cellStyle"
          v-loading="options.tableLoading" :height="options.height" :max-height="options.maxHeight" style="width: 100%"
          v-bind:style="{ 'min-height': options.minHeight }" @selection-change="__handleSelectionChange"
          @sort-change="__changeTableSort" @row-dblclick="__rowDblclick" @row-click="__rowClick" @select="__select"
          @select-all="__selectAll" size="mini" ref="table">
        <el-table-column
            v-if="showNum"
            align="center"
            type="index"
            width="50"
            label="序号">
        </el-table-column>
        <template v-for="(item, index) in options.theads">
          <template v-if="item.slotName != null">
            <el-table-column :key="index" :label="item.label" :prop="item.prop" :show-overflow-tooltip="true"
              :formatter="item.formatter" :sortable="item.sortName != null" :min-width="item.width">
              <template slot="header" slot-scope="scope">
                <!-- 使用 el-tooltip 包裹表头内容 -->
                <div v-if="containsName(propName,item.prop)" style="font-weight: bold" >
                  {{item.label}}
                </div>
                <div v-else>{{item.label}}</div>
              </template>
              <template slot-scope="scope">
                <div @click.stop="__clickStop" style="display: inline">
                  <slot :name="item.slotName" v-bind:item="scope.row"></slot>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column :key="index" :label="item.label" :prop="item.prop" :show-overflow-tooltip="true"
                             :formatter="item.formatter" :sortable="item.sortName != null" :width="item.width">
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
    <div v-if="!hidePage" class="foot-area">
      <el-pagination style="text-align: center" @size-change="__sizeChangeHandle" @current-change="__currentChangeHandle"
                     :current-page="options.curPage" :page-sizes="[10, 20, 30]" :page-size="options.pageSize"
                     :total="options.count"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        tableLoading: true,
        // 查询元数据
        data: {},
        dataList: [],
        expendHtml: null,
        theads: [],
        curPage: 1,
        pageSize: parseInt('10'),
        order: null,
        orderKey: null,
        count: 0,
        url: '',
        multipleSelection: [],
        height: null,
        minHeight: null
      },
      searchParams: {}
    }
  },
  props: {
    tableData: {
      type: Object
    },
    multiSelect: {
      type: Boolean,
      default: false
    },
    hidePage: {
      type: Boolean,
      default: false
    },
    showNum: {
      type: Boolean,
      default: false
    },
    afterSelect: {
      type: Function
    },
    auth: {
      type: Boolean,
      default: true
    },
    propName: {
      type: Array,
      default: function() {
        return []
      }
    },
  },
  components: {},
  created() {
    this.__initTable(this.tableData)
    this.options.tableLoading = false
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.table.doLayout()
    })
  },
  methods: {
    containsName(arr, obj){
      console.log(arr)
      console.log(obj)
      return arr.some(item => {
        return Object.keys(obj).length === Object.keys(item).length &&
            Object.keys(obj).every(key => obj[key] === item[key]);
      });
    },
    cellStyle() {
      return 'text-align:center'
    },
    __calculateHeight() {
      // 根据屏幕高度算表格高度
      if (window.innerHeight < 800) {
        this.options.maxHeight = 500
        this.options.height = '100%'
        this.options.minHeight = '300px'
      } else {
        this.options.maxHeight = 500
        this.options.height = '100%'
        this.options.minHeight = '350px'
      }
    },
    __initTable(tableData) {
      this.__calculateHeight()
      Object.assign(this.options, tableData)
    },
    __sizeChangeHandle(val) {
      this.options.pageSize = val
      this.options.curPage = 1
      this.options.order = null
      this.options.orderKey = null
      this.refresh()
    },
    __handleSelectionChange(val) {
      this.options.multipleSelection = val
      if (this.afterSelect != null) {
        this.afterSelect()
      }
    },
    // 当前页
    __currentChangeHandle(val) {
      this.options.curPage = val
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
    __rowClick(row, column, event) {
      if (!this.multiSelect) {
        // 单选
        if (
            this.$refs.table.selection == null ||
            this.$refs.table.selection[0] !== row
        ) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(row)
        } else {
          if (this.$refs.table.selection.length > 0) {
            this.$refs.table.setCurrentRow()
          }
          this.$refs.table.toggleRowSelection(row)
        }
      } else {
        // 多选
        this.$refs.table.toggleRowSelection(row)
      }
    },
    __select(selection, row) {
      if (!this.multiSelect) {
        // 单选
        this.$refs.table.clearSelection()
        if (selection.length === 0) {
          return
        }
        this.$refs.table.setCurrentRow(row)
        this.$refs.table.toggleRowSelection(row, true)
      } else {
        // 多选
        this.$refs.table.setCurrentRow(row)
      }
      if (this.afterSelect != null) {
        this.afterSelect()
      }
    },
    __selectAll(selection) {
      if (!this.multiSelect) {
        // 单选
        if (selection.length === 0) {
          return
        }
        let row = selection[0]
        this.$refs.table.clearSelection()
        this.$refs.table.setCurrentRow(row)
        this.$refs.table.toggleRowSelection(row, true)
      }
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
      if (this.options.url == null) {
        this.options.tableLoading = false
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
          .then(({data}) => {
            if (data && data.code === 200) {
              data.page = data.payload
              this.options.dataList = data.page.list
              this.options.count = data.page.totalCount
              this.options.data = data
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
          .catch((e) => {
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
    fakeData(data) {
      this.options.dataList = data.page.list
      this.options.count = data.page.totalCount
      this.options.data = data
    }
  }
}
</script>
<style lang="scss" scoped>
.el-table thead th {
  background: #cbe5ff !important;
  color: rgb(90, 89, 89);
  height: 45px;
  font-size: 15px;
  font-weight: 600;
}

.el-table .el-table__cell {
  text-align: center !important;
}
</style>
