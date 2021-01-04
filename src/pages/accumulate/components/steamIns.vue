<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name" >查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions">清空</el-button>
          <el-button type="primary" @click="checkSearch">查询</el-button>
        </div>
        <el-form ref="searchForm" :model="searchForm" :rules="rules" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
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
              <el-form-item label="积分变动类型">
                <el-select v-model="searchForm.changeType" placeholder="全部" clearable>
                  <el-option v-for="item of changeType" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="rules.phone" label="手机号" prop="phone">
                <el-input v-model="searchForm.phone" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12" >
              <el-form-item label="关联系统名称">
                <el-select v-model="searchForm.clientId" placeholder="全部" clearable>
                  <el-option v-for="item of clientId" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item label="策略名称">
                <el-select v-model="searchForm.code" placeholder="全部" clearable>
                  <el-option v-for="item of tacticsRemarkList" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
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
          <el-button @click="exportExcelPhone">导出(手机号)</el-button>
          <el-button v-if="!show" @click="exportExcelHandler">导出</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" stripe >
          <el-table-column label="变动时间" ><template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate:'-' }}</template></el-table-column>
          <el-table-column label="姓名"><template slot-scope="scope">{{ scope.row.memberName?scope.row.memberName:'-' }}</template></el-table-column>
          <el-table-column label="手机号"><template slot-scope="scope">{{ scope.row.phone?scope.row.phone:'-' }}</template></el-table-column>
          <el-table-column label="关联系统名称"><template slot-scope="scope">{{ scope.row.clientName?scope.row.clientName:'-' }}</template></el-table-column>
          <el-table-column label="变动类型">
            <template slot-scope="scope">

              {{ showType(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="策略名称"><template slot-scope="scope">{{ scope.row.tacticsName?scope.row.tacticsName:'-' }}</template></el-table-column>
          <el-table-column label="变动积分"><template slot-scope="scope">{{ scope.row.changeIntegral?scope.row.changeIntegral:'-' }}</template></el-table-column>
          <!-- <el-table-column label="变动后可用积分值"><template slot-scope="scope">{{ scope.row.availableIntegral?scope.row.availableIntegral:'-' }}</template></el-table-column> -->
          <el-table-column prop="validateDate" label="有效期">
            <template slot-scope="scope">
              {{ getClounName(scope.row) }}
              <!-- {{ scope.row.changeType==='integral_minus'?'-':scope.row.validateDate===''?'无限期':scope.row.validateDate }} -->
            </template>
          </el-table-column>
          <el-table-column prop="lastTotalIntegral" label="变动后积分总值"/>
          <el-table-column label="积分变动说明"><template slot-scope="scope">{{ scope.row.changeDesc?scope.row.changeDesc:'-' }}</template></el-table-column>
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
    </div>
  </div>

</template>

<script>
import { getSteam, exprotExcel, getTactics, getclientId, exprotExcelPhone } from '@/api/accumulate'
import { getInfo } from '@/api/score'
export default {
  name: 'Steam',
  data() {
    const phone = (rule, value, callback) => {
      if (!value || value.match(/^[1]([3-9])[0-9]{9}$/)) {
        callback()
      } else {
        callback(new Error('请输入合法号码'))
      }
    }
    return {
      searchForm: {
        enterTime: ['', ''],
        changeType: null,
        postId: null,
        cardId: null,
        phone: null,
        code: '',
        tacticsCode: null,
        clientId: null
      },
      tacticsRemarkList: [],
      pageSize: 15,
      total: 0,
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      changeType: [
        { label: '积分增加', value: 'integral_add' },
        { label: '积分扣减', value: 'integral_minus' },
        { label: '积分过期', value: 'integral_invalid' }
      ],
      tacticsCode: [],
      clientId: [],
      rules: {
        phone: [{ validator: phone, trigger: 'blur' }]
      }
    }
  },
  computed: {
    show() {
      return this.total === 0 || this.total > 600000
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
    var temp1 = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    var date2 = new Date(date.getTime() - (1000 * 60 * 60 * 24 * 7))
    var temp2 = `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`
    this.searchForm.enterTime = [temp2, temp1]
    this.init(1)
    this.getTactics()
    this.getclientId()
    getInfo({
      startTime: '',
      endTime: '',
      tacticsCode: '',
      tacticsRemark: '',
      tacticsFlag: '',
      pageNo: 1,
      pageSize: 10000
    }).then(res => {
      const temp = []
      res.result.forEach(ele => {
        temp.push({
          value: ele.tacticsCode,
          label: ele.tacticsRemark
        })
      })
      this.tacticsRemarkList = temp
    })
  },
  methods: {
    checkSearch() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.init(1)
        }
      })
    },
    showType(row) {
      switch (row.changeType) {
        case 'integral_add':
          return '积分增加'
        case 'integral_freeze':
          return '积分扣减'
        case 'integral_minus':
          return '积分扣减'
        default: return '积分过期'
      }
    },
    getClounName(row) {
      switch (row.changeType) {
        case 'integral_invalid':
          return '-'
        case 'integral_add':
          return row.validateDate ? row.validateDate : '-'
        case 'integral_freeze':
          return '-'
        case 'integral_minus':
          return '-'
        default:
          return '-'
      }
    },
    exportExcelPhone() {
      const param = {
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        memberName: this.searchForm.memberName,
        tacticsCode: this.searchForm.code,
        changeType: this.searchForm.changeType,
        phone: this.searchForm.phone,
        clientId: this.searchForm.clientId
      }
      exprotExcelPhone(param).then(res => {
        const link = res.result.baseUrl
        var isIE = navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1
        if (isIE) {
          this.downFunction(link)
        } else {
          window.open(link)
        }
      })
    },
    exportExcelHandler() {
      const param = {
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        memberName: this.searchForm.memberName,
        tacticsCode: this.searchForm.code,
        clientId: this.searchForm.clientId,
        clientName: this.searchForm.clientName,
        changeType: this.searchForm.changeType,
        phone: this.searchForm.phone
      }
      if (this.total > 10000) {
        this.$confirm('当前查询的数据量【已超过10000条】，导出时响应时间较长，您是否确定导出数据？', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exprotExcel(param).then(res => {
            const link = res.result.baseUrl
            var isIE = navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1
            if (isIE) {
              this.downFunction(link)
            } else {
              window.open(link)
            }
          })
        }).catch(() => {
        })
      } else {
        exprotExcel(param).then(res => {
          const link = res.result.baseUrl
          var isIE = navigator.userAgent.indexOf('compatible') > -1 && navigator.userAgent.indexOf('MSIE') > -1
          if (isIE) {
            this.downFunction(link)
          } else {
            window.open(link)
          }
        })
      }
    },
    downFunction(link) {
      var eleLink = document.createElement('a')
      eleLink.href = link
      eleLink.target = '_blank'
      eleLink.down = ''
      eleLink.style.display = 'none'
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    },
    clearOptions() {
      this.searchForm.changeType = null
      this.searchForm.postId = null
      this.searchForm.postId = null
      this.searchForm.cardId = null
      this.searchForm.phone = null
      this.searchForm.clientId = null
      this.searchForm.tacticsCode = null
      this.searchForm.code = ''
      this.searchForm.name = ''
    },
    currentChange(num) {
      this.pageNo = num
      this.init()
    },
    init(pageNo) {
      const param = {
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        memberName: this.searchForm.memberName,
        clientName: this.searchForm.clientName,
        changeType: this.searchForm.changeType,
        tacticsCode: this.searchForm.code,
        clientId: this.searchForm.clientId,
        phone: this.searchForm.phone,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
      getSteam(param).then(res => {
        this.tableData = res.result
        this.total = res.totalNum
        this.pageNo = res.pageNo
        this.totalPage = res.totalPage
      })
    },
    getTactics() {
      getTactics().then(res => {
        this.tacticsCode = res.data
      })
    },
    getclientId() {
      getclientId().then(res => {
        this.clientId = res.data
      })
    },
    queryOptions() {

    },
    linkToAdd() {
      this.$router.push('/member/detail')
    }
  }
}
</script>
