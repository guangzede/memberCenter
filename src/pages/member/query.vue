<template>
  <div>
    <div class="content border">
      <!-- <el-breadcrumb separator="/" >
        <el-breadcrumb-item :to="{ path: '/' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">高级查询</el-breadcrumb-item>
      </el-breadcrumb> -->
      <breadcrumb/>
      <div class="flex between">
        <h3>高级查询</h3>
        <div class="btns">
          <el-button plain >取消</el-button>
          <el-button >确定</el-button>
        </div>
      </div>
    </div>
    <div class="app-container shadow">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
        <el-form-item label="会员昵称" >
          <el-input v-model="ruleForm.name" clearable />
        </el-form-item>
        <el-form-item label="微信昵称">
          <el-input v-model="ruleForm.wxname" clearable />
        </el-form-item>
        <el-form-item label="用户属性">
          <el-select v-model="ruleForm.attribute" clearable />
        </el-form-item>
        <el-form-item label="积分范围">
          <el-input v-model="ruleForm.score" clearable />
        </el-form-item>
        <el-form-item label="成长值范围">
          <el-input v-model="ruleForm.growth" suffix-icon="el-icon-date" clearable />
        </el-form-item>
        <el-form-item label="关联平台">
          <el-select v-model="ruleForm.platform" placeholder="请选择">
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最近消费">

          <div class="flex short">
            <el-radio v-model="lastCost.label" :label="1">
              <el-input v-model="lastCost.time" clearable placeholder="请输入" />
              <span>天内</span>
            </el-radio>
          </div>

          <div class="flex short">
            <el-radio v-model="lastCost.label" :label="2">
              <el-input v-model="lastCost.time" clearable placeholder="请输入" />
              <span>天内</span>
              <el-input v-model="lastCost.costStart" clearable placeholder="请输入" />
              <span>-</span>
              <el-input v-model="lastCost.costEnd" clearable placeholder="请输入" />
              <span>元</span>
            </el-radio>
          </div>
          <div class="flex short">
            <el-radio v-model="lastCost.label" :label="3">
              <el-input v-model="lastCost.time" clearable placeholder="请输入" />
              <span>天内</span>
              <el-input v-model="lastCost.dateStart" type="number" clearable placeholder="请输入" />
              <span>-</span>
              <el-input v-model="lastCost.dateEnd" type="number" clearable placeholder="请输入" />
              <span>次</span>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="累计消费">
          <div class="flex short">
            <el-radio v-model="addCost.label" :label="1">
              <el-input v-model="addCost.costStart" clearable placeholder="请输入" />
              <span>-</span>
              <el-input v-model="addCost.costEnd" clearable placeholder="请输入" />
              <span>元</span>
            </el-radio>
          </div>
          <div class="flex short">
            <el-radio v-model="addCost.label" :label="2">
              <el-input v-model="addCost.timesStart" clearable placeholder="请输入" />
              <span>-</span>
              <el-input v-model="addCost.timesEnd" clearable placeholder="请输入" />
              <span>次</span>
            </el-radio>
          </div>
        </el-form-item>
        <el-form-item label="用户标签">
          <el-select v-model="ruleForm.tags" clearable />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Query',
  components: {
    breadcrumb
  },
  data() {
    return {
      ruleForm: {
        name: '',
        wxname: '',
        score: '',
        growth: '',
        platform: '',
        within: '',
        tags: [],
        attribute: []
      },
      rules: {},
      lastCost: {
        time: '',
        label: 1,
        costStart: 0,
        costEnd: 0,
        dateStart: 0,
        dateEnd: 0
      },
      addCost: {
        label: 1,
        timesStart: 0,
        timesEnd: 0,
        costStart: 0,
        costEnd: 0

      },
      platformOptions: [
        { value: 'wxapp', label: '微信小程序' },
        { value: 'APP', label: '一汽客户端' },
        { value: '选项5', label: '北京烤鸭' }
      ]

    }
  },
  watch: {
    lastCost: {
      handler(newValue, oldValue) {
        console.log(newValue.label)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  padding: 35px 30px;
}
.border{
  border-bottom: 1px solid #eee;
}
>>> .flex{
  display: flex;
  justify-content: left;
  &.between{
    margin-top: 15px;
    justify-content: space-between;
  }

  span{
    padding: 0 5px;
  }
}
.short .el-input{
  width: 100px;
  margin: 10px 0;
}
.el-select.el-select--mini,.el-form-item.el-form-item--mini,.el-form-item__content{
  width:400px;
}
</style>
