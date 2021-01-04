<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="flex-buttons">
        <el-button>返回</el-button>
        <el-button>保存</el-button>
      </div>
      <div class="content">
        <el-form ref="form" :inline="true" :model="form" @submit.native.prevent >

          <div class="keyvalue">
            <div class="key">创建时间</div>
            <div class="value">2019年12月11日16:08:00</div>
          </div>
          <div class="keyvalue">
            <div class="key append">积分规则编码</div>
            <div class="value">HQAPP000</div>
          </div>
          <div class="keyvalue">
            <div class="key">积分规则名称</div>
            <div class="value">参与产品调研</div>
          </div>
          <div class="keyvalue">
            <div class="key">积分规则类型</div>
            <div class="value">
              <el-form-item >
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option v-for="item of type" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.type===1" label="积分有效期：">
                <el-select v-model="form.years" placeholder="请选择">
                  <el-option v-for="item of years" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="keyvalue">
            <div class="key">积分计算逻辑</div>
            <div class="value">
              <el-form-item>
                <el-select v-model="form.logic" placeholder="请选择">
                  <el-option v-for="item of logicType" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.logic === 2">
                <el-input v-model="form.numerical" clearable placeholder="请输入积分数值" />
              </el-form-item>
              <el-form-item v-if="form.logic === 0">
                <el-select v-model="form.pay" placeholder="请选择">
                  <el-option v-for="item of pay" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
                &nbsp;x&nbsp;
                <el-input v-model="form.numerical" clearable style="width:150px">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
          <div class="keyvalue">
            <div class="key">设置变动频次阈值</div>
            <div class="value">
              <el-form-item >
                <el-select v-model="form.frequency" placeholder="请选择">
                  <el-option v-for="item of frequency" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="小于等于：" >
                <el-input v-model="form.times" clearable style="width:62%" />
              </el-form-item>
            </div>
          </div>

          <div v-if="form.logic ===1" class="keyvalue">
            <div class="key">设置积分上限阈值</div>
            <div class="value">
              <el-input v-model="form.times" clearable style="width:62%" />
            </div>
          </div>
          <div class="keyvalue">
            <div class="key">积分规则状态</div>
            <div class="value">
              <el-radio v-model="form.radio" :label="false">启用</el-radio>
              <el-radio v-model="form.radio" :label="true">弃用</el-radio>
            </div>
          </div>
          <div class="keyvalue">
            <div class="key">应用范围</div>
            <div class="value">
              <el-checkbox-group v-model="form.checkList" :disabled="disabled">
                <template v-for="(item,index) of checkboxList">
                  <el-checkbox :key="index" :label="item"/>
                </template>
              </el-checkbox-group>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Editor',
  components: {
    breadcrumb
  },
  data() {
    return {
      checkboxList: ['红旗APP', '红旗微店小程序', '红旗公众号'],
      disabled: true,
      form: {
        radio: true,
        type: 1,
        checkList: [],
        frequency: null,
        years: null,
        logic: null,
        times: null,
        pay: null
      },
      pay: [
        { value: 0, label: '购车指导价' },
        { value: 1, label: '商城支付金额' },
        { value: 2, label: '非商城支付金额' }
      ],
      frequency: [
        { label: '仅1次', value: 0 },
        { label: '每天', value: 1 },
        { label: '每周', value: 2 },
        { label: '每月', value: 3 },
        { label: '不限次', value: 4 }
      ],
      logicType: [
        { value: 0, label: '根据指标运算' },
        { value: 1, label: '不设置计算规则' },
        { value: 2, label: '固定积分数值' }
      ],
      years: [
        { label: '0.5年', value: '0.5' },
        { label: '1年', value: '1' },
        { label: '2年', value: '2' },
        { label: '3年', value: '3' },
        { label: '5年', value: '5' }
      ],
      type: [{ label: '积分增加', value: 1 }, { label: '积分减少', value: 0 }]
    }
  }
}
</script>

<style lang="scss" scoped>
.keyvalue {
  & > div {
    &.key {
      width: 150px;
    }
    &.value {
      text-align: left;
      width: calc(100% - 150px);
      box-shadow: none;
    }
  }
}
.append:before{
  display: inline;
  content:'*';
  color: #F56C6C;
  margin-right: 4px;
  font-size:12px;
}
</style>
