<template>
  <div style="height: 100%">
    <el-container style="height: 100%; width: 100%; margin: 0 10px" direction="vertical">
      <el-form ref="editPersonnelInfoForm" :rules="editPersonnelInfoFormRules" :model="editPersonnelInfoFormData" label-width="auto" class="form-item">
        <el-form-item label="人员姓名:" prop="empId">
          <el-select
            v-if="operateType == 'update'"
            v-model="editPersonnelInfoFormData.empId"
            :disabled="operateType == 'update'"
            filterable
            style="width: 80% !important"
            placeholder="请选择人员姓名"
            clearable
          >
            <el-option v-for="item in personnelList" :key="item.empId" :label="item.empId + '-' + item.name" :value="item.empId"></el-option>
          </el-select>
          <el-button v-else style="width: 290px" type="primary" plain @click="chooseTeamMember">选择人员</el-button>
        </el-form-item>
        <el-form-item label="开始支撑时间:" prop="supportDate">
          <el-date-picker
            v-model="editPersonnelInfoFormData.supportDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择开始支撑时间"
            style="width: 80% !important"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束支撑时间:" prop="endSupportDate">
          <el-date-picker
            v-model="editPersonnelInfoFormData.endSupportDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择结束支撑时间"
            style="width: 80% !important"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="投入占比:" prop="investRate">
          <el-input v-model="editPersonnelInfoFormData.investRate" style="width: 80% !important" placeholder="请输入目标利润率" clearable>
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btn-group">
        <el-button plain style="margin-right: 10px" @click="cancel()">取消</el-button>
        <el-button type="primary" @click="saveCheck">确认</el-button>
      </div>
    </el-container>
    <base-dialog ref="transferDialog" title="选择人员" :width="'700px'">
      <template>
        <tree-transfer
          :from_data="leftData"
          :to_data="rightData"
          :defaultProps="{ label: 'label' }"
          :title="['未加入项目成员', '已加入项目成员']"
          placeholder="请输入成员姓名或工号"
          @add-btn="add"
          @remove-btn="remove"
          filter
        ></tree-transfer>
        <div style="width: 100%; margin: 20px 0; display: flex; justify-content: flex-end">
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </template>
    </base-dialog>
  </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer'
import baseDialog from '@/views/modules/base/baseDialog.vue'
export default {
  components: { treeTransfer, baseDialog },
  props: {},
  data() {
    const validateInvestRate = (rule, value, callback) => {
      const regex = /^100(\.0{1,2})?$|^\d{1,2}(\.\d{1,2})?$/
      if (!value) {
        callback(new Error('请输入投入占比'))
      } else if (value > 100) {
        callback(new Error('投入占比不得超过100%'))
      } else if (value < 0) {
        callback(new Error('投入占比需大于等于0'))
      } else if (!regex.test(value)) {
        callback(new Error('投入占比最多保留2位小数'))
      } else {
        callback()
      }
    }
    const validateSupportDate = (rule, value, callback) => {
      const supportDate = this.editPersonnelInfoFormData.supportDate
      const endSupportDate = this.editPersonnelInfoFormData.endSupportDate
      if (!value) {
        callback(new Error('请选择开始支撑时间'))
      } else if (supportDate && endSupportDate && supportDate > endSupportDate) {
        callback(new Error('开始支撑时间不得大于结束支撑时间'))
      } else {
        callback()
      }
    }
    const validateEndSupportDate = (rule, value, callback) => {
      const supportDate = this.editPersonnelInfoFormData.supportDate
      const endSupportDate = this.editPersonnelInfoFormData.endSupportDate
      if (!value) {
        callback(new Error('请选择结束支撑时间'))
      } else if (supportDate && endSupportDate && supportDate > endSupportDate) {
        callback(new Error('结束支撑时间不能小于开始支撑时间'))
      } else {
        callback()
      }
    }
    return {
      leftData: [
        {
          id: '11',
          label: '团队A',
          children: [
            {
              id: '1111',
              pid: '11',
              label: '郭xx'
            },
            {
              id: '1112',
              pid: '11',
              label: '张xx'
            }
          ]
        },
        {
          id: '12',
          label: '团队B',
          children: [
            {
              id: '2222',
              pid: '12',
              label: '李xx'
              //  disabled: true,
            },
            {
              id: '2223',
              pid: '12',
              label: '赵xx'
            }
          ]
        }
      ],
      rightData: [],
      empIds: [],
      operateType: 'add',
      personnelList: [],
      editPersonnelInfoFormData: {
        id: '',
        empId: '',
        projectId: '',
        supportDate: '',
        endSupportDate: '',
        investRate: ''
      },
      editPersonnelInfoFormRules: {
        empId: [{ required: true, message: '请选择人员姓名', trigger: 'change' }],
        supportDate: [{ required: true, validator: validateSupportDate, trigger: 'change' }],
        endSupportDate: [{ required: true, validator: validateEndSupportDate, trigger: 'change' }],
        investRate: [{ required: true, validator: validateInvestRate, trigger: ['blur', 'change'] }]
      },
      treeData: [
        {
          teamId: '11',
          teamName: '团队A',
          children: [
            {
              empId: '11',
              empName: 'zhang--'
            },
            {
              empId: '22',
              empName: 'li--'
            }
          ]
        },
        {
          teamId: '12',
          teamName: '团队B',
          children: [
            {
              empId: '12',
              empName: 'guo--'
            },
            {
              empId: '23',
              empName: 'zhu--'
            }
          ]
        }
      ]
    }
  },
  watch: {
    empIds(val) {
      this.editPersonnelInfoFormData.empId = val.toString()
    }
  },
  mounted() {},
  created() {},
  methods: {
    confirm() {
      this.$refs.transferDialog.hide()
      this.empIds = []
      if (this.rightData.length > 0) {
        this.rightData.map((item) => {
          //this.deptIds.push(item.id)
          if (item.children && item.children.length > 0) {
            item.children.map((ele) => {
              this.empIds.push(ele.id)
            })
          }
        })
      }
      console.log(this.empIds)
    },

    //穿梭框打开
    chooseTeamMember() {
      this.$refs.transferDialog.show()
    },
    add() {},
    remove() {},
    //获取团队及团队下成员
    getTeamAndTeamMember() {
      this.$http({
        url: this.$http.adornUrl(''),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code == 200) {
          data.payload.map((item) => {
            if (item.children && item.children.length > 0) {
              let childrenArr = []
              item.children.map((ele) => {
                childrenArr.push({
                  id: ele.empId,
                  pid: item.teamId,
                  label: ele.empName
                })
              })
              this.leftData.push({
                id: item.teamId,
                label: item.teamName,
                children: childrenArr
              })
            } else {
              this.leftData.push({
                id: item.teamId,
                label: item.teamName
              })
            }
          })
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 初始化
    initPersonnelInfo(initData) {
      this.operateType = initData.operateType
      this.editPersonnelInfoFormData.projectId = initData.projectId
      if (initData.rowData) {
        Object.assign(this.editPersonnelInfoFormData, initData.rowData)
      }
      this.queryEmpList()
    },

    // 获取人员信息
    queryEmpList() {
      this.$http({
        url: this.$http.adornUrl('/common/getProjectMember'),
        method: 'get'
      }).then(({ data }) => {
        if (data.success) {
          this.personnelList = [...data.payload]
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 保存前校验
    saveCheck() {
      this.$refs.editPersonnelInfoForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.save()
      })
    },

    // 保存
    save() {
      let url = ''
      let method = ''
      let params = {}
      if (this.operateType === 'add') {
        if (this.empIds.length <= 0) {
          this.$message.warning('请选择要添加的人员!')
          return
        }
        url = '/costItems/member/add'
        method = 'post'
        params = JSON.parse(JSON.stringify(this.editPersonnelInfoFormData))
        delete params.empId
        params.empIds = this.empIds
        console.log(params)
      } else {
        url = '/costItems/member/update'
        method = 'put'
        params = this.$http.adornData(this.editPersonnelInfoFormData)
      }

      // this.$http({
      //   url: this.$http.adornUrl(url),
      //   method: method,
      //   data: params
      // }).then(({ data }) => {
      //   if (data.success) {
      //     this.cancel()
      //     this.$message.success('操作成功')
      //   } else {
      //     this.$message.error(data.msg)
      //   }
      // })
    },

    // 取消
    cancel() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
::v-deep .el-button.is-circle {
  border-radius: 0;
  padding: 0;
}
::v-deep .transfer-title {
  margin: 0;
}
</style>
