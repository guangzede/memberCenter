<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name" >查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions">清空</el-button>
          <el-button type="primary" @click="init(1)">查询</el-button>
        </div>
        <el-form ref="searchForm" :model="searchForm" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :lg="8" :md="12" >
              <el-form-item label="变动时间">
                <el-date-picker
                  v-model="searchForm.enterTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" >
              <el-form-item label="策略名称">
                <el-select v-model="searchForm.tactics_id" filterable placeholder="- 全部 -" >
                  <el-option
                    v-for="item in tRemarkAndBId.tacticses"
                    :key="item.tactics_code"
                    :label="item.tactics_remark"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" >
              <el-form-item label="手机号">
                <el-input v-model="searchForm.phone" clearable placeholder="请输入手机号"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">积分变动流水明细</div>
        <div class="flex-buttons">
          <el-button v-if="!show" @click="exportExcelHandler">导出</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" stripe >
          <el-table-column label="变动时间" ><template slot-scope="scope">{{ scope.row.updateon?scope.row.updateon:'-' }}</template></el-table-column>
          <!-- <el-table-column label="会员卡号"><template slot-scope="scope">{{ scope.row.cardNo?scope.row.cardNo:'-' }}</template></el-table-column> -->
          <!-- <el-table-column label="关联系统名称"><template slot-scope="scope">{{ scope.row.clientName?scope.row.clientName:'-' }}</template></el-table-column>-->
          <el-table-column label="手机号" ><template slot-scope="scope">{{ scope.row.phone?scope.row.phone:'-' }}</template></el-table-column>
          <el-table-column label="变动类型">
            <template slot-scope="scope">
              {{ scope.row.integral>=0?'积分增加':'积分减少' }}
            </template>
          </el-table-column>
          <el-table-column label="变动积分"><template slot-scope="scope">{{ scope.row.integral?scope.row.integral:'-' }}</template></el-table-column>
          <!--          <el-table-column prop="validateDate" label="有效期">-->
          <!--            <template slot-scope="scope">-->
          <!--              {{ scope.row.changeType==='integral_minus'?'-':scope.row.validateDate===''?'无限期':scope.row.validateDate }}-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <el-table-column label="策略编码"><template slot-scope="scope">{{ scope.row.tactics_code?scope.row.tactics_code:'-' }}</template></el-table-column>
          <el-table-column label="策略名称"><template slot-scope="scope">{{ scope.row.tactics_remark?scope.row.tactics_remark:'-' }}</template></el-table-column>
          <el-table-column label="业务唯一标识"><template slot-scope="scope">{{ scope.row.biness_id?scope.row.biness_id:'-' }}</template></el-table-column>
          <el-table-column label="变动后积分总值"><template slot-scope="scope">{{ scope.row.last_total_integral?scope.row.last_total_integral:'-' }}</template></el-table-column>
          <el-table-column label="积分变动说明"><template slot-scope="scope">{{ scope.row.vremark?scope.row.vremark:'-' }}</template></el-table-column>
        </el-table>
        <div v-if="count>0" class="table-footer">
          <span>{{ count }}条记录，共{{ totalPage }}页</span>
          <el-pagination
            :page-count="totalPage"
            :current-page="page"
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
import { getAccumulateSteamBrand, exportBrandPointListExcel, getChoiseListForPG } from '@/api/accumulate'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Steam',
  components: {
    breadcrumb
  },
  data() {
    return {
      searchForm: {
        enterTime: ['', ''],
        changeType: null,
        tactics_id: null,
        tacticses: null,
        vremark: null,
        last_total_integral: null,
        phone: null
      },
      count: 0,
      limit: 10,
      page: 1,
      totalPage: 0,
      tableData: [],
      changeType: [
        { label: '积分增加', value: 'integral_add' },
        { label: '积分扣减', value: 'integral_minus' }
      ],
      tRemarkAndBId: [],
      choise: 'point'
    }
  },
  computed: {
    show() {
      return this.count === 0 || this.count > 600000
    }
  },
  watch: {
    'searchForm.enterTime': {
      handler(n, o) {
        if (n === null) {
          this.searchForm.enterTime = ['', '']
        }
      }
    }
  },
  mounted() {
    var date = new Date()
    var temp1 = `${date.getFullYear()}-${date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}`
    var date2 = new Date(date.getTime() - (1000 * 60 * 60 * 24 * 7))
    var temp2 = `${date2.getFullYear()}-${date2.getMonth() + 1 >= 10 ? date2.getMonth() + 1 : '0' + (date2.getMonth() + 1)}-${date2.getDate() >= 10 ? date2.getDate() : '0' + date2.getDate()}`
    this.searchForm.enterTime = [temp2, temp1]
    this.loadAll()
    this.init(1)
  },
  methods: {
    exportExcelHandler() {
      const param = {
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        tactics_id: this.searchForm.tactics_id,
        phone: this.searchForm.phone
      }
      if (this.count > 10000) {
        this.$confirm('当前查询的数据量【已超过10000条】，导出时响应时间较长，您是否确定导出数据？', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exportBrandPointListExcel(param).then(res => {
            const blob = new Blob([res])
            const dt = new Date()
            const ex_name = '积分流水' + dt.getFullYear() + (dt.getMonth() + 1) + dt.getDate() + dt.getHours() + dt.getMinutes() + dt.getSeconds() + '.xlsx'
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, ex_name)
            } else {
              var a = document.createElement('a')
              var url = window.URL.createObjectURL(blob)
              a.href = url
              a.download = ex_name
              a.click()
              a.remove()
              window.URL.revokeObjectURL(url)
            }
          })
        }).catch(() => {
        })
      } else {
        exportBrandPointListExcel(param).then(res => {
          const blob = new Blob([res])
          const dt = new Date()
          const ex_name = '积分流水' + dt.getFullYear() + (dt.getMonth() + 1) + dt.getDate() + dt.getHours() + dt.getMinutes() + dt.getSeconds() + '.xlsx'
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, ex_name)
          } else {
            var a = document.createElement('a')
            var url = window.URL.createObjectURL(blob)
            a.href = url
            a.download = ex_name
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
          }
        })
      }
    },

    clearOptions() {
      // this.searchForm = {
      //   enterTime: ['', ''],
      //   changeType: null,
      //   postId: null,
      //   cardId: null,
      //   phone: null,
      //   name: ''
      // }
      this.searchForm.enterTime = ['', '']
      this.searchForm.tactics_id = null
      this.searchForm.phone = null
    },
    currentChange(num) {
      this.init(num)
    },
    init(pageNo) {
      this.page = pageNo || this.page
      const param = {
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        tactics_id: this.searchForm.tactics_id,
        phone: this.searchForm.phone,
        page: pageNo,
        limit: this.limit
      }
      // const param2 = { 'inParaJsonStr': param }
      getAccumulateSteamBrand(param).then(res => {
        this.tableData = res.data
        this.count = res.count
        this.totalPage = Math.ceil(this.count / this.limit)
        if (res.data.length === 0 && pageNo !== 1) {
          this.init(1)
        }
      })
    },
    loadAll() {
      const choise = { choise: this.choise }
      getChoiseListForPG(choise).then(res => {
        this.tRemarkAndBId = res.data
      })
    }
  }
}
</script>
