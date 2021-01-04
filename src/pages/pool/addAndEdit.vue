<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('/pool/integralPool')">返回</el-button>
        <el-button v-if="!isDetail" @click="submitForm">提交</el-button>
      </div>
      <div class="content">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="150px"
          label-position="left"
          @submit.native.prevent>
          <el-form-item v-if="isDetail" label="创建时间：" prop="createDate" >
            <el-input v-model="form.createDate" :disabled="isDetail" maxlength="30"/>
          </el-form-item>
          <el-form-item v-if="isDetail" label="创建人：" prop="createDate" >
            <el-input v-model="form.createBy" :disabled="isDetail" maxlength="30"/>
          </el-form-item>
          <el-form-item label="积分池编码：" prop="integralPoolCode" >
            <el-input v-model.trim="form.integralPoolCode" :disabled="isDetail || $route.params.pathMatch !== ''" maxlength="30" placeholder="请输入积分池编码" />
          </el-form-item>
          <el-form-item label="积分池名称：" prop="integralPoolName">
            <el-input v-model.trim="form.integralPoolName" :disabled="isDetail" maxlength="20" placeholder="请输入积分池名称" />
          </el-form-item>
          <el-form-item v-if="isDetail" label="充值总金额(元)：" prop="rechargeLimit">
            <el-input v-model="form.rechargeLimit" disabled />
          </el-form-item>
          <el-form-item v-if="isDetail" label="充值次数：" prop="rechargeCount">
            <el-input v-model="form.rechargeCount" disabled/>
          </el-form-item>
          <el-form-item v-if="isDetail" label="分配总金额(元)：" prop="distributionAmount">
            <el-input v-model="form.distributionAmount" disabled/>
          </el-form-item>
          <el-form-item v-if="isDetail" label="分配次数：" prop="distributionCount">
            <el-input v-model="form.distributionCount" disabled/>
          </el-form-item>
          <el-form-item v-if="isDetail" label="可用金额(元)：" prop="availableAmount">
            <el-input v-model="form.availableAmount" disabled/>
          </el-form-item>
          <el-form-item v-if="!isDetail" label="描述：" prop="remark">
            <el-input v-model.trim="form.remark" :rows="8" :disabled="isDetail" :placeholder="isDetail?'':'描述'" type="textarea" maxlength="500" show-word-limit/>
          </el-form-item>
          <el-form-item v-if="isDetail" label="描述：" prop="remark">
            <div class="app-account">
              <div style="padding: 0 15px; min-height: 28px">
                <span style="font-size: 12px">{{ form.remark }}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-if="!isDetail" label="启用状态：">
            <el-radio-group v-model="form.status" :disabled="isDetail">
              <el-radio label="1">启用</el-radio>
              <el-radio label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="isDetail && appAccounts.length>0" label="分配应用积分池账户：">
            <div class="app-account">
              <div
                v-for="item in appAccounts"
                :key="item.appAccountId"
                style="padding: 0 15px;"
              >
                <el-row >
                  <el-col :span="12"><span style="font-size: 12px">{{ item.accountName }}</span></el-col>
                  <el-col :span="12" ><span style="font-size: 12px">{{ item.amountOfAll }}(元)</span></el-col>
                </el-row>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getPool, addPool, updatePool } from '@/api/integralPool'
import { getAppAccountByPoolId } from '@/api/integralPoolDetail'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'AddAndEdit',
  components: {
    breadcrumb
  },

  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        integralPoolCode: [{ required: true, message: '请输入积分池编码', trigger: 'blur' }],
        integralPoolName: [{ required: true, message: '请输入积分池名称', trigger: 'blur' }]
      },
      appAccounts: []
    }
  },
  computed: {
    isDetail() {
      return this.$store.getters.isDetail
    }
  },
  watch: {
  },
  created() {
    this.reset()
    this.getPool()
    this.getAppAccountByPoolId()
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        integralPoolCode: null,
        integralPoolName: null,
        status: '1',
        remark: null
      }
      this.resetForm('form')
    },
    getPool() {
      if (this.$route.params.pathMatch !== '') {
        getPool(this.$route.params.pathMatch).then(response => {
          response.result.params = null
          this.form = response.result
        })
      }
    },
    getAppAccountByPoolId() {
      if (this.isDetail) {
        getAppAccountByPoolId(this.$route.params.pathMatch).then(response => {
          this.appAccounts = response.result
        })
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePool(this.form).then(response => {
              if (response.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push('/pool/integralPool')
              }
            })
          } else {
            addPool(this.form).then(response => {
              if (response.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.$router.push('/pool/integralPool')
              }
            })
          }
        }
      })
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding-top: 20px;
}
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

  .el-transfer-panel{
    width: 310px;
  }
}
.el-transfer-panel .el-transfer-panel__footer{
  bottom: inherit;
  top: 40px;
}
>>>.el-dialog .el-form-item {
  width: 100%;
  margin-top:5px;
  text-align: center;
  // display: flex;
  // justify-content: space-around;

  .el-form-item__content{
    width:100px;
  }
}
>>>.el-dialog .el-form-item.second .el-form-item__content{ width:184px;}
>>> .el-transfer-panel__list{
  height: 210px;
}
>>> .el-textarea .el-input__count{
  font-size: 8px ;
  background: none;
}

.el-button--medium{
  padding-top: 6px;
}

.appendEmpty:before{
  display: inline;
  margin-right: 8px;
}
.app-account{
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  background-color: #F5F7FA;
  color: #C0C4CC;
}
</style>

