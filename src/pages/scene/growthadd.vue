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
                <el-input v-model="ruleForm.eventCode" maxlength="20" clearable >
                  <template slot="prepend">ERG-</template>
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
                <el-input-number v-model="ruleForm.threshold" :controls="false" :min="0" :max="999999" maxlength="6" placeholder="请输入下限值" @change="changeThreshold"/>
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
                    :rules="[{ required: true, trigger: 'blur',message:'请输入最小单位值' },]"
                    :prop="'domains[' + index + '].mixCondition'"
                    style="width:350px;display:inline-block">
                    <el-input-number v-model="item.mixCondition" :min="index===0?ruleForm.threshold:ruleForm.domains[index-1].mixCondition + 1" :controls="false" :max="999999" maxlength="6" placeholder="最小单位值" @change="changeThreshold"/>
                  </el-form-item>
                  <span> 最小单位值</span>
                  <el-form-item
                    :rules="[{ required: true, trigger: 'blur',message:'请输入最大单位值' },]"
                    :prop="'domains.' + index + '.maxCondition'"
                    style="display:inline-block"
                    class="mg0">
                    <el-input-number v-model="item.maxCondition" :min="item.mixCondition+1" :controls="false" :max="999999" maxlength="6" placeholder="最大单位值" @change="changeThreshold"/>
                  </el-form-item>
                  <span>最大单位值</span>
                </el-col>
                <el-col :xl="8" :lg="24">
                  <el-form-item
                    :rules="[{ required: true, trigger: 'blur',message:'请选择对应成长值规则' },
                             {required:true,message:'请选择对应成长值规则'}
                    ]"
                    :prop="'domains[' + index + '].rule'"
                    label="对应成长值规则">
                    <el-select v-model="item.rule" placeholder="">
                      <el-option v-for="(item) of rule" :key="item.tacticsCode" :label="item.tacticsRemark" :value="item.tacticsCode"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="8" :sm="20">
                  <el-form-item
                    :rules="[{ trigger: 'blur',message:'条件增加成长值描述' },
                             {type:'string',max:50,message:'请输入50个以内文字'}
                    ]"
                    :prop="'domains[' + index + '].tacticsDesc'"
                    class="textarea"
                    label="条件增加成长值描述">
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
  name: 'GrowthAdd',
  components: {
    breadcrumb
  },
  data() {
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
        threshold: 0,
        memberNumericalIntervalDurations: []
      },
      disabled: false,
      isLastItem: true,
      rule: [
      ],
      pltform: [],
      rules: {
      }
    }
  },

  watch: {
    ruleForm: {
      deep: true,
      handler() {
        if (this.ruleForm.domains) {
          for (const i of this.ruleForm.domains) {
            i.tacticsCode = i.rule
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
      if (this.ruleForm.eventCode !== undefined) {
        this.ruleForm.eventCode = this.ruleForm.eventCode.trim()
      }
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
        message: `请设置${temp.clientName}对应成长值规则应用范围`,
        duration: 0
      })
    },
    getRuleListHandler() {
      const ruleParam = {
        clientId: this.ruleForm.pltform,
        eventType: 'growth'
      }
      getRuleList(ruleParam).then(res => {
        this.rule.length = 0
        if (res.result.length < 1) {
          for (const i of this.ruleForm.domains) {
            i.rule = ''
            i.tacticsCode = ''
            i.tacticsRemark = ''
          }
          this.showNotify(this.ruleForm.pltform)
          this.disabled = true
        } else {
          for (const i of this.ruleForm.domains) {
            i.rule = ''
            i.tacticsCode = ''
            i.tacticsRemark = ''
          }
          this.disabled = false
          // this.rule = res.result
          let flag = false
          res.result.some((item) => {
            if (item.tacticsType === 'regular') {
              this.rule.push(item)
              flag = true
            }
          })
          if (!flag) {
            this.showNotify(this.ruleForm.pltform)
            this.disabled = true
          }
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
      param.eventCode = 'ERG-' + param.eventCode
      delete param.domains
      const temp = this.pltformFilter(param.pltform)
      param.clientId = param.pltform
      param.clientName = temp.clientName
      param.eventType = 'growth'
      for (const i of param.memberNumericalIntervalDurations) {
        delete i.rule
      }

      addScene(param).then(res => {
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
          this.$router.push('/scene/growthmedia')
        }
      })
    },
    addDomains() {
      let mix = 0
      let max = 0
      for (let i = 0; i < this.ruleForm.domains.length; i++) {
        if (mix <= this.ruleForm.domains[i].mixCondition) {
          mix = this.ruleForm.domains[i].mixCondition + 1
          max = this.ruleForm.domains[i].mixCondition + 2
        }
      }
      const ruleFormDomains = {
        mixCondition: mix,
        maxCondition: max,
        rule: '',
        desc: ''
      }
      this.ruleForm.domains.push(ruleFormDomains)
      this.changeThreshold()
    },
    removeItem(item) {
      if (this.ruleForm.domains.length < 2) {
        return
      }
      var index = this.ruleForm.domains.indexOf(item)
      if (index !== -1) {
        this.ruleForm.domains.splice(index, 1)
      }
    },
    changeThreshold() {
      console.log(this.ruleForm.domains)
      console.log(this.ruleForm.threshold)
      for (let i = 0; i < this.ruleForm.domains.length; i++) {
        if (this.ruleForm.domains[i].mixCondition < this.ruleForm.threshold) {
          console.log('asd')
          this.ruleForm.domains[i].mixCondition = this.ruleForm.threshold
        }
        if (this.ruleForm.domains[i].mixCondition >= this.ruleForm.domains[i].maxCondition) {
          console.log('ccc ' + this.ruleForm.domains[i].mixCondition)
          this.ruleForm.domains[i].maxCondition = this.ruleForm.domains[i].mixCondition + 1
        }
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
