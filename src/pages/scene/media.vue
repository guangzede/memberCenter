<template>
  <div>
    <router-view v-if="this.$route.path !=='/scene/media'" class="sibling" />
    <div class="sibling">
      <div class="background"/>
      <breadcrumb />
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">查询条件</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="clearSearchOptions">清空</el-button>
            <el-button type="primary" @click="checkSearch">查询</el-button>
          </div>
          <el-form ref="searchForm" :rules="rules" :model="searchForm" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
            <el-row :gutter="20">
              <el-col :md="12" :lg="8">
                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="searchForm.enterTime"
                    :clearable="false"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="8" >
                <el-form-item :rules="rules.name" label="事件名称" prop="name">
                  <el-input v-model="searchForm.name" clearable placeholder="请输入事件名称"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">事件信息列表</div>
          <div class="flex-buttons">
            <el-button @click="linkTo('/scene/media/add')">新增事件信息</el-button>
          </div>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="createDate" label="创建时间" />
            <el-table-column prop="eventCode" label="事件Code"/>
            <el-table-column prop="eventName" label="事件名称"/>
            <el-table-column prop="clientId" label="应用平台编码"/>
            <el-table-column prop="clientName" label="应用平台名称"/>
            <el-table-column prop="updateDate" label="更新时间"/>
            <el-table-column prop="createBy" label="操作人"/>
            <el-table-column label="操作" width="190px">
              <template slot-scope="scope">
                <el-button type="text" @click="clickDetail('detail',scope.row,true)">详情</el-button>
                <el-divider direction="vertical"/>
                <el-button type="text" @click="clickDetail('editor',scope.row,false)">编辑</el-button>
                <el-divider direction="vertical"/>
                <el-popconfirm title="点击确定后将启用本条策略" @onConfirm="updataScene(scope.row,'0')">
                  <el-button slot="reference" :disabled="scope.row.startFlag=='0'" type="text" >启用</el-button>
                </el-popconfirm>
                <el-divider direction="vertical"/>
                <el-popconfirm title="点击确定后将禁用本条策略" @onConfirm="updataScene(scope.row,'1')">
                  <el-button slot="reference" :disabled="scope.row.startFlag=='1'" type="text" >禁用</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <span>{{ total }}条记录，共{{ totalPage }}页</span>
            <el-pagination
              :total="total"
              :current-page="pageNo"
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
import { getScene, putScene } from '@/api/scene'
export default {
  name: 'Media',
  components: {
    breadcrumb
  },
  data() {
    const eventName = (rule, value, callback) => {
      let words = '[`~!@#$^&*()=|{}:;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？%+_]'
      words = [...words]
      if (!value) {
        callback()
      } else if (value && words.some(item => {
        return value.indexOf(item) > -1
      })) {
        callback(new Error('请输入合法字符'))
      } else if (value.length > 30) {
        callback(new Error('最大长度为30'))
      } else {
        callback()
      }
    }
    return {
      searchForm: {
        enterTime: ['', ''],
        name: ''
      },
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      param: {},
      rules: {
        name: [
          { validator: eventName, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initParam()
    this.init()
  },
  methods: {
    checkSearch() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.initParam(1)
          this.init()
        }
      })
    },
    clearSearchOptions() {
      this.searchForm = {
        enterTime: ['', ''],
        name: ''
      }
    },
    clickDetail(path, row, data) {
      this.$store.commit('postData', row)
      this.$store.commit('editable', data)
      this.$router.push(`/scene/media/${path}`)
    },
    updataScene(row, value) {
      const param = {
        id: row.id,
        startFlag: value
      }

      putScene(param).then(res => {
        row.startFlag = value
        this.$message({
          message: value === '0' ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    initParam(pageNo) {
      this.param = {
        startTime: this.searchForm.enterTime[0],
        endTime: this.searchForm.enterTime[1],
        eventName: this.searchForm.name,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize,
        eventType: 'integral'
      }
    },
    init() {
      getScene(this.param).then(res => {
        this.tableData = res.result
        this.pageNo = res.pageNo
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
    },
    linkTo(path, data) {
      if (data) {
        this.$store.commit('postData', data)
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
