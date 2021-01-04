<template>
  <div>
    <div class="background">
      <breadcrumb />
      <div class="app-container shadow">
        <div class="flex-buttons">
          <el-button type="transparent" @click="$router.push('/scene/media')">返回</el-button>
          <el-button v-if="!editable" type="primary" @click="submitForm">提交</el-button>
        </div>
        <div class="content">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="editable" label-width="150px" label-position="left" @submit.native.prevent>
            <div>
              <el-form-item
                :rules="[
                  { required: true, message: '请输入4-20位字母或数字', trigger: 'blur' },
                  { min: 4, max: 20,message: '20位字母或数字',trigger: ['blur', 'change']}
                ]"
                prop="eventCode"
                label="事件Code：">
                <el-input v-model="ruleForm.eventCode" maxlength="20" clearable >
                  <template slot="prepend">ER-</template>
                </el-input>
              </el-form-item>
            </div>
            <div>
              <el-form-item
                :rules="[
                  { required: true, message: '请输入30以内文字', trigger: 'blur' },
                  { min: 1, max: 30,message: '请输入30以内文字',trigger: ['blur', 'change']}
                ]"
                prop="eventName"
                label="事件名称:">
                <el-input v-model="ruleForm.eventName" maxlength="30" clearable />
              </el-form-item>
            </div>
            <div>
              <el-form-item
                :rules=" [
                  { required: true,message: '请选择' },
                ]"
                prop="clientName"
                label="选择应用平台：">
                <el-select v-model="ruleForm.clientName" placeholder="请选择" @change="getRuleListHandler">
                  <el-option
                    v-for="item of pltform"
                    :key="item.clientId"
                    :label="item.clientName"
                    :value="item.clientName"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div>
              <el-form-item
                :rules="[{ required: true, trigger: 'blur',message:'请选择' },]"
                prop="startFlag"
                label="事件规则状态：">
                <el-radio-group v-model="ruleForm.startFlag">
                  <el-radio :label="'0'">启用</el-radio>
                  <el-radio :label="'1'">弃用</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div>
              <el-form-item
                :rules="[{ required: true, trigger: 'blur',message:'请输入下限值' },
                         {type:'number',min:0,max:999999,required:true,message:'请输入正整数'}
                ]"
                prop="threshold"
                label="下限值"
              >
                <el-input v-model.number="ruleForm.threshold" maxlength="6" placeholder="请输入下限值" />
              </el-form-item>
            </div>
            <div>
              <el-form-item
                :rules="[{ required: true, trigger: 'blur',message:'请选择' },]"

                prop="domains"
                label="增加时长设置">
                <el-button circle @click="addDomains"> <i class="el-icon-plus"/></el-button>
              </el-form-item>
            </div>
            <div v-for="(item,index) in ruleForm.domains" :key="index" class="shadow-item">
              <el-row :gutter="20" class="inline" >
                <el-col :xl="14" :lg="24" style="text-align: left;">
                  <el-form-item
                    :label="'范围条件'+(index+1)"
                    :prop="'domains[' + index + '].mixCondition'"
                    style="width:350px;display:inline-block">
                    <el-input v-model.number="item.mixCondition" maxlength="6" placeholder="最小时长" />
                  </el-form-item>
                  <span> 最小单位值</span>
                  <el-form-item

                    :prop="'domains.' + index + '.maxCondition'"
                    style="display:inline-block"
                    class="mg0">
                    <el-input v-model.number="item.maxCondition" :min="item.mixCondition+1" maxlength="6" placeholder="最大时长" />
                  </el-form-item>
                  <span>最大单位值</span>
                </el-col>
                <el-col :xl="8" :lg="24">
                  <el-form-item
                    :rules="[{ required: true, trigger: 'blur',message:'请选择对应积分规则' },
                             {required:true,message:'请选择对应积分规则'}
                    ]"
                    :prop="'domains[' + index + '].tacticsCode'"
                    label="对应积分规则">
                    <el-select v-model="item.tacticsCode" placeholder="">
                      <el-option v-for="(item) of rule" :key="item.tacticsCode" :label="item.tacticsRemark" :value="item.tacticsCode"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="8" :sm="20">
                  <el-form-item label="条件增加积分描述">
                    <el-input v-model="item.tacticsDesc" :maxlength="50" placeholder="请输入50个以内文字" />
                  </el-form-item>
                </el-col>
                <el-col :sm="2" >
                  <el-button v-if="!isLastItem" type="text" @click.prevent="removeItem(item)">删除</el-button>
                </el-col>
              </el-row>
            </div>

          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { putScene, getClintList, getRuleList, getSceneDetail } from '@/api/scene'
export default {
  name: 'Add',
  components: {
    breadcrumb
  },
  data() {
    var maxCondition = (rule, value, callback) => {
      const index = rule.fullField.split('.')[1]
      const min = this.ruleForm.domains[index].mixCondition
      if (typeof value !== 'number') {
        callback(new Error('请输入数字'))
      } else if (value < min) {
        callback(new Error('数值应大于最小值'))
      } else if (typeof value !== 'number') {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    var mixCondition = (rule, value, callback) => {
      const min = this.ruleForm.threshold
      if (typeof value !== 'number') {
        callback(new Error('请输入数字'))
      } else if (value < min) {
        callback(new Error('数值应大于下限值'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
      },
      maxCondition: (rule, value, callback) => {
        const index = rule.fullField.split('.')[1]
        const min = this.ruleForm.domains[index].mixCondition
        if (typeof value !== 'number') {
          callback(new Error('请输入数字'))
        } else if (value < min) {
          callback(new Error('数值应大于最小值'))
        } else if (typeof value !== 'number') {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      },
      mixCondition: (rule, value, callback) => {
        const min = this.ruleForm.threshold
        if (typeof value !== 'number') {
          callback(new Error('请输入数字'))
        } else if (value < min) {
          callback(new Error('数值应大于下限值'))
        } else {
          callback()
        }
      },
      readOnly: true,
      isLastItem: true,
      rule: [],
      pltform: [],
      rules: {
        domains: [
          {
            maxCondition: [
              { validator: maxCondition, trigger: 'blur', type: 'number' }
            ],
            mixCondition: [
              { validator: mixCondition, trigger: 'blur', type: 'number' }
            ]
          }

        ]
      }
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    },
    editable() {
      return this.$store.getters.editable
    }
  },
  watch: {
    ruleForm: {
      deep: true,
      handler() {
        this.ruleForm.memberNumericalIntervalDurations = this.ruleForm.domains
        this.isLastItem = this.ruleForm.domains.length < 2
      }
    }
  },
  mounted() {
    getClintList().then(res => {
      this.pltform = res.result
    })
    getSceneDetail({ id: this.data.id }).then(res => {
      this.ruleForm = { ...res.result }
      const domains = this.ruleForm.memberNumericalIntervalDurations ? this.ruleForm.memberNumericalIntervalDurations : []
      this.$set(this.ruleForm, 'domains', domains)
      this.ruleForm.eventCode =
        this.ruleForm.eventCode.indexOf('ER-') > -1
          ? this.ruleForm.eventCode.split('ER-').reverse()[0]
          : this.ruleForm.eventCode
      window.eventCode = this.ruleForm.eventCode
      this.getRuleListHandler()
    })
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.addPostScene()
        }
      })
    },
    showNotify(name) {
      this.$notify.error({
        title: name,
        message: `请设置${name}对应积规则应用范围`,
        duration: 0
      })
    },
    getRuleListHandler() {
      // console.log(this.ruleForm.clientId)
      const ruleParam = {
        clientId: this.ruleForm.clientId,
        eventType: 'integral'
      }
      getRuleList(ruleParam).then(res => {
        this.rule = []
        for (const i of this.ruleForm.domains) {
          let flag = true
          for (const j of res.result) {
            if (i.tacticsCode === j.tacticsCode) {
              flag = false
            }
          }
          if (flag) {
            i.tacticsCode = ''
          }
        }
        if (res.result.length < 1) {
          this.disabled = true
        } else {
          this.disabled = false
          res.result.some((item) => {
            if (item.tacticsType === 'regular') {
              this.rule.push(item)
            }
          })
        }
      })
    },
    addPostScene() {
      const param = { ...this.ruleForm }
      param.eventCode = 'ER-' + param.eventCode
      if (this.ruleForm.memberNumericalIntervalDurations) {
        for (const i of this.ruleForm.memberNumericalIntervalDurations) {
          for (const j of this.rule) {
            if (i.tacticsCode === j.tacticsCode) {
              i.tacticsRemark = j.tacticsRemark
              break
            }
          }
        }
      }
      delete param.domains
      for (const i of param.memberNumericalIntervalDurations) {
        delete i.rule
      }

      putScene(param).then(res => {
        if (res) {
          if (res.resultStatus !== undefined && res.resultStatus === 'FAILED') {
            return
          }
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success'
          })
          this.$router.push('/scene/media')
        }
      })
    },
    addDomains() {
      this.ruleForm.domains.push({
        mixCondition: 0,
        maxCondition: 1,
        rule: '请选择',
        desc: ''
      })
      this.rules.domains.push({
        maxCondition: [
          { validator: this.maxCondition, trigger: 'blur', type: 'number' }
        ],
        minCondition: [
          { validator: this.minCondition, trigger: 'blur', type: 'number' }
        ]
      })
    },
    removeItem(item) {
      if (this.ruleForm.domains.length < 2) {
        return
      }
      var index = this.ruleForm.domains.indexOf(item)
      if (index !== -1) {
        this.ruleForm.domains.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  >>> .el-form-item__content{
    width:200px;
  }
  >>>.mg0{
    text-align: left;
    .el-form-item__content{
      margin: 0 !important;
    }

  }
  .inline{
    span{
      padding: 0 10px;
      font-size: 12px;
    }
  }
  .el-row{
    box-sizing: border-box;
  }
  .el-notification .el-icon-close:before{
    color: #000;
  }
  .el-input-number--mini{
    width:auto!important;
  }
  .shadow-item{
    box-shadow: 0px 0px 4px 0px #c4c4c4;
    padding: 20px;
    margin-bottom: 30px;
  }
  .content{
    padding: 20px;
  }
</style>
