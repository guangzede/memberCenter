<template>
  <div>
    <router-view v-if="this.$route.path !=='/member/management'" class="sibling"/>
    <div class="sibling">
      <div class="background"/>
      <breadcrumb />
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="baseInfo">
          <el-button slot="label" :type="activeName==='baseInfo'?'primary':'default'" size="medium"> 会员信息查询</el-button>
          <div class="app-container shadow">
            <div class="content">
              <div class="class-name">查询条件</div>
              <div class="flex-buttons">
                <el-button type="transparent" @click="clearOptions">清空</el-button>
                <el-button type="primary" @click="searchInfo">查询</el-button>
              </div>
              <el-form ref="form" :model="searchForm" :rules="rules" label-width="100px" label-position="left" @submit.native.prevent>
                <el-row :gutter="20">
                  <el-col :xl="6" :lg="8" :md="12" >
                    <el-form-item label="入会时间">
                      <el-date-picker
                        v-model="searchForm.enterTime"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item :rules="rules.aid" label="客户ID" prop="aid" >
                      <el-input v-model="searchForm.aid" clearable placeholder="请输入AID"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item :rules="rules.maxLength" label="昵称" prop="nickName">
                      <el-input v-model="searchForm.nickName" clearable placeholder="请输入昵称"/>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item :rules="rules.maxLength" label="证件号码" prop="idcard">
                      <el-input v-model="searchForm.idcard" clearable placeholder="请输入身份证号或驾驶证号"/>
                    </el-form-item>
                  </el-col>
                  <!-- 会员管理模块增加“注册来源”、“是否车主”、“是否开通T服务”查询条件，无论数据是否支持，先把功能做了。 -->
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="入会渠道">
                      <el-select v-model="searchForm.userRegisterChannel" :width="120" placeholder="请选择" clearable>
                        <el-option v-for="item in userRegisterChannel" :key="item.value" :label="channel(item)" :value="channel(item)"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="是否车主">
                      <el-select v-model="searchForm.ownerFlag" :width="120" placeholder="请选择" clearable>
                        <el-option v-for="item in ownerFlag" :key="item" :label="item" :value="item"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xl="6" :lg="8" :md="12">
                    <el-form-item label="是否开通T服务">
                      <el-select v-model="searchForm.tOwnerFlag" :width="120" placeholder="请选择" clearable>
                        <el-option v-for="item in tOwnerFlag" :key="item" :label="item==='1'?'是':'否'" :value="item"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :lg="16">
                    <div style="text-align: left;">
                      <el-radio v-model="searchForm.cutFlag" label="0">全号搜索</el-radio>
                      <el-radio v-model="searchForm.cutFlag" label="1">中间4位</el-radio>
                      <el-radio v-model="searchForm.cutFlag" label="2">后4位</el-radio>
                      <el-form-item :rules="rules.phone" label="会员手机号" class="radio" prop="mobile" >
                        <el-input v-model="searchForm.mobile" :maxlength="searchForm.phoneLength" :placeholder="searchForm.radioPlaceholder" clearable/>
                      </el-form-item>
                    </div>
                  </el-col>

                </el-row>
              </el-form>
            </div>
          </div>
          <div class="app-container shadow">
            <div class="content">
              <div class="class-name">会员信息</div>
              <div class="flex-buttons">
                <el-button @click="exportExcel">导出</el-button>
              </div>
              <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column label="入会时间" ><template slot-scope="scope">{{ scope.row.createTime?scope.row.createTime:'-' }}</template></el-table-column>
                <el-table-column label="入会渠道"><template slot-scope="scope">{{ channel(scope.row.userRegisterChannel) }}</template></el-table-column>
                <el-table-column label="姓名"><template slot-scope="scope">{{ scope.row.userName?scope.row.userName:'-' }}</template></el-table-column>
                <el-table-column label="手机号"><template slot-scope="scope">{{ scope.row.mobile?scope.row.mobile:'-' }}</template></el-table-column>
                <el-table-column label="当前积分"><template slot-scope="scope">{{ scope.row.integral?scope.row.integral:'-' }}</template></el-table-column>
                <el-table-column label="是否车主" prop="isVhlOwner"/>
                <el-table-column label="是否开通T服务">
                  <template slot-scope="scope">{{ scope.row.isTOwner ==='1'?'是':'否' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" @click="linkTo('detail',scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="totalPage>0" class="table-footer">
                <span>{{ total }}条记录，共{{ totalPage }}页</span>
                <el-pagination
                  :page-count="totalPage"
                  :current-page="pageNo"
                  background
                  hide-on-single-page
                  layout="prev, pager, next"
                  @current-change="getInfoList"/>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="download">
          <el-button slot="label" :type="activeName==='download'?'primary':'default'" size="medium" > 下载任务列表</el-button>
          <div class="app-container shadow">
            <div class="content">
              <div class="class-name">查询条件</div>
              <div class="flex-buttons">
                <el-button type="transparent" @click="download.time=['','']">清空</el-button>
                <el-button type="primary" @click="downloadSearch">查询</el-button>
              </div>
              <el-form ref="searchForm" :model="download" label-width="100px" label-position="left" @submit.native.prevent>
                <el-row :gutter="20">
                  <el-col :xl="6" :lg="8" :md="12" >
                    <el-form-item label="生成时间">
                      <el-date-picker
                        v-model="download.time"
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
              <div class="class-name">数据下载任务</div>
              <el-table :data="download.tableData" stripe style="width: 100%" >
                <el-table-column label="创建时间" ><template slot-scope="scope">{{ scope.row.createDate?scope.row.createDate:'-' }}</template></el-table-column>
                <el-table-column label="创建人"><template slot-scope="scope">{{ scope.row.createBy?scope.row.createBy:'-' }}</template></el-table-column>
                <el-table-column label="处理状态"><template slot-scope="scope">{{ scope.row.exportResult?scope.row.exportResult:'正在处理' }}</template></el-table-column>
                <el-table-column label="下载">
                  <template slot-scope="scope">
                    <template v-if="scope.row.downLoadUrl">
                      <a :href="scope.row.downLoadUrl"><i class="el-icon-download"/> </a>
                    </template>
                    <template v-else>-</template>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="download.totalPage>0" class="table-footer">
                <span>{{ download.total }}条记录，共{{ download.totalPage }}页</span>
                <el-pagination
                  :page-count="download.totalPage"
                  :current-page="download.pageNo"
                  background
                  hide-on-single-page
                  layout="prev, pager, next"
                  @current-change="getDownloadList"/>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { uesrCenter, exportDownload, downloadList } from '@/api/member.js'

export default {
  name: 'Management',
  components: {
    breadcrumb
  },
  data() {
    const checkLentgh = (rule, value, callback) => {
      if (value && value.length > 30) {
        callback(new Error('最大长度为30'))
      } else {
        callback()
      }
    }
    const check = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback()
      } else if (value.match('[0-9]{4}') && this.searchForm.cutFlag !== '0') {
        callback()
      } else if (value.match(/^1(3|4|5|6|7|8|9)\d{9}$/) && this.searchForm.cutFlag === '0') {
        callback()
      } else {
        callback(new Error('请输入正确的号码'))
      }
    }
    const aid = (rule, value, callback) => {
      if (value && !value.match(/^[0-9]{0,19}$/)) {
        callback(new Error('请输入正确客户ID（最大长度19位）且仅含数字'))
      } else {
        callback()
      }
    }
    return {
      searchForm: {
        enterTime: ['', ''],
        cardId: '',
        cutFlag: '0',
        nickName: '',
        radioPlaceholder: '',
        aid: '',
        phoneLength: 11,
        userRegisterChannel: '',
        ownerFlag: '',
        tOwnerFlag: ''
      },
      rules: {
        phone: [
          { validator: check, type: 'number' }
        ],
        aid: [
          { validator: aid, type: 'string' }
        ],
        maxLength: [
          { validator: checkLentgh, type: 'string' }
        ]
      },
      userRegisterChannel: [0, 1, 2, 3, 4, 5, 6, 7],
      ownerFlag: ['是', '否'],
      activeName: 'baseInfo',
      tOwnerFlag: ['0', '1'],
      download: {
        time: ['', ''],
        tableData: [],
        pageSize: 10,
        total: 10,
        pageNo: 1,
        totalPage: 0
      },
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      infoParam: {},
      downloadParam: {}
    }
  },
  watch: {
    'searchForm.cutFlag': {
      immediate: true,
      handler(v) {
        switch (v) {
          case '0':
            this.searchForm.radioPlaceholder = '请输入11位手机号'
            this.searchForm.phoneLength = 11
            break
          case '1':
            this.searchForm.radioPlaceholder = '请输入中间4位手机号'
            this.searchForm.phoneLength = 4
            break
          case '2':
            this.searchForm.radioPlaceholder = '请输入后4位手机号'
            this.searchForm.phoneLength = 4
            break
        }
      }
    },
    'searchForm.enterTime': {
      handler(n, o) {
        if (n === null) {
          this.searchForm.enterTime = ['', '']
        }
      }
    },
    'download.time': {
      handler(n, o) {
        if (n === null) {
          this.download.time = ['', '']
        }
      }
    }
  },
  mounted() {
    var date = new Date()
    var temp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // temp = '2020-03-01'
    this.searchForm.enterTime = [temp, temp]
    this.download.time = [temp, temp]
    this.initDownloadParam()
    this.initInfoParam()
    this.getInfoList(1)
  },
  methods: {
    channel(type) {
      // 0：APP；1：WeChat;2:商城；3：经销商；4：厂商；5：车机 ;6:小程序；7：云店；
      if (typeof type === 'number') {
        switch (type) {
          case 0:
            return 'APP'
          case 1:
            return 'WeChat'
          case 2:
            return '商城'
          case 3:
            return '经销商'
          case 4:
            return '厂商'
          case 5:
            return '车机'
          case 6:
            return '小程序'
          case 7:
            return '云店'
          default:
            return '-'
        }
      } else {
        switch (type) {
          case 'APP':
            return 0
          case 'WeChat':
            return 1
          case '商城':
            return 2
          case '经销商':
            return 3
          case '厂商':
            return 4
          case '车机':
            return 5
          case '小程序':
            return 6
          case '云店':
            return 7
          default:
            return ''
        }
      }
    },
    initInfoParam() {
      this.infoParam = {
        pageNo: 1,
        pageSize: this.pageSize,
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        nickName: this.searchForm.nickName,
        cutFlag: this.searchForm.cutFlag,
        aId: this.searchForm.aid,
        phoneNum: this.searchForm.mobile,
        userRegisterChannel: this.channel(this.searchForm.userRegisterChannel),
        ownerFlag: this.searchForm.ownerFlag,
        tOwnerFlag: this.searchForm.tOwnerFlag
      }
    },
    handleClick(tab) {
      if (tab.index === '1') {
        this.getDownloadList(1)
      }
    },
    exportExcel() {
      exportDownload(this.infoParam).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          // this.$message({
          //   message: res.result,
          //   type: 'success'
          // })
          this.$confirm('您导出的数据将新增1条下载任务，处理完成后请到【下载任务列表】中查看下载。', '提示信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.activeName = 'download'
            this.getDownloadList()
          }).catch(() => {

          })
        }
      })
    },
    downloadSearch() {
      this.initDownloadParam()
      this.getDownloadList(1)
    },
    initDownloadParam() {
      this.downloadParam = {
        pageNo: this.download.pageNo,
        pageSize: this.download.pageSize,
        startTime: this.download.time[0],
        endTime: this.download.time[1]
      }
    },
    getDownloadList(pageNo) {
      pageNo ? this.downloadParam.pageNo = pageNo : ''
      downloadList(this.downloadParam).then(res => {
        this.download.tableData = res.result
        this.download.pageSize = res.pageSize || this.download.pageSize
        this.download.totalPage = res.totalPage
        this.download.total = res.totalNum
        this.download.pageNo = res.pageNo
      })
    },
    clearOptions() {
      this.searchForm = {
        enterTime: ['', ''],
        cardId: '',
        cutFlag: '0',
        nickName: '',
        radioPlaceholder: '请输入11位手机号',
        phoneLength: 11
      }
    },
    currentChange(num) {
      this.infoParam.pageNo = num
      this.getInfoList()
    },
    getInfoList(num) {
      num ? this.infoParam.pageNo = num : ''
      uesrCenter(this.infoParam).then(res => {
        this.pageSize = res.pageSize || this.pageSize
        this.totalPage = res.totalPage
        this.total = res.totalNum
        this.tableData = res.result
        this.pageNo = res.pageNo
      })
    },
    searchInfo() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.initInfoParam()
          this.getInfoList()
        }
      })
    },
    linkTo(path, data) {
      console.log(data)
      this.$store.commit('postData', data)
      this.$router.push(`/member/management/${path}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item{
    text-align: left;
  }
  .radio {
    >>>.el-form-item__content{
      width: auto!important;
      .el-input{
        display: inline-block;
        width: 200px;
      }
      .el-form-item__error{
        right: auto;
        left: 0;
      }
    }
      display: inline-block;
    position: relative
  }
.background{
  background: #eee;
}
.el-tabs__nav-scroll{
  padding: 0 20px;
}
>>>.el-tabs__content{
  background: #fff;
}
.el-image{
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 20px;
}
.el-button--medium{
  border-radius: 0;
}
>>>.el-tabs__nav{
  padding-bottom: 10px;
}
// .el-breadcrumb{
//   border: none;
// }
>>>.el-tabs__nav-scroll{
  padding: 0 20px;
  margin-top: 10px;
}
.el-tabs {
    background: #efefef;
}
</style>
