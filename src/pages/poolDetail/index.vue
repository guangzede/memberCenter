<template>
  <div >
    <router-view class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb/>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name" >查询条件</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="resetQuery">清空</el-button>
            <el-button @click="handleQuery">查询</el-button>
          </div>
          <el-form ref="queryForm" :model="queryParams.exchangeIntegralPool" class="searchForm" label-width="100px" label-position="left" @submit.native.prevent>
            <el-row :gutter="20">
              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.inputText" label="积分池编码" prop="integralPoolCode">
                  <el-input
                    v-model="queryParams.exchangeIntegralPool.integralPoolCode"
                    maxlength="30"
                    placeholder="请输入积分池编码"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.inputText" label="积分池名称" prop="integralPoolName">
                  <el-input
                    v-model="queryParams.exchangeIntegralPool.integralPoolName"
                    maxlength="20"
                    placeholder="请输入积分池名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item label="关联预算信息" prop="budgetCode">
                  <el-select v-model="queryParams.exchangeIntegralPool.budgetCode" :width="120" placeholder="请选择" clearable @change="handleQuery">
                    <el-option v-for="item in budgets" :key="item.id" :label="item.budgetCode" :value="item.budgetCode"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item label="变动类型" prop="typeOfChange">
                  <el-select v-model="queryParams.typeOfChange" :width="120" placeholder="请选择" clearable @change="handleQuery">
                    <el-option key="充值" label="充值" value="0" />
                    <el-option key="分配" label="分配" value="1" />
                    <!--<el-option key="结转" label="结转" value="2" />-->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item label="更新时间">
                  <el-date-picker
                    v-model="queryParams.timeInterval"
                    :clearable="false"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleQuery"/>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">积分池流水列表</div>
          <el-table :data="detailList">
            <el-table-column label="积分池编码" align="center" prop="exchangeIntegralPool.integralPoolCode" />
            <el-table-column label="积分池名称" align="center" prop="exchangeIntegralPool.integralPoolName" />
            <el-table-column label="变动类型" align="center" prop="typeOfChange" >
              <template slot-scope="scope">
                <span v-if="scope.row.typeOfChange==='0'" >充值</span>
                <span v-if="scope.row.typeOfChange==='1'" >分配</span>
                <span v-if="scope.row.typeOfChange==='2'" >结转</span>
              </template>
            </el-table-column>
            <el-table-column label="应用账户名称" align="center" prop="accountName" width="180"/>
            <el-table-column label="变动额度(元)" align="center" prop="amountOfChange" />
            <el-table-column label="可用额度(元)" align="center" prop="availableAmount" />
            <el-table-column label="操作人" align="center" prop="createBy" />
            <el-table-column label="关联预算信息" align="center" prop="exchangeIntegralPool.budgetCode" />
            <el-table-column label="更新时间" align="center" prop="createDate" width="180"/>
          </el-table>
          <div class="table-footer">
            <span>{{ total }}条记录，共{{ totalPage }}页</span>
            <el-pagination
              :total="total"
              :current-page="queryParams.pageNo"
              background
              hide-on-single-page
              layout="prev, pager, next"
              @current-change="currentChange"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { listDetail } from '@/api/integralPoolDetail'
import { listBudget } from '@/api/budget'
export default {
  name: 'IntegralPoolDetail',
  components: {
    breadcrumb
  },
  data() {
    const validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符！！'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        inputText: [
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        timeInterval: ['', ''],
        typeOfChange: null,
        params: {
          startTime: undefined,
          endTime: undefined
        },
        exchangeIntegralPool: {
          budgetCode: '',
          integralPoolCode: '',
          integralPoolName: ''
        }
      },
      // 总条数
      total: 0,
      // 总页数
      totalPage: 0,
      // 积分池流水表格数据
      detailList: [],
      // 预算集合
      budgets: []
    }
  },
  mounted() {
    this.getList()
    this.getBudgetList()
  },
  methods: {
    checkSpecialKey(str) {
      const specialKey = "[`%~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    },
    /** 查询积分池列表 */
    getList() {
      this.queryParams.params.startTime = this.queryParams.timeInterval[0]
      this.queryParams.params.endTime = this.queryParams.timeInterval[1]
      if (this.queryParams.params.startTime !== '') {
        this.queryParams.params.startTime = this.queryParams.params.startTime + ' 00:00:00'
      }
      if (this.queryParams.params.endTime !== '') {
        this.queryParams.params.endTime = this.queryParams.params.endTime + ' 23:59:59'
      }
      listDetail(this.queryParams).then(response => {
        this.detailList = response.result.list
        this.total = response.result.total
        this.totalPage = response.result.pages
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          this.queryParams.pageNo = 1
          this.getList()
        }
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        timeInterval: ['', ''],
        typeOfChange: null,
        params: {
          startTime: undefined,
          endTime: undefined
        },
        exchangeIntegralPool: {
          budgetCode: null,
          integralPoolCode: null,
          integralPoolName: null
        }
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },
    currentChange(num) {
      this.queryParams.pageNo = num
      this.getList()
      this.getBudgetList()
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },
    getBudgetList() {
      listBudget({ rechargeFlag: 1 }).then(response => {
        this.budgets = response.result
      })
    }
  }
}
</script>
