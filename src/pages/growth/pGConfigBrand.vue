<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">
          积分与成长值参数配置（品牌）
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
                label="积分"
                prop="integral_value" >
                <el-input v-model.number="form.integral_value" :disabled="disabled" :min="0" :maxlength="6" />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="9">
              <el-form-item label="成长值" >
                <el-input v-model.number="form.growth_value" disabled readonly />
              </el-form-item>
            </el-col>
            <el-col :lg="4" :md="6">
              <el-button v-if="disabled" @click="disabled=false">编辑</el-button>
              <el-button v-if="!disabled" type="transparent" @click="cancel">取消</el-button>
              <el-button v-if="!disabled" @click="submitForm">提交</el-button>
            </el-col>
          </el-row>
        </el-form>
        <p class="desc"> 注：可以任意调整积分对成长值的比例，调整后影响新产生的积分，不影响历史。
        </p>
      </div>

    </div>
  </div>

</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { selectPGScale, savePGScale } from '@/api/growth'
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
  computed: {
    login_user() {
      return this.$store.getters.user.loginName
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      selectPGScale().then(res => {
        this.form = { ...res.data }
        this.data = { ...res.data }
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
        integral_value: this.form.integral_value,
        growth_value: this.form.growth_value,
        login_user: this.login_user
      }
      savePGScale(param).then(res => {
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
