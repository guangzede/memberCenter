<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clear">清空</el-button>
          <el-button @click="checkForm">查询</el-button>
        </div>
        <el-form ref="searchForm" :model="searchForm" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :lg="8" :md="12">
              <el-form-item label="应用积分池账户名称" label-width="130px" prop="accountName">
                <el-input v-model="searchForm.accountName" max="10" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item label="变动时间" prop="creatTime">
                <el-date-picker
                  v-model="searchForm.creatTime"
                  :clearable="false"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item label="变动类型" prop="creatTime">
                <el-select v-model="searchForm.changeType" placeholder="请选择" clearable @change="poolChange">
                  <el-option key="积分增加" label="积分增加" value="integral_add"/>
                  <el-option key="积分减少" label="积分减少" value="integral_minus"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">个人账户列表</div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column label="变动时间" prop="createDate" width="180"/>
          <el-table-column label="关联积分池" prop="poolName" />
          <el-table-column label="应用积分池账户名称" prop="accountName" />
          <el-table-column label="应用范围" prop="clientNames" />
          <el-table-column label="变动类型" prop="changeType">
            <template slot-scope="scope">
              <span>{{ scope.row.changeType=='integral_add'?'积分增加':'积分减少' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="变动总积分" prop="changeIntegral" />
          <el-table-column label="变动前总积分" prop="preTotalIntegral" />
          <el-table-column label="变动后总积分" prop="lastTotalIntegral" />
          <el-table-column label="积分变动说明" prop="changeDesc" />
        </el-table>
        <div class="table-footer">
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
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getaccountDetaiList } from '@/api/application'
export default {
  name: 'Platform',
  components: {
    breadcrumb
  },
  data() {
    return {
      searchForm: {
        creatTime: ['', '']
      },
      pageSize: 10,
      total: 0,
      pageNo: 1,
      param: {},
      totalPage: 0,
      tableData: []
    }
  },
  mounted() {
    this.initParam(1)
    this.getinfo()
  },
  methods: {
    checkForm() {
      this.initParam(1)
      this.currentChange(1)
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    initParam(pageNo) {
      this.param = {
        accountName: this.searchForm.accountName,
        changeType: this.searchForm.changeType,
        pageNo: pageNo,
        pageSize: this.pageSize
      }
      if (this.searchForm.creatTime[0] !== '') {
        this.param.startTime = this.searchForm.creatTime[0] + ' 00:00:00'
      }
      if (this.searchForm.creatTime[1] !== '') {
        this.param.endTime = this.searchForm.creatTime[1] + ' 23:59:59'
      }
    },
    getinfo() {
      getaccountDetaiList(this.param).then(res => {
        this.tableData = res.result.list
        this.pageSize = res.result.pageSize
        this.total = res.result.total
        this.totalPage = res.result.pages
        // this.pageNo = res.result.pageNo
      })
    },
    clear() {
      this.searchForm = {
        creatTime: ['', '']
      }
    },
    init() {
      this.getinfo()
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .dialog {
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
  }
  .el-transfer-panel {
    width: 320px;
  }
}
  .el-form{
    text-align: left;
    .center{
      text-align: center;
    }
  }
</style>
