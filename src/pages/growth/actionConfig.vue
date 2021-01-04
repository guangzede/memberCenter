<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">
          积分互动类成长值设置
        </div>
      </div>
      <div class="content">
        <el-form ref="ruleForm" :inline="true" :model="form" label-width="100px" label-position="left" @submit.native.prevent>
          <el-row :gutter="0">
            <el-col :lg="8" :md="9">
              <el-form-item
                :rules="[{ required: true,message:'请输入积分数值'},
                         {type:'number',min:1,max:999999,message:'请输入合法值'}
                ]"
                label="会员积分"
                prop="integralValue" >
                <el-input v-model.number="form.integralValue" :disabled="disabled" :min="0" :maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="9">
              <el-form-item label="积分货币价值" >
                <el-input v-model.number="form.interactiveValue" disabled readonly />
              </el-form-item>
            </el-col>
            <el-col :lg="4" :md="6">
              <el-button v-if="disabled" @click="disabled=false">编辑</el-button>
              <el-button v-if="!disabled" type="transparent" @click="cancel">取消</el-button>
              <el-button v-if="!disabled" @click="submitForm">提交</el-button>
            </el-col>
          </el-row>
        </el-form>
        <p class="desc">注：互动类成长值的计算，按照积分的货币价值进行转化，
        积分货币价值即会员积分与货币价值的比例，积分货币价值与互动类成长值按1:1比例计算，通过以上2个环节的转化运算，配置会员积分与互动类成长值的比例关系。
        </p>
      </div>

    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getGrowthConfig, putGrowthConfig } from '@/api/growth'
export default {
  name: 'GrowthConfig',
  components: {
    breadcrumb
  },
  data() {
    return {
      form: {},
      data: {},
      disabled: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getGrowthConfig().then(res => {
        this.form = { ...res.result }
        this.data = { ...res.result }
      })
      this.disabled = true
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.updata()
        }
      })
    },
    updata() {
      const param = {
        id: this.form.id,
        integralValue: this.form.integralValue
      }
      putGrowthConfig(param).then(res => {
        this.init()
      })
    },
    cancel() {
      this.form = { ...this.data }
      this.disabled = !this.disabled
    }
  }
}
</script>

<style lang="scss" scoped>
  p.desc{
    margin-top: 20px;
    text-indent: 2em;
    line-height: 2em;
    text-align: left;
    color: #888;
    font-size: 14px;
  }
  .app-container{
    min-height: calc(100vh - 100px);
  }
</style>
