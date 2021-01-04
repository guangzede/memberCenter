<template>
  <div class="content">
    <el-row :gutter="20" style="margin-top:24px;padding: 0 10px;">
      <el-col :span="4">
        <p><span>会员姓名:</span>{{ data.userName }}</p>
      </el-col>
      <el-col :span="4">
        <p><span>手机号:</span>{{ data.mobile }}</p>
      </el-col>
      <el-col :span="4">
        <p><span>勋章个数:</span>{{ medalNumber }}</p>
      </el-col>
    </el-row>
    <el-divider />
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column label="变动时间"><template slot-scope="scope">{{ scope.row.updateDate?scope.row.updateDate:'-' }}</template></el-table-column>
      <el-table-column label="勋章类型"><template slot-scope="scope">{{ scope.row.groupName?scope.row.groupName:'-' }}</template></el-table-column>
      <el-table-column label="勋章名称"><template slot-scope="scope">{{ scope.row.honorName?scope.row.honorName:'-' }}</template></el-table-column>
      <el-table-column label="勋章等级"><template slot-scope="scope">{{ scope.row.currentLevel?scope.row.currentLevel:'-' }}</template></el-table-column>
      <el-table-column label="勋章变动说明"><template slot-scope="scope">{{ scope.row.remark?scope.row.remark:'-' }}</template></el-table-column>
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
import { getHonorAcquireInfoAdmin } from '@/api/typeManagement'
export default {
  name: 'GrowthInfo',
  data() {
    return {
      aid: 0,
      tableData: [],
      total: 0,
      pageSize: 10,
      pageNo: 1,
      totalPage: 0,
      medalNumber: 0
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    }
  },
  mounted() {
    this.initParam()
    this.init()
  },
  methods: {
    initParam(pageNo) {
      this.param = {
        aid: this.data.aid,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
    },
    init() {
      getHonorAcquireInfoAdmin(this.param).then(res => {
        this.pageNo = res.result.pageNo
        this.total = res.result.total
        this.totalPage = res.result.pages
        console.log(this.totalPage, res, 'kkk')
        this.tableData = res.result.list
        this.medalNumber = res.result.total
      })
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.starImg{
  width: 12px !important;
  height: 12px !important;
  margin-right: 3px !important;
  display: inline !important;
}
.text-left{
  text-align: left;
  margin: 20px 0;
}
p{
  font-size: 12px;
  text-align: left;
  margin: .8em 0;
  font-weight: bold;
  span{
    font-weight: normal;
    padding-right: 1em;
  }
}
</style>
