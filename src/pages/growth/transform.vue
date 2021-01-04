<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button type="transparent" @click="$router.push('../ruleConfig'),$store.commit('flush', new Date().toGMTString())">返回</el-button>
        <el-button v-if="!editable" @click="submitForm">提交</el-button>
      </div>
      <div class="content">
        <el-form ref="form" :inline="true" :model="data" :disabled="editable" label-width="150px" label-position="left" @submit.native.prevent>

          <div class="keyvalue">
            <div class="key">创建时间</div>
            <div class="value">{{ data.createDate }}</div>
          </div>
          <div class="keyvalue">
            <div class="key">成长值规则编码</div>
            <div class="value">{{ data.tacticsCode }}</div>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[
                { required: true, message: '请输入成长值规则名称', trigger: 'blur' }
              ]"
              label="成长值规则名称:"
              prop="tacticsRemark">
              <el-input v-model="data.tacticsRemark" maxlength="30"/>
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="成长值计算方法:"
              prop="tacticsType">
              <el-select v-model="data.tacticsType" placeholder="请选择">
                <el-option v-for="item of logicType" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="data.tacticsType==='amount'"
              :rules="[{ required: true,message: '请输入消费金额' },
                       {type:'number',min:1,message: '请输入正确的数值'}]"
              :label="label"
              label-width="80px"
              prop="growthRatio">
              <el-input v-model.number="data.growthRatio" :min="1" :max="99" maxlength="2">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item
              v-if="data.tacticsType==='regular'"
              :rules="[{ required: true,message:'请输入成长值'},
                       {type:'number',min:0,message:'请输入正确的数值'}
              ]"
              prop="tacticsIntegral"
            >
              <el-input v-model.number="data.tacticsIntegral" maxlength="6" placeholder="请输入成长值"/>
            </el-form-item>
          </div>
          <div v-if="data.tacticsType === 'drift'" class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请输入限制次数'},
                       {type:'number',min:1,max:999999,message:'数值区间[1-999999]'}
              ]"
              label="设置上限阈值"
              prop="tacticsIntegral"
            >
              <el-input v-model.number="data.tacticsIntegral" maxlength="6" clearable placeholder="请输入" />
            </el-form-item>
          </div>
          <div class="keyvalue">
            <el-form-item
              :rules="[{ required: true,message:'请选择'},
                       {message:'请选择'}
              ]"
              label="设置变动频次阈值："
              prop="restrictionUnit"
            >
              <el-select v-model="data.restrictionUnit" placeholder="请选择">
                <el-option v-for="item of frequency" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="data.restrictionUnit!=='once'&&data.restrictionUnit!=='forever'"
              :rules="[{ required: true,message:'请输入限制次数'},
                       {type:'number',min:1,max:999999,message:'数值区间[1-999999]'}
              ]"
              prop="restrictionTime"
              label="小于等于："
            >
              <el-input v-model.number="data.restrictionTime" :min="1" maxlength="6" clearable style="width:62%" />次
            </el-form-item>
          </div>
          <div>
            <el-form-item
              prop="growthRole"
              label="产生成长值角色："
              class="appendEmpty"
              label-width="142px">
              <el-checkbox :key="'owner'" :label="'owner'" v-model="ownerChecked" @change="ownerChange">车主</el-checkbox>
              <el-checkbox :key="'fans'" :label="'fans'" v-model="fansChecked" @change="ownerChange">粉丝</el-checkbox>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              prop="growthRatio"
              label="成长值参数比例："
              class="appendEmpty"
              label-width="142px">
              <el-radio-group v-model="owner">
                <el-row>
                  <el-col :span="24">
                    <el-row>
                      <div class="grid-content bg-purple">
                        <el-radio :label="1" :style="'width: 80px'" disabled>车主与粉丝成长值比
                          <el-input-number v-model="data.ownerFansRatio" :precision="1" :step="0.1" :min="0" :max="99999" :disabled="ratioReadonly" maxlength="30" />：
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
          <div class="keyvalue">
            <el-form-item
              v-if="data.restrictionUnit!=='once'"
              label="成长值有效期："
              label-width="142px"
              class="appendEmpty"
            >
              <el-select v-model="data.validateDate" placeholder="请选择">
                <el-option v-for="item of years" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </div>

          <div class="keyvalue">
            <div class="key">成长值规则状态</div>
            <div class="value">
              <el-radio v-model="data.tacticsFlag" :label="'0'" >启用</el-radio>
              <el-radio v-model="data.tacticsFlag" :label="'1'" >弃用</el-radio>
            </div>
          </div>
          <div class="keyvalue">
            <div class="key">应用范围</div>
            <div class="value">
              <el-button type="text" size="medium" @click="dialog=true">选择规则应用范围</el-button>
              <el-checkbox-group v-model="checkboxList" class="unClickable">
                <template v-for="(item,index) of form.checkList">
                  <el-checkbox :key="index" :label="item">{{ item }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" class="dialog" title="成长值规则应用范围" width="880px">
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :titles="['全选', '全选']"
        :button-texts="['移除', '添加']"
        style="text-align: left; display: inline-block"
        @change="transferChange">
        <el-form slot="left-footer" :inline="true" :model="scoreForm" label-width="90px" label-position="left" @submit.native.prevent>
          <div>
            <el-form-item label="应用平台名称：" class="second" >
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
import { getITCYL, getITCWL, postTactics, deleteTactics, getClintInfo } from '@/api/accumulate'
import { postAdd } from '@/api/growth'
export default {
  name: 'Accumulate',
  components: {
    breadcrumb
  },
  data() {
    return {
      checkboxList: [],
      disabled: true,
      dialog: false,
      applyRange: [],
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
      frequency: [
        { label: '仅1次', value: 'once' },
        { label: '每天', value: 'day' },
        { label: '每周', value: 'week' },
        { label: '每月', value: 'month' },
        { label: '不限次', value: 'forever' }
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
      type: [{ label: '积分增加', value: 'integral_add' }, { label: '积分减少', value: 'integral_minus' }],
      rangeList: [],
      owner: 0,
      oneRatio: '1',
      ratioReadonly: true,
      ownerChecked: false,
      fansChecked: false
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    },
    editable() {
      return this.$store.getters.editable
    },

    logicType() {
      return [
        { value: 'drift', label: '应用端自定义成长值' },
        { value: 'regular', label: '固定成长值' },
        { value: 'amount', label: '根据参数值换算' }
      ]
    },
    label() {
      return ' 参数值 X'
    }
  },
  mounted() {
    this.getRange()
    if (this.data.growthRole === 'all') {
      this.owner = 1
      this.ownerChecked = true
      this.fansChecked = true
      this.ratioReadonly = false
    } else if (this.data.growthRole === 'owner') {
      this.ownerChecked = true
      this.owner = 1
      this.ratioReadonly = true
    } else if (this.data.growthRole === 'fans') {
      this.fansChecked = true
      this.owner = 0
      this.ratioReadonly = true
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    getRange() {
      this.applyRange = []
      this.rangeData = []
      this.rangeList = []
      this.form.checkList = []
      getITCYL({ tacticsId: this.data.id, tacticsType: 'growth' }).then(res => {
        for (const i of res.result) {
          this.form.checkList.push(i.clientName)
          this.applyRange.push(i.clientId)
        }
        this.checkboxList = [...this.form.checkList]
        this.rangeList = [...res.result]
      })
      getClintInfo().then(res => {
        for (const i of res.result) {
          this.rangeData.push({
            label: i.clientName,
            key: i.id
          })
        }
      })
    },
    getSearchInfo() {
      getITCWL({ tacticsId: this.data.id, clientName: this.scoreForm.name, tacticsType: 'growth' }).then(res => {
        this.rangeData = []
        for (const i of res.result) {
          this.rangeData.push({
            key: i.clientId,
            label: i.clientName
          })
        }
        for (const i of this.rangeList) {
          this.rangeData.push({
            key: i.clientId,
            label: i.clientName
          })
        }
        // this.rangeData.push(...this.rangeList)
      })
    },
    updataRule() {
      postAdd(this.data).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.$store.commit('flush', new Date().toGMTString())
        this.$router.push('/growth/ruleConfig')
      })
    },
    submitForm() {
      if (this.ownerChecked && this.fansChecked && this.ratio === '') {
        this.$message({
          message: '选择车主后必须输入成长值比例',
          type: 'error'
        })
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.ownerChecked && this.fansChecked) {
            this.data.growthRole = 'all'
          } else if (this.ownerChecked) {
            this.data.growthRole = 'owner'
          } else if (this.fansChecked) {
            this.data.growthRole = 'fans'
          } else {
            this.data.growthRole = ''
          }
          this.updataRule()
        }
      })
    },
    transferChange(value, direction, movedKeys) {
      if (direction === 'right') {
        for (const i of movedKeys) {
          postTactics({ tacticsId: this.data.id, clientId: i, tacticsType: 'growth' }).then(res => {
            this.checkItem()
          })
        }
      }
      if (direction === 'left') {
        for (const i of movedKeys) {
          for (const j of this.rangeList) {
            if (i === j.clientId) {
              deleteTactics({ id: j.id, tacticsType: 'growth' }).then(res => {
                this.checkItem()
              })
            }
          }
        }
      }
    },
    checkItem() {
      getITCYL({ tacticsId: this.data.id, tacticsType: 'growth' }).then(res => {
        this.form.checkList = []
        for (const i of res.result) {
          this.form.checkList.push(i.clientName)
        }
        this.checkboxList = [...this.form.checkList]
        this.rangeList = [...res.result]
      })
    },
    ownerChange() {
      if (this.ownerChecked && this.fansChecked) {
        this.owner = 1
        this.ratioReadonly = false
      } else {
        this.owner = 0
        this.ratioReadonly = true
        this.data.ownerFansRatio = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.content {
   padding-top: 20px;
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
  .el-transfer-panel .el-transfer-panel__footer{
    height: 40px
  }
  .el-transfer-panel__list{
    height: 210px;
  }
  .el-transfer-panel{
    width: 300px;
  }
}
.el-transfer-panel .el-transfer-panel__footer{
  bottom: inherit;
  top: 40px;
}
>>>.el-dialog .el-form-item {
  width: 100%;
    margin-top: 5px;
  text-align: center;
  overflow: hidden;
  .el-form-item__content{
    width:120px;
  }
}
>>>.el-dialog .el-form-item.second .el-form-item__content{ width:175px;}
.appendEmpty:before{
  display: inline;
  margin-right: 8px;
}

.el-button--medium{
  padding-top: 2px;
}
</style>
