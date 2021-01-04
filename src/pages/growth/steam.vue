<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions">清空</el-button>
          <el-button @click="checkForm">查询</el-button>
        </div>
        <el-form ref="searchForm" :model="searchForm" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :lg="8" :xl="6" :md="12" >
              <el-form-item label="变动时间">
                <el-date-picker
                  v-model="searchForm.creatTime"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="变动后等级">
                <el-select v-model="searchForm.memberLevelName" clearable placeholder="请选择" @change="changeStars">
                  <el-option v-for="item of level" :key="item.id" :label="item.levelName" :value="item.levelName"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="星级范围">
                <el-select id="select_icon" ref="select_icon" v-model="searchForm.memberStarsName" placeholder="请选择" clearable @change="starChange">
                  <el-option value="" label="- 全部 -"/>
                  <el-option v-for="(item,index) of stars" :key="index" :value="item.levelName">
                    <i v-for="i in index +1 " :key="index+1 + '-' + i" class="el-icon-star-on colorYellow"/>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item :rules="rules.check" label="姓名" prop="memberName">
                <el-input v-model="searchForm.memberName" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item :rules="rules.phone" label="手机号码" prop="phone">
                <el-input v-model="searchForm.phone" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">成长值变动流水明细</div>
        <div class="flex-buttons">
          <el-button v-if="!show" @click="exportExcelHandler">导出</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" stripe>
          <el-table-column label="变动时间"><template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate:'-' }}</template></el-table-column>
          <el-table-column label="姓名"><template slot-scope="scope">{{ scope.row.memberName?scope.row.memberName:'-' }}</template></el-table-column>
          <el-table-column label="手机号"><template slot-scope="scope">{{ scope.row.phone?scope.row.phone:'-' }}</template></el-table-column>
          <el-table-column label="关联系统名称"><template slot-scope="scope">{{ scope.row.clientName?scope.row.clientName:'-' }}</template></el-table-column>
          <el-table-column label="变动成长值"><template slot-scope="scope">{{ scope.row.changeGrowth?scope.row.changeGrowth:'-' }}</template></el-table-column>
          <el-table-column label="成长值有效期"><template slot-scope="scope">{{ scope.row.validateDate?scope.row.validateDate+'个月':'-' }}</template></el-table-column>
          <el-table-column label="变动后总成长值"><template slot-scope="scope">{{ scope.row.lastTotalGrowth?scope.row.lastTotalGrowth:'-' }}</template></el-table-column>
          <el-table-column label="变动后等级"><template slot-scope="scope">{{ scope.row.memberLevelName?scope.row.memberLevelName:'-' }}</template></el-table-column>
          <el-table-column label="星级范围"><template slot-scope="scope"><img v-for="i in parseInt(scope.row.memberStarsName ? scope.row.memberStarsName.substring(0,1) : 0)" :key="i" :src="starImgUrl" class="starImg" ></template></el-table-column>
          <el-table-column label="成长值变动说明"><template slot-scope="scope">{{ scope.row.changeDesc?scope.row.changeDesc:'-' }}</template></el-table-column>
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
import breadcrumb from '@/components/breadcrumb'
import { getLevelInfo } from '@/api/growth'
import { getGrowthSteam, exprotExcel } from '@/api/growth'
export default {
  name: 'Steam',
  components: {
    breadcrumb
  },
  data() {
    const validateCheck = (rule, value, callback) => {
      let words = '[` ~!@#$^&*()=|{}:;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？%+_]'
      words = [...words]
      if (!value) {
        callback()
      } else if (value && words.some(item => {
        return value.indexOf(item) > -1
      })) {
        callback(new Error('请输入合法字符'))
      } else if (value.length > 20) {
        callback(new Error('最大长度为20'))
      } else {
        callback()
      }
    }
    const phone = (rules, value, callback) => {
      if (!value || value.match(/^1(3|4|5|6|7|8|9)\d{9}$/)) {
        callback()
      } else {
        callback(new Error('请输入正确号码'))
      }
    }
    return {
      searchForm: {
        creatTime: ['', ''],
        memberLevelName: '',
        memberStarsName: '',
        memberName: '',
        phone: ''
      },
      level: [],
      stars: [],
      changeType: [{
        value: 'integral_add',
        label: '成长值增加'
      }, {
        value: 'integral_minus',
        label: '成长值扣减'
      }],
      pageSize: 15,
      param: {},
      total: 0,
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      starImgUrl: require('../../assets/star.png'),
      rules: {
        check: { validator: validateCheck, trigger: 'blur' },
        phone: { validator: phone, trigger: 'blur' }
      }
    }
  },
  computed: {
    show() {
      return this.total > 600000 || this.total === 0
    }
  },
  watch: {
    'searchForm.creatTime': {
      handler(n, o) {
        if (n === null) {
          this.searchForm.creatTime = ['', '']
        }
      }
    }
  },
  mounted() {
    var date = new Date()
    var temp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    this.searchForm.creatTime = [temp, temp]
    this.initParam()
    this.init()
    this.getLevel()
  },
  methods: {
    checkForm() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.initParam(1)
          this.init()
        }
      })
    },
    starChange(val = '') { // 星级范围切换
      if (val !== '') {
        val = parseInt(val.substring(0, 1))
      }
      const dom = this.$refs['select_icon'].$el
      const input__prefix_custom = document.getElementById('el-input__prefix_custom')
      input__prefix_custom && dom.children[0].removeChild(input__prefix_custom)
      if (val === '') {
        document.getElementById('select_icon').style.color = '#000'
      } else {
        document.getElementById('select_icon').style.color = 'transparent'
        let icon = ''
        for (let i = 0; i < val; i++) {
          icon += `<i class="el-input__icon el-icon-star-on colorYellow"></i>`
        }
        const svgDom = document.createElement('span')
        svgDom.setAttribute('class', 'el-input__prefix')
        svgDom.setAttribute('id', 'el-input__prefix_custom')
        svgDom.innerHTML = `<span class="el-input__prefix-inner">${icon}</span>`
        dom.children[0].appendChild(svgDom)
      }
    },
    initParam(pageNo) {
      this.param = {
        startTime: this.searchForm.creatTime[0],
        endTime: this.searchForm.creatTime[1],
        memberStarsName: this.searchForm.memberStarsName,
        memberLevelName: this.searchForm.memberLevelName,
        memberName: this.searchForm.memberName,
        phone: this.searchForm.phone,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
    },
    exportExcelHandler() {
      const param = {
        startTime: this.searchForm.creatTime[0],
        endTime: this.searchForm.creatTime[1],
        memberStarsName: this.searchForm.memberStarsName,
        memberLevelName: this.searchForm.memberLevelName,
        memberName: this.searchForm.memberName,
        phone: this.searchForm.phone
      }
      if (this.total > 10000) {
        this.$confirm('当前查询的数据量【已超过10000条】，导出时响应时间较长，您是否确定导出数据？', '提示信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          exprotExcel(param).then(res => {
            const link = res.result
            // window.open(link)
            // this.downFunction(link)
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
          const link = res.result
          // window.open(link)
          // this.downFunction(link)
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
      eleLink.style.display = 'none'
      eleLink.down = ''
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    clearOptions() {
      this.searchForm = {
        creatTime: ['', ''],
        memberLevelName: '',
        memberStarsName: '',
        memberName: '',
        phone: ''
      }
      this.starChange('')
    },
    init() {
      getGrowthSteam(this.param).then(res => {
        this.pageNo = res.pageNo
        this.tableData = res.result
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
    },
    getLevel() {
      const params = {
        pageNo: 1,
        pageSize: 10
      }
      getLevelInfo(params).then(res => {
        this.level = res.result
      })
    },
    changeStars(val) {
      this.starChange('')
      this.searchForm.memberStarsName = ''
      for (const iterator of this.level) {
        if (val === iterator.levelName) {
          this.stars = iterator.memberLevelInfos
        }
      }
      if (!val) {
        this.stars = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  >>> #el-input__prefix_custom .el-input__prefix-inner{
    padding-left: 7px;
  }
  >>> .colorYellow{
    color: #fad403;
    width: 16px;
    font-size: 16px;
  }
  .el-select-dropdown__item >>> .colorYellow{
    font-size: 18px;
  }
  >>> .starImg{
    width: 15px !important;
    height: 15px !important;
    margin-right: 3px !important;
    display: inline !important;
  }
</style>

