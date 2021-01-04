<template>
  <div>
    <div class="background">
      <breadcrumb />
      <div class="app-container shadow">
        <div class="flex-buttons">
          <el-button type="transparent" @click="$router.push('/scene/growthmedia')">返回</el-button>
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
                prop="clientName"
                label="选择应用平台：">
                <el-select v-model="ruleForm.clientId" placeholder="请选择" @change="getRuleListHandler">
                  <el-option
                    v-for="item of pltform"
                    :key="item.id"
                    :label="item.clientName"
                    :value="item.id + ''"
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
                <el-input-number v-model="ruleForm.threshold" :controls="false" :max="999999" :min="0" maxlength="6" placeholder="请输入下限值" @change="changeThreshold"/>
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
                    :rules="[{ required: true, trigger: 'blur',message:'请输入最小单位值' },]"
                    :label="'范围条件'+(index+1)"
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
                    :prop="'domains[' + index + '].tacticsCode'"
                    label="对应成长值规则">
                    <el-select v-model="item.tacticsCode" placeholder="">
                      <el-option v-for="(item) of rule" :key="item.tacticsCode" :label="item.tacticsRemark" :value="item.tacticsCode"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xl="8" :sm="20">
                  <el-form-item label="条件增加成长值描述">
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
  name: 'GrowthDetail',
  components: {
    breadcrumb
  },
  data() {
    return {
      ruleForm: {
        threshold: 0
      },
      readOnly: true,
      isLastItem: true,
      rule: [],
      pltform: [],
      rules: {
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
        this.ruleForm.eventCode.indexOf('ERG-') > -1
          ? this.ruleForm.eventCode.split('ERG-').reverse()[0]
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
    showNotify(id) {
      var temp
      console.log(id)
      console.log(this.pltform)
      for (const i of this.pltform) {
        if (i.id + '' === id + '') {
          temp = i
        }
      }
      console.log(temp)
      this.$notify.error({
        title: temp.clientName,
        message: `请设置${temp.clientName}对应成长值规则应用范围`,
        duration: 0
      })
    },
    getRuleListHandler() {
      // console.log(this.ruleForm.clientId)
      const ruleParam = {
        clientId: this.ruleForm.clientId,
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
          this.showNotify(this.ruleForm.clientId)
          this.disabled = true
        } else {
          for (const i of this.ruleForm.domains) {
            let flag = true
            for (const j of res.result) {
              console.log(i.tacticsCode + '       ' + j.tacticsCode)
              if (i.tacticsCode === j.tacticsCode) {
                flag = false
              }
            }
            if (flag) {
              i.rule = ''
              i.tacticsCode = ''
              i.tacticsRemark = ''
            }
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
            this.showNotify(this.ruleForm.clientId)
            this.disabled = true
          }
        }
      })
    },
    addPostScene() {
      const param = { ...this.ruleForm }
      param.eventCode = 'ERG-' + param.eventCode
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
