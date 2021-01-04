<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions('changeSearchForm')">清空</el-button>
          <el-button type="primary" @click="getChangeData(1)">查询</el-button>
        </div>
        <el-form
          ref="searchForm"
          :model="changeSearchForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="姓名" prop="userName">
                <el-input v-model="changeSearchForm.userName" maxlength="10" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="手机号" prop="userPhone">
                <el-input v-model="changeSearchForm.userPhone" maxlength="11" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="变动时间">
                <el-date-picker
                  v-model="createDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">个人总账户流水</div>
        <el-table :data="changeTableData" style="width: 100%" stripe>
          <el-table-column prop="createDate" label="变动时间" />
          <el-table-column prop="userName" label="姓名"/>
          <el-table-column prop="userPhone" label="手机号"/>
          <el-table-column prop="changeType" label="变动类型">
            <template slot-scope="scope">
              {{ scope.row.changeType==='integral_add'?'积分增加':scope.row.changeType==='integral_minus'?'积分减少':'' }}
            </template>
          </el-table-column>
          <el-table-column prop="changeIntegral" label="变动总积分值"/>
          <el-table-column prop="lastTotalIntegral" label="变动后总积分值"/>
          <el-table-column prop="changeDesc" label="积分变动说明"/>
        </el-table>
        <div class="table-footer">
          <span>{{ total }}条记录，共{{ totalPage }}页</span>
          <el-pagination
            :total="total"
            :current-page="pageNo"
            background
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { totalAccountDetailListDataMap } from '@/api/personalAccount'
export default {
  name: 'TotalAccountDetail',
  data() {
    return {
      createDate: ['', ''],
      changeTableData: [],
      changeSearchForm: {
        userName: '',
        userPhone: '',
        startDate: '',
        endDate: ''
      },
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0
    }
  },
  computed: {
    flush() {
      return this.$store.getters.flush
    }
  },
  watch: {
  },
  mounted() {
    this.currentChange(1)
  },
  methods: {
    currentChange(num) {
      this.pageNo = num
      this.getChangeData(num)
    },
    getChangeData(pageNo) {
      this.pageNo = pageNo
      this.changeSearchForm.pageNo = this.pageNo
      this.changeSearchForm.pageSize = this.pageSize
      if (this.createDate !== null) {
        if (this.createDate[0] !== '') {
          this.changeSearchForm.startDate = this.createDate[0] + 'T00:00:00'
        }
        if (this.createDate[1] !== '') {
          this.changeSearchForm.endDate = this.createDate[1] + 'T23:59:59'
        }
      }
      totalAccountDetailListDataMap(this.changeSearchForm).then(res => {
        this.total = res.result.total
        this.totalPage = res.result.pages
        this.changeTableData = res.result.list
      })
    },
    clearOptions() {
      this.changeSearchForm = {
        userName: '',
        userPhone: '',
        startDate: '',
        endDate: ''
      }
      this.createDate = ['', '']
    }
  }
}
</script>
