<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('./')">返回</el-button>

        <el-popconfirm
          v-if="!editable&&data.expirationFlag==0"
          title="您已为此规则设置有效期，到期后将影响触点平台的应用，您确定提交此规则？"
          @onConfirm="submitForm"
          @confirm="submitForm"
        >
          <el-button slot="reference" >提交</el-button>
        </el-popconfirm>
        <el-button v-if="!editable&&data.expirationFlag==1" @click="submitForm">提交</el-button>
      </div>
      <div class="content">
        <el-form ref="ruleForm" :inline="true" :model="data" :disabled="editable" label-width="150px" label-position="left" @submit.native.prevent>

          <div class="keyvalue">
            <div class="key">更新时间:</div>
            <div class="value">{{ data.updateDate }}</div>
          </div>

          <div class="keyvalue">
            <div class="key">创建时间</div>
            <div class="value">{{ data.createDate }}</div>
          </div>
          <div class="keyvalue">
            <div class="key">操作人</div>
            <div class="value">{{ data.updateBy }}</div>
          </div>
          <div class="keyvalue">
            <div class="key append" style="margin-left: 0;width: 150px">积分规则编码</div>
            <div class="value">{{ data.tacticsCode }}</div>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="rules.tacticsRemark"
              label="积分规则名称"
              prop="tacticsRemark"
            >
              <el-input v-model="data.tacticsRemark" maxlength="50" clearable />
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message: '请选择积分规则类型' },
                       {type:'string',message: '请选择积分规则类型'}]"
              label="积分规则类型："
              prop="changeType"
            >
              <el-select v-model="data.changeType" placeholder="请选择" @change="changeSelect">
                <el-option
                  v-for="item of type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="data.changeType==='integral_add'"
              class="text-right append"
              label="积分有效期："
              prop="validateDate"
            >
              <el-select v-model="data.validateDate" placeholder="请选择">
                <el-option
                  v-for="item of years"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div >
            <el-form-item
              :rules="[{ required: true,message: '请选择' },
                       {type:'string',message: '请选择'}]"
              label="是否产生成长值："
              prop="isGrowth"
            >
              <el-radio v-model="data.isGrowth" :disabled="radioDisabled" label="0" @change="changeIsGrowth">是</el-radio>
              <el-radio v-model="data.isGrowth" :disabled="radioDisabled" label="1" @change="changeIsGrowth">否</el-radio>
            </el-form-item>
          </div>
          <div v-if="!checkAble">
            <el-form-item
              prop="growthRatio"
              label="成长值参数比例："
              class="appendEmpty"
              label-width="142px">
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
                            <el-input-number v-model="data.fansGrowthRatio" :precision="1" :step="0.1" :min="0" :max="99999" :disabled="ratioReadonlyFans" maxlength="30" style="width: 120px" @change="emptyToZeroByFans(data.fansGrowthRatio)"/>
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
                            <el-input-number v-model="data.ownerGrowthRatio" :precision="1" :step="0.1" :min="0" :max="99999" :disabled="ratioReadonlyOwner" maxlength="30" style="width: 120px" @change="emptyToZeroByOwner(data.ownerGrowthRatio)"/>
                          </el-col>
                        </el-row>
                      </div>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message: '请选择' },
                       {type:'string',message: '请选择'}]"
              label="积分计算逻辑："
              prop="tacticsType"
            >
              <el-select v-model="data.tacticsType" placeholder="请选择">
                <el-option
                  v-for="item of logicType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="data.tacticsType === 'scaler'"
              :rules="[
                { required: true,message: '参数值' },
                {type:'number',min:1,max:99,message:'数值区间为[1-99]'}]"
              prop="scalerRate"
              label="参数值 X">
              <el-input v-model.number="data.scalerRate" :min="1" :max="99" maxlength="2" clearable placeholder="请输入换算比例">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="data.tacticsType === 'regular'"
              :rules="[{ required: true,message: '请输入积分数值' },
                       {type:'number',min:1,max:999999,message:'数值区间为[1-999999]'}]"
              label="固定积分数值："
              prop="tacticsIntegral"
            >
              <el-input v-model.number="data.tacticsIntegral" maxlength="6" placeholder="请输入积分数值"/>
            </el-form-item>
          </div>
          <div v-if="data.tacticsType === 'drift'" class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message: '设置积分上限阈值' },
                       {type:'number',min:1,max:999999,message:'数值区间为[1-999999]'}]"
              label="设置积分上限阈值："
              prop="tacticsIntegral"
            >
              <el-input v-model.number="data.tacticsIntegral" maxlength="6"/>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item class="appendEmpty" label-width="142px" label="设置变动频次阈值：">
              <el-select v-model="data.restrictionUnit" placeholder="请选择">
                <el-option
                  v-for="item of frequency"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="data.restrictionUnit!=='once'&&data.restrictionUnit!=='forever'"
              :rules="[{ required: true,message: '请输入限制次数' },
                       {type:'number', min:1,max:999999,message: '数值区间为[1-999999]'}]"
              label="小于等于："
              prop="restrictionTime"
            >
              <el-input v-model.number="data.restrictionTime" :min="1" :max="999999" maxlength="6" >
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              :rules="[{ required: true,message: '请选择' },]"
              prop="expirationFlag"
              label="是否设置规则有效期：">
              <el-radio-group v-model="data.expirationFlag">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="data.expirationFlag===0"
              :rules="rules.expirationDate"
              label="积分规则期限"
              class="text-right"
              prop="expirationDate">
              <el-date-picker v-model="data.expirationDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择日期"/>
            </el-form-item>
            <span v-if="data.expirationFlag===0" class="info">注：当日24:00:00该规则自动弃用</span>
          </div>

          <div class="keyvalue">
            <div class="key">积分规则状态</div>
            <div class="value">
              <el-radio v-model="data.tacticsFlag" :label="'0'">启用</el-radio>
              <el-radio v-model="data.tacticsFlag" :label="'1'">弃用</el-radio>
            </div>
          </div>
          <div class="keyvalue">
            <div class="key">应用范围</div>
            <div class="value">
              <el-button type="text" size="medium" @click="dialog=true">选择规则应用范围</el-button>
              <el-checkbox-group v-model="checkboxList" class="unClickable">
                <template v-for="(item,index) of checkboxList" >
                  <el-checkbox :key="index" :label="item" >{{ item }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" class="dialog" title="积分规则应用范围" width="880px">
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :titles="['全选', '全选']"
        :button-texts="['移除', '添加']"
        style="text-align: left; display: inline-block"
      >
        <el-form
          slot="left-footer"
          :inline="true"
          :model="scoreForm"
          label-width="100px"
          label-position="left"
        >
          <div>
            <el-form-item label="应用平台名称：" class="second">
              <el-input v-model="scoreForm.name" clearable style="width:62%" />
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
import {
  getITCYL,
  getITCWL,
  postTactics,
  deleteTactics,
  getClintInfo,
  postAdd
} from '@/api/accumulate'
export default {
  name: 'Accumulate',
  components: {
    breadcrumb
  },

  data() {
    const expirationDate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入'))
      } else if (this.data.createDate > value) {
        callback(new Error('不能先于创建时间'))
      } else {
        callback()
      }
    }
    const rulesName = (rule, value, callback) => {
      if (value.match(/\s/)) {
        callback(new Error('请移除空格'))
      } else if (!value) {
        callback(new Error('规则名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      checkboxList: [],
      disabled: true,
      dialog: false,
      applyRange: [],
      constApplyRange: [],
      applyData: [],
      scoreForm: {
        type: null,
        name: ''
      },
      rangeData: [],
      form: {
        radio: true,
        type: '',
        checkList: [],
        frequency: null,
        years: null,
        logic: null,
        times: null,
        pay: null
      },
      isGrowth: [
        { label: '是', value: '0' },
        { label: '否', value: '1' }
      ],
      frequency: [
        { label: '仅1次', value: 'once' },
        { label: '每天', value: 'day' },
        { label: '每周', value: 'week' },
        { label: '每月', value: 'month' },
        { label: '不限次', value: 'forever' }
      ],
      logicType: [
        { value: 'drift', label: '应用端自定义数值' },
        { value: 'regular', label: '固定积分数值' },
        { value: 'scaler', label: '根据参数值换算' }
      ],
      years: [
        { label: '1个月', value: 1 },
        { label: '3个月', value: 3 },
        { label: '6个月', value: 6 },
        { label: '12个月', value: 12 },
        { label: '24个月', value: 24 },
        { label: '36个月', value: 36 },
        { label: '60个月', value: 60 },
        { label: '永久有效', value: '' }
      ],
      type: [
        { label: '积分增加', value: 'integral_add' },
        { label: '积分减少', value: 'integral_minus' }
      ],
      rules: {
        expirationDate: [
          { validator: expirationDate, trigger: 'blur' }
        ],
        tacticsRemark: [
          { validator: rulesName, trigger: 'blur' }
        ]
      },
      ratioReadonlyFans: true,
      ratioReadonlyOwner: true,
      checkAble: true,
      oneRatio: '1',
      checkFans: false,
      checkOwner: false,
      radioDisabled: false
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
    'data.expirationFlag': {
      immediate: true,
      handler(n) {
        this.data.expirationFlag = n === '' ? 1 : ~~n
      }
    },
    tacticsId: {
      handler() {
        if (this.tacticsId) {
          getITCYL({ tacticsId: this.tacticsId, tacticsType: 'integral' }).then(res => {
            this.applyRange = []
            for (const i of res.result) {
              this.applyRange.push(i.id)
            }
          })
        }
      },
      immediate: true
    },
    applyRange: {
      handler() {
        this.form.checkList = []
        this.checkboxList = []
        for (const i of this.applyRange) {
          for (const j of this.rangeData) {
            if (i === j.key) {
              this.checkboxList.push(j.label)
              this.form.checkList.push(j.label)
              this.applyData.push(j)
            }
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.tacticsId = this.data.id
    getClintInfo().then(res => {
      for (const i of res.result) {
        this.rangeData.push({
          key: i.id,
          label: i.clientName
        })
      }
      this.getYinfo()
    })
    this.data.isGrowth === '' ? this.data.isGrowth = '1' : ''
    if (this.data.isGrowth === '0') {
      if (this.data.fansGrowthRatio > 0) {
        this.checkFans = true
      }
      if (this.data.ownerGrowthRatio > 0) {
        this.checkOwner = true
      }
    }
    this.changeIsGrowth()
    this.changeCheck()
    this.changeSelect()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    getYinfo() {
      getITCYL({ tacticsId: this.data.id, tacticsType: 'integral' }).then(res => {
        for (const i of res.result) {
          this.applyRange.push(i.clientId)
          this.constApplyRange.push(i)
        }
      })
    },
    getSearchInfo() {
      getITCWL({ tacticsId: this.tacticsId, clientName: this.scoreForm.name, tacticsType: 'integral' }).then(res => {
        const temp = this.computIdLabel(this.rangeData, this.applyRange)
        var _temp = []
        for (const i of res.result) {
          _temp.push({
            key: i.clientId,
            label: i.clientName
          })
        }
        _temp = this.repeatRemove(_temp.concat(temp))
        this.rangeData = _temp
      })
    },
    computIdLabel(all, item) {
      const temp = []
      for (const i of all) {
        for (const j of item) {
          if (i.key === j) {
            temp.push(i)
          }
        }
      }
      return temp
    },
    repeatRemove(data) {
      var obj = {}
      return data.reduce((item, next) => {
        obj[next.key] ? '' : obj[next.key] = true && item.push(next)
        return item
      }, [])
    },
    difference(data1, data2) {
      // 做差集
      const _temp = []
      for (const i of data1) {
        _temp.push(i.clientId)
      }
      data1 = new Set(_temp)
      data2 = new Set(data2)
      const add = []
      const munis = []
      for (const i of data1) {
        if (!data2.has(i)) {
          munis.push(i)
        }
      }
      for (const i of data2) {
        if (!data1.has(i)) {
          add.push(i)
        }
      }
      return { munis, add }
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const data = this.difference(this.constApplyRange, this.applyRange)
          var pool = []
          this.data.expirationFlag === 1 ? delete this.data.expirationDate
            : this.data.expirationDate = this.data.expirationDate + ' 23:59:59'
          pool.push(postAdd(this.data))
          for (const i of data.add) {
            pool.push(postTactics({ tacticsId: this.tacticsId, clientId: i, tacticsType: 'integral' }))
          }
          for (const i in data.munis) {
            for (const j of this.constApplyRange) {
              if (j.clientId === data.munis[i]) {
                pool.push(deleteTactics({ id: j.id }))
              }
            }
          }
          Promise.all(pool).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$parent.init()
            this.$router.push('/accumulate/management')
          })
        }
      })
    },
    changeIsGrowth() {
      if (this.data.isGrowth === '0') {
        // 启用成长值
        this.checkAble = false
      } else {
        // 未启用
        this.checkAble = true
        this.checkFans = false
        this.checkOwner = false
        this.ratioReadonlyFans = true
        this.ratioReadonlyOwner = true
        this.data.fansGrowthRatio = ''
        this.data.ownerGrowthRatio = ''
      }
    },
    changeCheck() {
      if (this.checkOwner) {
        this.ratioReadonlyOwner = false
      } else {
        this.ratioReadonlyOwner = true
        this.data.ownerGrowthRatio = ''
      }
      if (this.checkFans) {
        this.ratioReadonlyFans = false
      } else {
        this.ratioReadonlyFans = true
        this.data.fansGrowthRatio = ''
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
        this.data.fansGrowthRatio = ''
      }
    },
    emptyToZeroByOwner(value) {
      if (typeof (value) === 'undefined') {
        this.data.ownerGrowthRatio = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.content {
  padding-top: 10px;
}
.keyvalue {
  & > div {
    &.key {
      width: 142px;
      margin-left: 8px;
    }
    &.value {
      font-size: 14px;
      text-align: left;
      width: calc(100% - 150px);
      box-shadow: none;
    }
  }
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
.el-transfer-panel__list{
  height: 210px;
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
    width: 120px;
  }
}
>>> .el-dialog .el-form-item.second .el-form-item__content {
  width: 175px;
}
>>>.widthAuto .el-form-item__content{
  width: auto!important
}
span.info{
  color: #888;
  font-size: 80%;
}
.append:before{
  display: inline;
  content:'*';
  color: #F56C6C;
  margin-right: 4px;
  font-size:12px;
}
.el-button--medium{
  padding-top: 2px;
}

.appendEmpty:before{
  display: inline;
  margin-right: 8px;
}
</style>

