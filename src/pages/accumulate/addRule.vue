<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('./')">返回</el-button>
        <el-button type="primary" @click="checkExpiration()">提交</el-button>
      </div>
      <div class="content">
        <el-form
          ref="ruleForm"
          :inline="true"
          :model="ruleForm"
          :rules="rule"
          label-width="150px"
          label-position="left"
          @submit.native.prevent
        >
          <div>
            <el-form-item prop="code" label="积分规则编码：" class="append">
              <el-input v-model="ruleForm.code" max="30" clearable placeholder="请输入" maxlength="30">
                <template slot="prepend">PR-</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[
                { required: true, message: '请输入积分规则名称', trigger: 'blur' },
                {type:'string',min:0,max:50,message:'请输入50字以内'}
              ]"
              prop="name"
              label="积分规则名称："
            >
              <el-input v-model="ruleForm.name" maxlength="30" clearable placeholder="请输入" />
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请选择积分类型'},]"
              label="积分规则类型："
              prop="type"
            >
              <el-select v-model="ruleForm.type" placeholder="请选择" @change="changeSelect">
                <el-option
                  v-for="item of type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.type==='integral_add'"
              :rules="[{ required: true},]"
              label="积分有效期："
            >
              <el-select v-model="ruleForm.years" placeholder="请选择">
                <el-option
                  v-for="item of years"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请选择计算方法'},]"
              label="选择计算方法："
              prop="logicType"
            >
              <el-select v-model="ruleForm.logicType" placeholder="请选择">
                <el-option
                  v-for="item of logic"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.logicType === 'scaler'"
              :rules="[
                { required: true,message: '参数值' },
                {type:'number',min:1,max:99,message:'数值区间为[1-99]'}]"
              prop="scalerRate"
              label="参数值 X"
            >
              <el-input
                v-model.number="ruleForm.scalerRate"
                :min="1"
                :max="99"
                maxlength="2"
                clearable
                placeholder="请输入换算比例"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.logicType === 'regular'"
              :rules="[
                { required: true,message: '请输入积分数值' },
                {type:'number',min:1,max:999999,message:'数值区间为[1-999999]'}]"
              prop="numerical"
            >
              <el-input
                v-model.number="ruleForm.numerical"
                :min="1"
                :max="999999"
                maxlength="6"
                clearable
                placeholder="请输入积分数值"
              />
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请输入', trigger: 'blur' },]"
              label="是否产生成长值："
              prop="isGrowth"
            >
              <el-radio v-model="ruleForm.isGrowth" :disabled="radioDisabled" label="0" @change="changeIsGrowth">是</el-radio>
              <el-radio v-model="ruleForm.isGrowth" :disabled="radioDisabled" label="1" @change="changeIsGrowth">否</el-radio>
            </el-form-item>
          </div>
          <div v-if="!checkAble">
            <el-form-item
              prop="growthRatio"
              label="成长值参数比例："
              label-width="142px"
              class="appendEmpty">
              <template>
                <el-row>
                  <el-col :span="24">
                    <el-row>
                      <div class="grid-content bg-purple">
                        <el-row style="width: 500px;">
                          <el-col :span="8">
                            <el-checkbox v-model="checkFans" :disabled="checkAble" @change="changeCheck">积分与粉丝成长值比
                            </el-checkbox>
                          </el-col>
                          <el-col :span="16">
                            <el-input v-model="oneRatio" disabled style="width: 50px"/>：
                            <el-input-number v-model="ruleForm.fansGrowthRatio" :precision="1" :step="0.1" :min="0" :max="99999" :disabled="ratioReadonlyFans" maxlength="30" style="width: 120px" @change="emptyToZeroByFans(ruleForm.fansGrowthRatio)"/>
                          </el-col>
                        </el-row>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row :style="'margin-top: 5px'">
                  <el-col :span="24">
                    <el-row>
                      <div class="grid-content bg-purple">
                        <el-row style="width: 500px;">
                          <el-col :span="8">
                            <el-checkbox v-model="checkOwner" :disabled="checkAble" @change="changeCheck">积分与车主成长值比
                            </el-checkbox>
                          </el-col>
                          <el-col :span="16">
                            <el-input v-model="oneRatio" disabled style="width: 50px"/>：
                            <el-input-number v-model="ruleForm.ownerGrowthRatio" :precision="1" :step="0.1" :min="0" :max="99999" :disabled="ratioReadonlyOwner" maxlength="30" style="width: 120px" @change="emptyToZeroByOwner(ruleForm.ownerGrowthRatio)"/>
                          </el-col>
                        </el-row>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-form-item>
          </div>
          <div v-if="ruleForm.logicType === 'drift'">
            <el-form-item
              :rules="[{ required: true,message: '请输入积分上限阈值' },
                       {type:'number',min:1,max:999999,message:'数值区间为[1-999999]'}]"
              label="设置积分上限阈值："
              prop="numerical"
            >
              <el-input
                v-model.number="ruleForm.numerical"
                :min="1"
                :max="999999"
                maxlength="6"
                clearable
                placeholder="请输入"
              />
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请选择变动频次阈值' },]"
              prop="frequency"
              label="设置变动频次阈值："
            >
              <el-select v-model="ruleForm.frequency" placeholder="请选择">
                <el-option
                  v-for="item of frequency"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.frequency!=='once'&&ruleForm.frequency!=='forever'"
              :rules="[{ required: true,message: '请输入频次', trigger: 'blur' },
                       {type:'number', min:1,max:999999,message: '数值区间为[1-999999]'}]"
              label="小于等于"
              class="text-right"
              prop="frequencyTime"
            >
              <el-input
                v-model.number="ruleForm.frequencyTime"
                :min="1"
                :max="999999"
                maxlength="6"
                placeholder="请输入"
              >
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请选择' },]"
              prop="expirationFlag"
              label="是否设置规则有效期："
            >
              <el-radio-group v-model="ruleForm.expirationFlag">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="ruleForm.expirationFlag===0"
              :rules="[{ required: true,message: '请输入日期', trigger: 'blur' },
                       {message: '请选择'}]"
              label="积分规则期限："
              class="text-right"
              prop="expirationDate"
            >
              <el-date-picker
                v-model="ruleForm.expirationDate"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
            <span v-if="ruleForm.expirationFlag===0" class="info">注：当日24:00:00该规则自动弃用</span>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请选择积分规则状态', trigger: 'blur' },]"
              prop="state"
              label="积分规则状态："
            >
              <el-radio-group v-model="ruleForm.state">
                <el-radio :label="0">启用</el-radio>
                <el-radio :label="1">弃用</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label-width="142px"
              label="设置应用范围："
              class="appendEmpty"
            >
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
    </div>
    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialog"
      class="dialog"
      title="积分规则应用范围"
      width="880px"
    >
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :titles="['全选', '全选']"
        :button-texts="['移除', '添加']"
        style="text-align: left; display: inline-block"
        @change="transferChange"
      >
        <el-form
          slot="left-footer"
          :inline="true"
          :model="scoreForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <div>
            <el-form-item label="应用平台名称：" class="second">
              <el-input v-model="scoreForm.name" clearable style="width:62%" placeholder="请输入" />
              <el-button type="primary" @click="getSearchInfo">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-transfer>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogExpiration"
      :before-close="handleClose"
      title="提示信息"
      width="30%"
    >
      <span>您已为此规则设置有效期，到期后将影响触点平台的应用，您确定提交此规则？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogExpiration = false,dialogExpirationFlag=false">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogExpiration = false,dialogExpirationFlag=true,handleCloseExpiration()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import {
  postAdd,
  getClintInfo,
  getITCYL,
  getITCWL,
  postTactics,
  deleteTactics
} from '@/api/accumulate'
export default {
  name: 'Add',
  components: {
    breadcrumb
  },
  data() {
    var checkWords = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入积分规则编码'))
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
        code: [{ validator: checkWords, trigger: 'blur', type: 'number' }]
      },
      tacticsId: null,
      ruleForm: {
        code: '',
        name: '',
        type: '',
        logic: '',
        frequency: '',
        state: 0,
        expirationFlag: 1,
        expirationDate: '',
        years: '',
        frequencyTime: 1,
        isGrowth: '0',
        fansGrowthRatio: '',
        ownerGrowthRatio: ''
      },
      readOnly: false,
      disabled: true,
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
      baseForm: {},
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
      rangeData: [],
      rangeList: [],
      frequency: [
        { label: '仅1次', value: 'once' },
        { label: '每天', value: 'day' },
        { label: '每周', value: 'week' },
        { label: '每月', value: 'month' },
        { label: '不限次', value: 'forever' }
      ],
      logic: [
        { value: 'drift', label: '应用端自定义数值' },
        { value: 'regular', label: '固定积分数值' },
        { value: 'scaler', label: '根据参数值换算' }
      ],
      type: [
        { label: '积分减少', value: 'integral_minus' },
        { label: '积分增加', value: 'integral_add' }
      ],
      listTCYL: [],
      dialogExpiration: false,
      dialogExpirationFlag: false,
      ratioReadonlyFans: true,
      ratioReadonlyOwner: true,
      checkAble: true,
      oneRatio: '1',
      checkFans: false,
      checkOwner: false,
      radioDisabled: false
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
          getITCYL({ tacticsId: this.tacticsId, tacticsType: 'integral' }).then(
            res => {
              this.applyRange = []
              for (const i of res.result) {
                this.applyRange.push(i.id)
              }
              this.listTCYL = res.result
            }
          )
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.changeIsGrowth()
    this.changeCheck()
  },
  methods: {
    checkExpiration() {
      if (this.ruleForm.expirationFlag === 0) {
        this.dialogExpiration = true
      } else {
        this.submitForm()
      }
    },
    handleCloseExpiration() {
      if (this.dialogExpirationFlag) {
        this.submitForm()
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
      getITCWL({
        tacticsId: this.tacticsId,
        clientName: this.scoreForm.name,
        tacticsType: 'integral'
      }).then(res => {
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
    transferChange(value, direction, movedKeys) {
      if (direction === 'right') {
        for (const i of movedKeys) {
          postTactics({
            tacticsId: this.tacticsId,
            clientId: i,
            tacticsType: 'integral'
          }).then(res => {})
        }
      }
      if (direction === 'left') {
        for (const i of movedKeys) {
          for (const j of this.listTCYL) {
            if (i === j.clientId) {
              deleteTactics({
                id: j.id,
                tacticsType: 'integral'
              }).then(res => {})
            }
          }
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

    submitForm(callback) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const temp = {
            tacticsCode: 'PR-' + this.ruleForm.code,
            tacticsRemark: this.ruleForm.name,
            changeType: this.ruleForm.type,
            tacticsType: this.ruleForm.logicType,
            tacticsIntegral: this.ruleForm.numerical,
            restrictionUnit: this.ruleForm.frequency,
            restrictionTime: this.ruleForm.frequencyTime,
            tacticsFlag: this.ruleForm.state,
            // growthValidateDate: this.ruleForm.years,
            validateDate: this.ruleForm.years,
            isGrowth: this.ruleForm.isGrowth,
            scalerRate: this.ruleForm.scalerRate,
            expirationFlag: this.ruleForm.expirationFlag,
            fansGrowthRatio: this.ruleForm.fansGrowthRatio,
            ownerGrowthRatio: this.ruleForm.ownerGrowthRatio
          }
          if (this.ruleForm.expirationDate) {
            temp.expirationDate = this.ruleForm.expirationDate + ' 23:59:59'
          }
          if (this.tacticsId) {
            temp.id = this.tacticsId
            callback = () => {
              this.$router.push('/accumulate/management')
              this.$parent.initParam(1)
              this.$parent.init()
            }
          }
          postAdd(temp).then(res => {
            if (!res.errorCode) {
              this.tacticsId = res.result.id
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
            if (callback) {
              callback()
            }
          })
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    changeIsGrowth() {
      if (this.ruleForm.isGrowth === '0') {
        // 启用成长值
        this.checkAble = false
      } else {
        // 未启用
        this.checkAble = true
        this.checkFans = false
        this.checkOwner = false
        this.ratioReadonlyFans = true
        this.ratioReadonlyOwner = true
        this.ruleForm.fansGrowthRatio = ''
        this.ruleForm.ownerGrowthRatio = ''
      }
    },
    changeCheck() {
      if (this.checkOwner) {
        this.ratioReadonlyOwner = false
      } else {
        this.ratioReadonlyOwner = true
        this.ruleForm.ownerGrowthRatio = ''
      }
      if (this.checkFans) {
        this.ratioReadonlyFans = false
      } else {
        this.ratioReadonlyFans = true
        this.ruleForm.fansGrowthRatio = ''
      }
    },
    changeSelect() {
      if (this.data.changeType === 'integral_add') {
        this.radioDisabled = false
      } else {
        this.data.isGrowth = '1'
        this.radioDisabled = true
      }
      this.changeIsGrowth()
      this.changeCheck()
    },
    emptyToZeroByFans(value) {
      if (typeof (value) === 'undefined') {
        this.ruleForm.fansGrowthRatio = ''
      }
    },
    emptyToZeroByOwner(value) {
      if (typeof (value) === 'undefined') {
        this.ruleForm.ownerGrowthRatio = ''
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
.el-form {
  text-align: left;
}
.el-select > .el-input,
.el-form-item__content {
  width: 200px;
}
.app-container {
  min-height: calc(100vh - 100px);
}

>>> .el-form-item--mini .el-form-item__label {
  font-size: 12px;
  font-weight: normal;
}
>>> .dialog {
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
  }
  .el-transfer-panel {
    width: 320px;
  }
}
.el-transfer-panel .el-transfer-panel__footer {
  bottom: inherit;
  top: 40px;
}
>>> .el-dialog .el-form-item {
  width: 100%;
  margin-top: 5px;
  text-align: center;
  overflow: hidden;
  .el-form-item__content {
    width: 100px;
  }
}
>>> .el-dialog .el-form-item.second .el-form-item__content {
  width: 184px;
}
>>> .widthAuto .el-form-item__content {
  width: auto !important;
}
.el-button--medium{
  padding-top: 6px;
}

span.info {
  color: #888;
  font-size: 80%;
}
>>> .el-transfer-panel__list{
  height: 210px;
}

.append:before{
  display: inline;
  content:'*';
      color: #F56C6C;
    margin-right: 4px;
  font-size:12px;
}

.appendEmpty:before{
  display: inline;
  margin-right: 8px;
}
</style>
