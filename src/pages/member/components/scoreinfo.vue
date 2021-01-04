<template>
  <div class="content">
    <el-row :gutter="20" style="margin-top:24px;padding: 0 10px;">
      <el-col :span="6">
        <p><span>会员姓名:</span>{{ data.userName }}</p>
      </el-col>
      <el-col :span="6">
        <p><span>手机号:</span>{{ data.mobile }}</p>
      </el-col>
      <el-col :span="6">
        <p><span>积分总值:</span>{{ data.totleIntegral }}</p>
      </el-col>
      <el-col :span="6">
        <p><span>已冻结积分:</span>{{ data.frozenInt }}</p>
      </el-col>
      <el-col :span="6">
        <p><span>已过期积分:</span>{{ data.totleExInt }}</p>
      </el-col>
      <el-col :span="6">
        <p><span>当前可用积分:</span>{{ data.integral }}</p>
      </el-col>
    </el-row>
    <el-divider />

    <div class="text-left">
      <el-radio v-model="type" label="">积分增减</el-radio>
      <el-radio v-model="type" label="integralFreeze">积分冻结</el-radio>
    </div>
    <el-table v-if="type===''" :data="tableData1" tooltip-effect="dark" stripe show-overflow-tooltip align="center">
      <el-table-column prop="createDate" label="变动时间" />
      <el-table-column prop="clientName" label="关联系统名称" />
      <el-table-column :formatter="row=> (row.changeType==='integral_add'?'积分增加':'积分扣减')" label="变动类型" />

      <el-table-column prop="changeIntegral" label="变动积分值" />
      <!-- <el-table-column prop="availableIntegral" label="变动后可用积分值" /> -->
      <el-table-column prop="lastTotalIntegral" label="变动后积分总值" />
      <el-table-column prop="changeDesc" label="积分变动说明" />
    </el-table>
    <el-table v-else :data="tableData2" tooltip-effect="dark" stripe show-overflow-tooltip align="center">
      <el-table-column prop="createDate" label="冻结时间" />
      <!-- <el-table-column prop="state" label="状态"/> -->
      <el-table-column :formatter="row=> (row.state==='1'?'已冻结':row.state==='2'?'已解冻':'已扣减')" label="状态"/>
      <el-table-column prop="clientName" label="关联系统名称" />
      <el-table-column prop="businessNo" label="业务编码" />
      <el-table-column prop="freezeIntegral" label="冻结积分值" />
      <el-table-column prop="validateTime" label="冻结时限（分钟）" />
      <el-table-column prop="freezeDesc" label="积分变动说明" />
    </el-table>
    <div v-if="totalPage>0" class="table-footer">
      <span>{{ total }}条记录，共{{ totalPage }}页</span>
      <el-pagination
        :page-count="totalPage"
        :current-page="pageNo"
        background
        hide-on-single-page
        layout="prev, pager, next"
        @current-change="currentChange"/>
    </div>
  </div>
</template>

<script>
import { detailList, detail, freezeList } from '@/api/member.js'
export default {
  name: 'ScoreInfo',
  data() {
    return {
      tableData1: [],
      tableData2: [],
      total: 0,
      integral: '',
      pageSize: 10,
      pageNo: 1,
      totalPage: 0,
      type: ''
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    }
  },
  watch: {
    'type': {
      immediate: true,
      handler(n) {
        const param = {
          pageNo: 1,
          pageSize: this.pageSize,
          aId: this.data.aid
        }
        if (n === 'integralFreeze') {
          freezeList(param).then(res => {
            this.tableData2 = res.result
            this.pageNo = res.pageNo
            this.total = res.totalNum
            this.totalPage = res.totalPage
          })
        } else {
          detailList(param).then(res => {
            this.tableData1 = res.result
            this.pageNo = res.pageNo
            this.total = res.totalNum
            this.totalPage = res.totalPage
          })
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    currentChange(num) {
      this.pageNo = num
      this.init()
    },
    init(pageNo) {
      const param = {
        aId: this.data.aid,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
      if (this.type === 'integralFreeze') {
        freezeList(param).then(res => {
          this.tableData2 = res.result
          this.pageNo = res.pageNo
          this.total = res.totalNum
          this.totalPage = res.totalPage
        })
      } else {
        detail(param).then((res) => {
          if (res.result) {
            this.integral = res.result.integral
          }
        })
        detailList(param).then(res => {
          this.tableData1 = res.result
          this.pageNo = res.pageNo
          this.total = res.totalNum
          this.totalPage = res.totalPage
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.text-left {
  text-align: left;
  margin: 20px 0;
}
p {
  font-size: 12px;
  text-align: left;
  margin: 0.8em 0;
  font-weight: bold;
  span {
    font-weight: normal;
    padding-right: 1em;
  }
}
</style>
