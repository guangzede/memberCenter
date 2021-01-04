<template>
  <div>
    <router-view v-if="this.$route.path !=='/member/unbind'" class="sibling" />
    <div class="sibling">
      <div class="background" />
      <breadcrumb />

      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">查询条件</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="clearOptions">清空</el-button>
            <el-button type="primary" @click="init()">查询</el-button>
          </div>
          <el-form ref="searchForm" :model="searchForm" label-width="100px" label-position="left" @submit.native.prevent>
            <el-row :gutter="20">
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item label="解绑时间">
                  <el-date-picker
                    v-model="searchForm.time"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item :rules="rules.aId" label="客户ID" prop="aId">
                  <el-input v-model="searchForm.aId" clearable placeholder="请输入AID" />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item

                  label="会员手机号">
                  <el-input
                    v-model="searchForm.phone"
                    clearable
                    maxlength="11"
                    placeholder="请输入手机号"
                  />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item :rules="rules.vin" label="车辆Vin码" prop="vin">
                  <el-input v-model="searchForm.vin" clearable placeholder="请输入17位车辆识别码" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">车辆解绑</div>
          <div class="flex-buttons">
            <el-button type="primary" icon="el-icon-search" @click="$router.push('/member/unbind/searchBind')">查询vin码解绑</el-button>
          </div>
          <el-table :data="tableData" stripe style="width: 100%" >
            <el-table-column prop="createDate" label="解绑时间" />
            <el-table-column label="操作人"><template slot-scope="scope">{{ scope.row.createBy?scope.row.createBy:'-' }}</template></el-table-column>
            <el-table-column label="客户ID"><template slot-scope="scope">{{ scope.row.aId?scope.row.aId:'-' }}</template></el-table-column>
            <el-table-column label="姓名"><template slot-scope="scope">{{ scope.row.memberName?scope.row.memberName:'-' }}</template></el-table-column>
            <el-table-column label="会员手机号"><template slot-scope="scope">{{ scope.row.phone?scope.row.phone:'-' }}</template></el-table-column>
            <el-table-column label="车辆Vin码"><template slot-scope="scope">{{ scope.row.vin?scope.row.vin:'-' }}</template></el-table-column>
            <el-table-column label="车系"><template slot-scope="scope">{{ scope.row.vehicleSeriesName?scope.row.vehicleSeriesName:'-' }}</template></el-table-column>
            <el-table-column label="车型"><template slot-scope="scope">{{ scope.row.vehicleModeName?scope.row.vehicleModeName:'-' }}</template></el-table-column>
            <el-table-column label="车牌号"><template slot-scope="scope">{{ scope.row.vehicleNumber?scope.row.vehicleNumber:'-' }}</template></el-table-column>
            <el-table-column label="是否已通知客户"><template slot-scope="scope">{{ scope.row.noticeStatus==='0'?'已通知':'未通知' }}</template></el-table-column>
            <el-table-column label="解绑说明">
              <template slot-scope="scope">
                <el-popover
                  :content="scope.row.revokeDesc"
                  trigger="hover">
                  <div slot="reference">{{ scope.row.revokeDesc?scope.row.revokeDesc.slice(0,10):'-' }}</div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <span>{{ total }}条记录，共{{ totalPage }}页</span>
            <el-pagination
              :total="total"
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
import { vehicleList } from '@/api/member.js'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Unbind',
  components: {
    breadcrumb
  },
  data() {
    const checkAId = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback()
      } else if (value.length > 3) {
        callback()
      } else {
        callback(new Error('请输入正确的aId'))
      }
    }
    const checkVin = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback()
      } else if (value.length === 17) {
        callback()
      } else {
        callback(new Error('请输入17位车辆识别码'))
      }
    }

    return {
      searchForm: {
        phone: '',
        aId: '',
        time: ['', ''],
        vin: ''
      },
      rules: {
        aId: [{ validator: checkAId, type: 'sring' }],
        vin: [{ validator: checkVin, type: 'sring' }]
      },
      pageSize: 10,
      total: 10,
      pageNo: 1,
      tableData: [],
      totalPage: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    clearOptions() {
      this.searchForm = {
        phone: '',
        aId: '',
        time: ['', ''],
        vin: ''
      }
    },
    init() {
      const param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        phone: this.searchForm.phone,
        aId: this.searchForm.aId,
        vin: this.searchForm.vin,
        RequestParam: this.searchForm.RequestParam,
        startTime: this.searchForm.time[0],
        endTime: this.searchForm.time[1]
      }
      vehicleList(param).then(res => {
        this.pageSize = res.pageSize
        this.totalPage = res.totalPage
        this.total = res.totalNum
        this.tableData = res.result
      })
    },
    submitForm() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          console.log('done')
        }
      })
    },
    currentChange(num) {
      this.pageNo = num
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
