<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('../ruleConfig'),$store.commit('flush', new Date().toGMTString())">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
      <el-form ref="ruleForm" :rules="rule" :inline="true" :model="ruleForm" class="content" label-width="150px" label-position="left" @submit.native.prevent>
        <div>
          <el-form-item
            :rules="[
              { required: true, message: '请输入成长值规则编码', trigger: 'blur' }
            ]"
            prop="tacticsCode"
            label="成长值规则编码：">
            <el-input v-model="ruleForm.tacticsCode" clearable maxlength="20" >
              <template slot="prepend" maxlength="20">GR-</template>
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[
              { required: true, message: '请输入成长值规则名称', trigger: 'blur' }
            ]"
            prop="tacticsRemark"
            label="成长值规则名称：">
            <el-input v-model="ruleForm.tacticsRemark" clearable maxlength="30"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true,message:'请选择算方式', },]"
            prop="tacticsType"
            label="成长值计算方法：">
            <el-select v-model="ruleForm.tacticsType" placeholder="请选择">
              <el-option v-for="item of logicType" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.tacticsType === 'amount'"
            :rules="[{ required: true,message:'请输入'},
                     {type:'number',min:1,max:999999,message:'数值区间【1-99】'}
            ]"
            :label="'参数值X：'"
            label-width="80"
            prop="growthRatio"
          >
            <el-input
              v-model.number="ruleForm.growthRatio"
              :maxlength="2"
              :placeholder="'请输入参数值'"
              clearable >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.tacticsType==='regular'"
            :rules="[{ required: true,message:'请输入成长值'},
                     {type:'number',min:0,max:999999,message:'数值区间【0-999999】'}
            ]"
            prop="tacticsIntegral"
          >
            <el-input v-model.number="ruleForm.tacticsIntegral" maxlength="6" placeholder="请输入成长值"/>
          </el-form-item>
        </div>
        <div v-if="ruleForm.tacticsType === 'drift'">
          <el-form-item
            :rules="[{ required: true, message:'请输入',trigger: 'blur' },
                     {type:'number',min:1,max:999999,message:'数值区间【1-999999】'}
            ]"
            prop="tacticsIntegral"
            label="设置上限阈值：">
            <el-input v-model.number="ruleForm.tacticsIntegral" maxlength="6" placeholder="请输入" />
          </el-form-item>
        </div>

        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur' },]"
            label="设置变动频次阈值：">
            <el-select v-model="ruleForm.restrictionUnit" placeholder="请选择">
              <el-option v-for="item of frequency" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.restrictionUnit !== 'once'&&ruleForm.restrictionUnit!=='forever'"
            :rules="[{ required: true, trigger: 'blur', message: '请输入限制次数' },{type:'number',min:1,max:999999,message:'数值区间【1-999999】'}]"
            label-width="100"
            label="小于等于："
            prop="restrictionTime">
            <el-input v-model.number="ruleForm.restrictionTime" maxlength="6">
              <template slot="append">次</template>
            </el-input>

          </el-form-item>
        </div>
        <div>
          <el-form-item
            prop="growthRole"
            label="产生成长值角色："
            label-width="142px"
            class="appendEmpty">
            <el-checkbox :key="'owner'" :label="'owner'" v-model="ownerChecked" @change="ownerChange">车主</el-checkbox>
            <el-checkbox :key="'fans'" :label="'fans'" v-model="fansChecked" @change="ownerChange">粉丝</el-checkbox>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            prop="growthRatio"
            label="成长值参数比例："
            label-width="142px"
            class="appendEmpty">
            <el-radio-group v-model="owner">
              <el-row>
                <el-col :span="24">
                  <el-row>
                    <div class="grid-content bg-purple">
                      <el-radio :label="1" :style="'width: 80px'" disabled>车主与粉丝成长值比
                        <el-input-number v-model="ruleForm.ownerFansRatio" :precision="1" :step="0.1" :min="0" :max="99999" :disabled="ratioReadonly" maxlength="30" />：
                        <el-input v-model="oneRatio" disabled/>
                      </el-radio>
                    </div>
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-radio :label="0" disabled>无</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="
              [{message: '请选择', trigger: ['blur', 'change'] },
               {message: '请选择',trigger: ['blur', 'change']}
            ]"
            prop="validateDate"
            label="成长值有效期："
            label-width="142px"
            class="appendEmpty">
            <el-select v-model="ruleForm.validateDate" placeholder="请选择">
              <el-option v-for="item of years" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur',message:'请选择' },]"
            prop="tacticsFlag"
            label="成长值规则状态：">
            <el-radio-group v-model="ruleForm.tacticsFlag">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">弃用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item :rules="[{ required: true, trigger: 'blur' },]" label="设置应用范围：" >
            <el-button type="text" size="medium" @click="checkStatus">选择规则应用范围</el-button>
            <el-checkbox-group v-model="applyRange" class="unClickable">
              <template v-for="(item) of rangeList">
                <el-checkbox :key="item.key" :label="item.key">{{ item.label }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" class="dialog" title="积分规则应用范围" width="880px">
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :button-texts="['移除', '添加']"
        :titles="['全选', '全选']"
        style="text-align: left; display: inline-block"
        @change="transferChange">
        <el-form slot="left-footer" :inline="true" :model="scoreForm" label-width="100px" label-position="left" @submit.native.prevent>
          <div>
            <el-form-item label="应用平台名称：" class="second" >
              <el-input v-model="scoreForm.name" maxlength="20" clearable style="width:62%" />
              <el-button type="primary" @click="getSearchInfo">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { postAdd } from '@/api/growth'
import { getClintInfo, getITCYL, getITCWL, postTactics, deleteTactics } from '@/api/accumulate'
export default {
  name: 'Add',
  components: {
    breadcrumb
  },

  data() {
    var checkWords = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入成长值规则编码'))
      } else if (value.match('[\u4e00-\u9fa5]')) {
        callback(new Error('请输入非中文字符'))
      } else if (value.length < 5 || value.length > 20) {
        callback(new Error('请输入5-20个字母或数字'))
      } else if (value.length > value.trim().length) {
        callback(new Error('请移除空格'))
      } else {
        callback()
      }
    }
    return {
      rule: {
        tacticsCode: [{ validator: checkWords, trigger: 'blur', type: 'number' }]
      },
      ruleForm: {
        growthRatio: null,
        restrictionTime: 1,
        restrictionUnit: 'once',
        tacticsCode: '',
        tacticsFlag: 0,
        tacticsIntegral: null,
        tacticsRemark: '',
        tacticsType: '',
        tacticsVersion: 0,
        validateDate: '24',
        growthRole: '',
        ownerFansRatio: ''
      },
      saved: false,
      disabled: true,
      tacticsId: null,
      years: [
        { label: '1个月', value: '1' },
        { label: '3个月', value: '3' },
        { label: '6个月', value: '6' },
        { label: '12个月', value: '12' },
        { label: '24个月', value: '24' },
        { label: '36个月', value: '36' },
        { label: '60个月', value: '60' },
        { label: '永久有效', value: '' }
      ],
      baseForm: { },
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
      rangeList: [],
      checklist: [],
      rangeData: [],
      frequency: [
        { label: '仅1次', value: 'once' },
        { label: '每天', value: 'day' },
        { label: '每周', value: 'week' },
        { label: '每月', value: 'month' },
        { label: '不限次', value: 'forever' }
      ],
      logic: [
        { value: 'drift', label: '应用端自定义数值' },
        { value: 'regular', label: '固定积分数值' }
      ],
      type: [
        { label: '积分减少', value: 'integral_minus' },
        { label: '积分增加', value: 'integral_add' }
      ],
      owner: 0,
      oneRatio: '1',
      ratioReadonly: true,
      ownerChecked: false,
      fansChecked: false
    }
  },
  computed: {
    logicType() {
      return [
        { value: 'drift', label: '应用端自定义成长值' },
        { value: 'regular', label: '固定成长值' },
        { value: 'amount', label: '根据参数值换算' }
      ]
    }
  },
  watch: {
    tacticsId: {
      handler() {
        if (this.tacticsId) {
          getClintInfo().then(res => {
            this.rangeData = []
            for (const i of res.result) {
              this.rangeData.push({
                label: i.clientName,
                key: i.id
              })
            }
          })
          getITCYL({ tacticsId: this.tacticsId, tacticsType: 'growth' }).then(res => {
            this.applyRange = []
            for (const i of res.result) {
              this.applyRange.push(i.id)
            }
          })
        }
      },
      immediate: true
    },
    rangeList: {
      handler() {
        this.checklist = []
        for (const i of this.rangeList) {
          this.checklist.push(i.label)
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    checkStatus() {
      if (!this.tacticsId) {
        this.submitForm(() => {
          this.dialog = true
        })
      } else {
        this.dialog = true
      }
    },
    getSearchInfo() {
      getITCWL({ tacticsId: this.tacticsId, clientName: this.scoreForm.name, tacticsType: 'growth' }).then(res => {
        this.rangeData = []
        for (const i of res.result) {
          this.rangeData.push({
            key: i.clientId,
            label: i.clientName
          })
        }
        this.rangeData.push(...this.rangeList)
      })
    },
    submitForm(callback) {
      if (this.ownerChecked && this.ruleForm.ratio === '') {
        this.$message({
          message: '选择车主后必须输入成长值比例',
          type: 'error'
        })
        return
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.ownerChecked && this.fansChecked) {
            this.ruleForm.growthRole = 'all'
          } else if (this.ownerChecked) {
            this.ruleForm.growthRole = 'owner'
          } else if (this.fansChecked) {
            this.ruleForm.growthRole = 'fans'
          } else {
            this.ruleForm.growthRole = ''
          }
          const param = { ...this.ruleForm }
          param.tacticsCode = 'GR-' + param.tacticsCode

          if (this.tacticsId) {
            param.id = this.tacticsId
            callback = () => {
              this.$store.commit('flush', new Date().toGMTString())
              this.$router.push('/growth/ruleConfig')
            }
          }

          postAdd(param).then(res => {
            this.tacticsId = res.result.id
            this.disabled = false
            this.saved = true
            if (res.resultStatus !== 'FAILED') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
            if (typeof callback === 'function') {
              callback()
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    transferChange(value, direction, movedKeys) {
      if (direction === 'right') {
        for (const i of movedKeys) {
          postTactics({ tacticsId: this.tacticsId, clientId: i, tacticsType: 'growth' }).then(res => {
          })
        }
      }
      if (direction === 'left') {
        for (const i of movedKeys) {
          deleteTactics({ tacticsId: this.tacticsId, clientId: i, tacticsType: 'growth' }).then(res => {
          })
        }
      }
      this.rangeList = []
      for (const i of this.applyRange) {
        for (const j of this.rangeData) {
          if (i === j.key) {
            this.rangeList.push(j)
          }
        }
      }
    },
    ownerChange() {
      if (this.ownerChecked && this.fansChecked) {
        this.owner = 1
        this.ratioReadonly = false
      } else {
        this.owner = 0
        this.ratioReadonly = true
        this.ruleForm.ownerFansRatio = ''
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

.el-button--medium{
  padding-top: 6px;
}

.appendEmpty:before{
  display: inline;
  margin-right: 8px;
}
</style>
