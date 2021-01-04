<template>
  <div>
    <div class="background">
      <breadcrumb />
      <div class="app-container shadow">
        <div class="content">
          <div class="flex-buttons">
            <el-button type="transparent" @click="$router.push('./')">取消</el-button>
            <el-button :disabled="disabled" type="primary" @click="submitForm">提交</el-button>
          </div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="150px" label-position="left" @submit.native.prevent>
            <div>
              <el-form-item
                :rules="[
                  { required: true, message: '请输入4-20位字母或数字', trigger: 'blur' },
                  { min: 4, max: 20,message: '请输入4-20位字母或数字',trigger: ['blur', 'change']}
                ]"
                prop="eventCode"
                label="事件Code：">
                <el-input v-model="ruleForm.eventCode" clearable >
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
                prop="pltform"
                label="选择应用平台：">
                <el-select id="pltform" v-model="ruleForm.pltform" placeholder="请选择" @change="getRuleListHandler">
                  <el-option
                    v-for="item of pltform"
                    :key="item.id"
                    :label="item.clientName"
                    :value="item.id"
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
                  <el-radio :label="0">启用</el-radio>
                  <el-radio :label="1">弃用</el-radio>
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
                label="添加数值范围条件">
                <el-button circle @click="addDomains"> <i class="el-icon-plus"/></el-button>
              </el-form-item>
            </div>
            <div v-for="(item,index) in ruleForm.domains" :key="index" class="shadow">
              <el-row :gutter="20" class="inline" >
                <el-col :xl="14" :lg="24" style="text-align: left;">
                  <el-form-item
                    :label="'范围条件'+(index+1)"

                    :prop="'domains[' + index + '].mixCondition'"
                    style="width:350px;display:inline-block">
                    <el-input v-model.number="item.mixCondition" controls-position="right" maxlength="6" placeholder="最小单位值" />
                  </el-form-item>
                  <span> 最小单位值</span>
                  <el-form-item
                    :prop="'domains.' + index + '.maxCondition'"
                    style="display:inline-block"
                    class="mg0">
                    <el-input v-model.number="item.maxCondition" :min="item.mixCondition+1" maxlength="6" controls-position="right" placeholder="最大单位值" />
                  </el-form-item>
                  <span>最大单位值</span>
                </el-col>
                <el-col :xl="8" :lg="24">
                  <el-form-item
                    :rules="[{ required: true, trigger: 'blur',message:'请选择对应积分规则' },
                             { required: true, trigger: 'change',message:'请选择对应积分规则' },
                             {required:true,message:'请选择对应积分规则'}
                    ]"
                    :prop="'domains[' + index + '].tacticsCode'"
                    label="对应积分规则">
                    <el-select v-model="item.rule" placeholder="">
                      <el-option v-for="(item) of rule" :key="item.tacticsCode" :label="item.tacticsRemark" :value="item.tacticsCode"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="8" :sm="20">
                  <el-form-item
                    :rules="[{ trigger: 'blur',message:'条件增加积分描述' },
                             {type:'string',max:50,message:'请输入50个以内文字'}
                    ]"
                    :prop="'domains[' + index + '].tacticsDesc'"
                    class="textarea"
                    label="条件增加积分描述">
                    <el-input :rows="2" v-model="item.tacticsDesc" :maxlength="50" autosize type="textarea" placeholder="请输入50个以内文字"/>
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
import { addScene, getClintList, getRuleList } from '@/api/scene'
export default {
  name: 'Add',
  components: {
    breadcrumb
  },
  data() {
    var maxCondition = (rule, value, callback) => {
      const index = rule.fullField.split('.')[1]
      const min = this.ruleForm.domains[index].mixCondition
      if (value <= min) {
        callback(new Error('数值应大于最小值'))
      } else if (typeof value !== 'number') {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    var mixCondition = (rule, value, callback) => {
      const min = this.ruleForm.threshold
      if (value < min) {
        callback(new Error('数值应大于下限值'))
      } else if (typeof value !== 'number') {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        startFlag: 0,
        domains: [
          {
            mixCondition: 0,
            maxCondition: 0,
            rule: '',
            desc: ''
          }
        ],
        memberNumericalIntervalDurations: []
      },
      maxCondition: (rule, value, callback) => {
        const index = rule.fullField.split('.')[1]
        const min = this.ruleForm.domains[index].mixCondition
        if (value <= min) {
          callback(new Error('数值应大于最小值'))
        } else if (typeof value !== 'number') {
          callback(new Error('请输入数字'))
        } else {
          callback()
        }
      },
      mixCondition: (rule, value, callback) => {
        const min = this.ruleForm.threshold
        if (value < min) {
          callback(new Error('数值应大于下限值'))
        } else {
          callback()
        }
      },
      disabled: false,
      isLastItem: true,
      rule: [
      ],
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

  watch: {
    ruleForm: {
      deep: true,
      handler() {
        if (this.ruleForm.domains) {
          for (const i of this.ruleForm.domains) {
            i.tacticsCode = i.rule ? i.rule : i.tacticsCode
            for (const j of this.rule) {
              if (i.tacticsCode === j.tacticsCode) {
                i.tacticsRemark = j.tacticsRemark
                break
              }
            }
          }
        }
        this.ruleForm.memberNumericalIntervalDurations = this.ruleForm.domains
        this.isLastItem = this.ruleForm.domains.length < 2
      }
    }
  },
  mounted() {
    getClintList().then(res => {
      this.pltform = res.result
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
    showNotify(id) {
      var temp
      for (const i of this.pltform) {
        if (i.id === id) {
          temp = i
        }
      }
      this.$notify.error({
        title: temp.clientName,
        message: `请设置${temp.clientName}对应积规则应用范围`,
        duration: 0
      })
    },
    getRuleListHandler() {
      const ruleParam = {
        clientId: this.ruleForm.pltform,
        eventType: 'integral'
      }
      getRuleList(ruleParam).then(res => {
        this.rule.length = 0
        if (res.result.length < 1) {
          for (const i of this.ruleForm.domains) {
            i.rule = '暂无数据'
          }
          this.showNotify(this.ruleForm.pltform)
          this.disabled = true
        } else {
          for (const i of this.ruleForm.domains) {
            i.rule = ''
          }
          this.disabled = false
          // this.rule = res.result
          res.result.some((item) => {
            if (item.tacticsType === 'regular') {
              this.rule.push(item)
            }
          })
        }
      })
    },
    pltformFilter(id) {
      for (const i of this.pltform) {
        if (i.id === id) {
          return { clientName: i.clientName, clientId: i.clientId }
        }
      }
    },
    addPostScene() {
      const param = { ...this.ruleForm }
      param.eventCode = 'ER-' + param.eventCode
      delete param.domains
      const temp = this.pltformFilter(param.pltform)
      param.clientId = param.pltform
      param.clientName = temp.clientName
      param.eventType = 'integral'
      addScene(param).then(res => {
        if (res.resultStatus !== 'FAILED') {
          if (res) {
            if (res.resultStatus !== undefined && res.resultStatus === 'FAILED') {
              return
            }
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success'
            })
            this.$parent.init()
            this.$router.push('/scene/media')
          }
        }
      })
    },
    addDomains() {
      const ruleFormDomains = {
        mixCondition: 0,
        maxCondition: 1,
        rule: '',
        desc: ''
      }
      const rulesDomains = {
        maxCondition: [
          { validator: this.maxCondition, trigger: 'blur', type: 'number' }
        ],
        minCondition: [
          { validator: this.minCondition, trigger: 'blur', type: 'number' }
        ]
      }
      this.ruleForm.domains.push(ruleFormDomains)
      this.rules.domains.push(rulesDomains)
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
.content{
  padding-top: 20px;
  min-height: calc(100vh - 140px);
}
  >>> .el-form-item__content{
    width:200px;
    #pltform{
      width: 200px;
    }
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
 >>> .textarea .el-form-item__content{
    width: 400px!important;
    .el-textarea__inner{

      height: 50px!important;
    }
  }
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

</style>
