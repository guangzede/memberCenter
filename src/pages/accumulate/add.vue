<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <el-form ref="ruleForm" :inline="true" :model="ruleForm" class="content" label-width="150px" label-position="left" @submit.native.prevent>
        <div>
          <el-form-item
            :rules="[
              { required: true, message: '请输入积分规则名称', trigger: 'blur' },
            ]"
            label="积分规则名称：">
            <el-input v-model="ruleForm.name" clearable />
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur' },]"
            label="积分规则类型：">
            <el-select v-model="ruleForm.type" placeholder="请选择">
              <el-option v-for="item of type" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur' },]"
            label="选择计算逻辑：">
            <el-select v-model="ruleForm.logic" placeholder="请选择">
              <el-option v-for="item of logic" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur' },]"
            label="设置变动频次阈值">
            <el-select v-model="ruleForm.logic" placeholder="请选择">
              <el-option v-for="item of logic" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur' },]"
            label="积分规则状态">
            <el-radio-group v-model="ruleForm.state">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">弃用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur' },]"
            label="设置应用范围">
            <el-button type="text" @click="dialog=true">选择规则应用范围</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" class="dialog" title="积分规则应用范围" width="80%">
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :titles="['全选', '全选']"
        :button-texts="['移除', '添加']"
        style="text-align: left; display: inline-block">
        <el-form slot="left-footer" :inline="true" :model="scoreForm" label-width="100px" label-position="left" @submit.native.prevent>
          <div>
            <el-form-item label="应用平台类型：">
              <el-select v-model="scoreForm.type" placeholder="请选择" width="100">
                <el-option v-for="item of scoreType" :key="item.value" :label="item.label" :value="item.value" width="100"/>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="应用平台名称：" class="second" >
              <el-input v-model="scoreForm.name" clearable style="width:62%" />
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Add',
  components: {
    breadcrumb
  },
  data() {
    return {
      ruleForm: {
        name: null,
        type: null,
        logic: null,
        frequency: null,
        state: null
      },
      baseForm: {

      },
      scoreForm: {
        type: null,
        name: ''
      },
      scoreType: [
        { value: 'pc', label: 'pc端网站' },
        { value: 'wx', label: '微信公众号' },
        { value: 'wxpro', label: '微信小程序' },
        { value: 'app', label: '移动app' },
        { value: 'h5', label: '单一H5' }
      ],
      dialog: false,
      applyRange: [],
      rangeData: [
        { label: '红旗APP', value: 'app' },
        { label: '红旗微店小程序', value: 'pro' },
        { label: '红旗公众号', value: 'public' }
      ],
      frequency: [
        { label: '仅1次', value: 0 },
        { label: '每天', value: 1 },
        { label: '每周', value: 2 },
        { label: '每月', value: 3 },
        { label: '不限次', value: 4 }
      ],
      logic: [
        { label: '不限规则数值', value: 0 },
        { label: '固定计算数值', value: 1 },
        { label: '指标基数运算', value: 2 }
      ],
      type: [
        { label: '积分增加', value: 1 },
        { label: '积分减少', value: 0 }
      ]
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }

  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: left;
}
.el-form{
  text-align: left;
}
.el-select>.el-input, .el-form-item__content{
  width:200px;
}
.app-container{
  min-height: calc( 100vh - 100px);
}

>>>.el-form-item--mini .el-form-item__label{
  font-size: 12px;
  font-weight: normal;
}
>>>.dialog{
  .el-transfer-panel .el-transfer-panel__footer{
    height: 80px
  }
  .el-transfer-panel{
    width: 300px;
  }
}
.el-transfer-panel .el-transfer-panel__footer{
  bottom: inherit;
  top: 40px;
}
>>>.el-dialog .el-form-item {
  width: 100%;
  // display: flex;
  // justify-content: space-around;

  .el-form-item__content{
    width:100px;
  }
}
>>>.el-dialog .el-form-item.second .el-form-item__content{ width:184px;}
</style>
