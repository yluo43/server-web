<template>
  <div class="main-box">
    <div class="left">
      <div class="left-right-header">
        <div class="header-title">基本信息</div>
        <el-button v-if="!editMode" type="primary" @click="edit">编辑</el-button>
        <div v-if="editMode">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confrim">确定</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div v-if="editMode" class="form-info">
        <el-form ref="projectForm" :model="projectFormData" label-width="100px">
          <el-form-item label="项目名称:" prop="projectName">
            <el-input v-model="projectFormData.projectName" placeholder="请输入项目名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="项目经理:" prop="projectManagerId">
            <el-select v-model="projectFormData.projectManagerId" placeholder="请选择项目经理" clearable>
              <el-option v-for="item in projectManagers" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联项目:" prop="associatedProjectId">
            <el-select v-model="projectFormData.associatedProjectId" placeholder="请选择关联项目" clearable>
              <el-option v-for="item in associatedProjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称:" prop="customerId">
            <el-select v-model="projectFormData.customerId" placeholder="请选择客户名称" clearable>
              <el-option v-for="item in customerNames" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户所属集团:" prop="membershipGroup">
            <el-input v-model="projectFormData.membershipGroup" disabled clearable></el-input>
          </el-form-item>
          <el-form-item label="项目开始日期:" prop="startTime">
            <el-date-picker
              v-model="projectFormData.startTime"
              style="width: 100%"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始日期"
              clearable
            />
          </el-form-item>
          <el-form-item label="项目结束日期:" prop="endTime">
            <el-date-picker
              style="width: 100%"
              v-model="projectFormData.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择结束日期"
              clearable
            />
          </el-form-item>
          <el-form-item label="备注:" prop="notes">
            <el-input type="textarea" v-model="projectFormData.notes" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="form-info">
        <el-form ref="projectForm" :model="projectFormData" label-width="100px" class="form-item">
          <el-form-item label="项目名称:" prop="projectName">
            {{ projectFormData.projectName }}
          </el-form-item>
          <el-form-item label="项目经理:" prop="projectManagerId">
            {{ projectFormData.projectManagerId }}
          </el-form-item>
          <el-form-item label="关联项目:" prop="associatedProjectId">
            {{ projectFormData.associatedProjectId }}
          </el-form-item>
          <el-form-item label="客户名称:" prop="customerId">
            {{ projectFormData.customerId }}
          </el-form-item>
          <el-form-item label="客户所属集团:" prop="membershipGroup">
            {{ projectFormData.membershipGroup }}
          </el-form-item>
          <el-form-item label="项目开始日期:" prop="startTime">
            {{ projectFormData.startTime }}
          </el-form-item>
          <el-form-item label="项目结束日期:" prop="endTime">
            {{ projectFormData.endTime }}
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            {{ projectFormData.notes }}
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <div class="left-right-header">
        <div class="header-title">岗位单价信息</div>
      </div>
      <el-divider></el-divider>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      //是否是编辑模式
      editMode: false,
      projectFormData: {
        //项目名称
        projectName: '',
        //项目经理
        projectManagerId: '',
        //关联项目
        associatedProjectId: '',
        //客户名称
        customerId: '',
        //客户所属集团
        membershipGroupId: '',
        //开始时间
        startTime: '',
        //结束时间
        endTime: '',
        //备注
        notes: ''
      }
    }
  },

  mounted() {},
  methods: {
    edit() {
      this.editMode = true
    },
    cancel() {
      this.editMode = false
    }
  }
}
</script>
<style scoped lang="scss">
.main-box {
  height: 100%;
  margin-top: 24px;
  display: flex;
  .left {
    width: 606px;
    background: #fff;
    border-radius: 4px 4px 4px 4px;

    .form-info {
      padding: 20px 60px 60px 32px;
    }
  }
  .right {
    flex: 1;
    background: #fff;
    margin-left: 24px;
  }
  .left-right-header {
    height: 64px;
    padding: 0 24px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-title {
    font-size: 16px;
  }
}
::v-deep .el-divider--horizontal {
  margin: 0;
}
.el-select {
  width: 100%;
}
</style>
