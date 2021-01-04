<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <el-row>
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员活跃数</span>
              </div>
              <div>
                <el-form
                  ref="activeForm"
                  :model="activeForm"
                  label-width="100px"
                  label-position="left"
                  @submit.native.prevent
                >
                  <el-row :gutter="20">
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-form-item
                        :rules="rules.date"
                        label="时间范围"
                        prop="dateInterval">
                        <el-date-picker
                          v-model="activeForm.dateInterval"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"/>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-form-item
                        :rules="rules.dimension"
                        label="查询维度"
                        prop="dimension">
                        <el-select v-model="activeForm.dimension" clearable style="width: 200px">
                          <el-option
                            v-for="item in dimension"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-button type="primary" @click="requestActiveCount()">查询</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <div id="memberActiveCount"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>积分变动情况</span>
              </div>
              <div>
                <el-form
                  ref="integralChangeForm"
                  :model="integralChangeForm"
                  label-width="100px"
                  label-position="left"
                  @submit.native.prevent
                >
                  <el-row :gutter="20">
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-form-item
                        :rules="rules.date"
                        label="时间范围"
                        prop="dateInterval">
                        <el-date-picker
                          v-model="integralChangeForm.dateInterval"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"/>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-form-item
                        :rules="rules.dimension"
                        label="查询维度"
                        prop="dimension">
                        <el-select v-model="integralChangeForm.dimension" clearable style="width: 200px">
                          <el-option
                            v-for="item in dimension"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-button type="primary" @click="requestIntegralChange()">查询</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <div id="integralChange"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>会员新增数</span>
              </div>
              <div>
                <el-form
                  ref="memberAddForm"
                  :model="memberAddForm"
                  label-width="100px"
                  label-position="left"
                  @submit.native.prevent
                >
                  <el-row :gutter="20">
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-form-item
                        :rules="rules.date"
                        label="时间范围"
                        prop="dateInterval">
                        <el-date-picker
                          v-model="memberAddForm.dateInterval"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"/>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-form-item
                        :rules="rules.dimension"
                        label="查询维度"
                        prop="dimension">
                        <el-select v-model="memberAddForm.dimension" clearable style="width: 200px">
                          <el-option
                            v-for="item in dimension"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :lg="8" :xl="6" :md="12">
                      <el-button type="primary" @click="requestMemberAdd()">查询</el-button>
                    </el-col>
                  </el-row>
                </el-form>
                <div id="memberAdd"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getMemberActiveInfo, getIntegralChangeInfo, getMemberAddInfo } from '@/api/kpi'
export default {
  name: 'Kpi',
  data() {
    const validateDate = (rule, value, callback) => {
      if (value === undefined || value === null || value.length === null || value.length !== 2 || value[0] === '' || value[1] === '') {
        callback(new Error('请选择时间范围'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        date: [
          { validator: validateDate, trigger: 'blur' }
        ],
        dimension: [
          { required: true, trigger: 'blur', message: '请选择查询维度' }
        ]
      },
      dimension: [
        {
          'code': 'day',
          'name': '日'
        },
        {
          'code': 'month',
          'name': '月'
        },
        {
          'code': 'year',
          'name': '年'
        }
      ],
      activeForm: {
        dateInterval: ['', ''],
        dimension: '',
        startTime: '',
        endTime: ''
      },
      activeDate: {
        xAxis: [],
        yAxis: []
      },
      integralChangeForm: {
        dateInterval: ['', ''],
        dimension: '',
        startTime: '',
        endTime: ''
      },
      integralChangeData: {
        xAxis: [],
        addAxis: [],
        minusAxis: [],
        freezeAxis: [],
        invalidAxis: []
      },
      memberAddForm: {
        dateInterval: ['', ''],
        dimension: '',
        startTime: '',
        endTime: ''
      },
      memberAddData: {
        xAxis: [],
        yAxis: []
      }

    }
  },
  computed: {
    ...mapState({
      flush: state => state.flush
    })
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    requestActiveCount() {
      this.$refs['activeForm'].validate(valid => {
        if (valid) {
          if (this.activeForm.dateInterval !== null) {
            if (this.activeForm.dateInterval[0] !== '') {
              this.activeForm.startTime = this.activeForm.dateInterval[0] + 'T00:00:00'
            }
            if (this.activeForm.dateInterval[1] !== '') {
              this.activeForm.endTime = this.activeForm.dateInterval[1] + 'T23:59:59'
            }
          }
          getMemberActiveInfo({
            startTime: this.activeForm.startTime,
            endTime: this.activeForm.endTime,
            dimension: this.activeForm.dimension
          }).then(res => {
            this.activeDate.xAxis = res.result.xAxis
            this.activeDate.yAxis = res.result.yAxis
            this.memberActiveCount()
          })
        }
      })
    },
    requestIntegralChange() {
      this.$refs['integralChangeForm'].validate(valid => {
        if (valid) {
          if (this.integralChangeForm.dateInterval !== null) {
            if (this.integralChangeForm.dateInterval[0] !== '') {
              this.integralChangeForm.startTime = this.integralChangeForm.dateInterval[0] + 'T00:00:00'
            }
            if (this.integralChangeForm.dateInterval[1] !== '') {
              this.integralChangeForm.endTime = this.integralChangeForm.dateInterval[1] + 'T23:59:59'
            }
          }
          getIntegralChangeInfo({
            startTime: this.integralChangeForm.startTime,
            endTime: this.integralChangeForm.endTime,
            dimension: this.integralChangeForm.dimension
          }).then(res => {
            this.integralChangeData.xAxis = res.result.xAxis
            this.integralChangeData.addAxis = res.result.addAxis
            this.integralChangeData.minusAxis = res.result.minusAxis
            this.integralChangeData.freezeAxis = res.result.freezeAxis
            this.integralChangeData.invalidAxis = res.result.invalidAxis
            this.integralChange()
          })
        }
      })
    },
    requestMemberAdd() {
      this.$refs['memberAddForm'].validate(valid => {
        if (valid) {
          if (this.memberAddForm.dateInterval !== null) {
            if (this.memberAddForm.dateInterval[0] !== '') {
              this.memberAddForm.startTime = this.memberAddForm.dateInterval[0] + 'T00:00:00'
            }
            if (this.memberAddForm.dateInterval[1] !== '') {
              this.memberAddForm.endTime = this.memberAddForm.dateInterval[1] + 'T23:59:59'
            }
          }
          getMemberAddInfo({
            startTime: this.memberAddForm.startTime,
            endTime: this.memberAddForm.endTime,
            dimension: this.memberAddForm.dimension
          }).then(res => {
            this.memberAddData.xAxis = res.result.xAxis
            this.memberAddData.yAxis = res.result.yAxis
            this.memberAdd()
          })
        }
      })
    },
    memberActiveCount() {
      const myChart = this.$echarts.init(document.getElementById('memberActiveCount'), 'macarons')
      const option = {
        tooltip: {},
        legend: {
          data: ['活跃会员数']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.activeDate.xAxis
          }
        ],
        yAxis: {},
        series: [
          {
            name: '活跃会员数',
            type: 'bar',
            data: this.activeDate.yAxis,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    integralChange() {
      const myChart = this.$echarts.init(document.getElementById('integralChange'), 'macarons')
      const option = {
        tooltip: {},
        legend: {
          data: ['积分增加', '积分减少', '积分冻结', '积分失效']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.integralChangeData.xAxis
          }
        ],
        yAxis: {},
        series: [
          {
            name: '积分增加',
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            data: this.integralChangeData.addAxis
          },
          {
            name: '积分减少',
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            data: this.integralChangeData.minusAxis
          },
          {
            name: '积分冻结',
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            data: this.integralChangeData.freezeAxis
          },
          {
            name: '积分失效',
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            data: this.integralChangeData.invalidAxis
          }
        ]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    memberAdd() {
      const myChart = this.$echarts.init(document.getElementById('memberAdd'), 'macarons')
      const option = {
        tooltip: {},
        legend: {
          data: ['新增会员数']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.memberAddData.xAxis
          }
        ],
        yAxis: {},
        series: [
          {
            name: '新增会员数',
            type: 'bar',
            data: this.memberAddData.yAxis,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                }
              }
            },
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>
<style>
#memberActiveCount,#integralChange,#memberAdd{
  width: 100%;
  height: 500px;
}
</style>
