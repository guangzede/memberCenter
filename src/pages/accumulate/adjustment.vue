<template>
  <div>
    <router-view v-if="this.$route.path !=='/accumulate/adjustment'" class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb />
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name" >查询条件</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="clearOptions">清空</el-button>
            <el-button type="primary" @click="checkForm(1)">查询</el-button>
          </div>
          <el-form ref="searchForm" :model="searchForm" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
            <el-row :gutter="20">
              <el-col :lg="8" :md="12" >
                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="searchForm.time"
                    :clearable="false"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
                </el-form-item>
              </el-col>

              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.check" label="申请单号" prop="applyNum">
                  <el-input v-model="searchForm.applyNum" maxlength="30" clearable placeholder="请输入"/>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item label="申请单状态">
                  <el-select v-model="searchForm.applyStatus" placeholder="请选择">
                    <el-option v-for="item of changeType" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.check30" label="调整说明" prop="desc">
                  <el-input v-model="searchForm.desc" clearable placeholder="请输入"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">积分调整申请记录</div>
          <div class="flex-buttons">
            <el-button icon="el-icon-document-copy" @click="linkTo('batch','')">批量调整积分</el-button>
            <el-button icon=" el-icon-search" @click="linkTo('newApply','')">查询会员调整积分</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" stripe >
            <el-table-column prop="createDate" label="申请时间"/>
            <el-table-column prop="applyNum" label="申请单号"/>
            <el-table-column prop="createBy" label="申请人"/>
            <el-table-column prop="applyDesc" label="调整说明"/>
            <el-table-column label="申请单状态">
              <template slot-scope="scope">
                {{ scope.row.applyStatus==='0'?'待审核':'已审核' }}
              </template>
            </el-table-column>
            <el-table-column prop="approveDate" label="审核时间">
              <template slot-scope="scope">
                {{ scope.row.approveDate===''?'-':scope.row.approveDate }}
              </template>
            </el-table-column>
            <el-table-column prop="applyResult" label="审核结果">
              <template slot-scope="scope">
                {{ scope.row.applyResult==='0'?'审核通过': scope.row.applyResult==='1'?'审核不通过':'-' }}
              </template>
            </el-table-column>
            <el-table-column prop="approveBy" label="审核人">
              <template slot-scope="scope">
                {{ scope.row.approveBy===''?'-':scope.row.approveBy }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="linkTo('detail',scope.row,false)">详情</el-button>
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
              @current-change="currentChange"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { applyInfoList } from '@/api/accumulate'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Adjustments',
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
    const validateCheck30 = (rule, value, callback) => {
      let words = '[` ~!@#$^&*()=|{}:;,\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？%+_]'
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
        time: ['', ''],
        applyNum: '',
        applyStatus: ''
      },
      changeType: [
        { label: '全选', value: '' },
        { label: '待审核', value: '0' },
        { label: '已审核', value: '1' }
      ],
      pageSize: 10,
      total: 1,
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      rules: {
        check: { validator: validateCheck, trigger: 'blur' },
        check30: { validator: validateCheck30, trigger: 'blur' }
      }
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    },
    editable() {
      return this.$store.getters.editable
    }
  },
  mounted() {
    this.init()
  },
  methods: {

    checkForm(a) {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.init(a)
        }
      })
    },
    clearOptions() {
      this.searchForm.desc = ''
      this.searchForm.applyNum = ''
      this.searchForm.applyStatus = ''
      this.searchForm.time = ['', '']
    },
    init() {
      const param = {
        // desc: this.searchForm.desc,
        applyNum: this.searchForm.applyNum,
        applyStatus: this.searchForm.applyStatus,
        desc: this.searchForm.desc,
        startTime: this.searchForm.time[0],
        endTime: this.searchForm.time[1],
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      applyInfoList(param).then(res => {
        this.tableData = res.result
      })
    },
    linkTo(path, data, isAdjustment) {
      this.$store.commit('postData', data)
      this.$store.commit('isAdjustment', isAdjustment)
      this.$store.commit('editable', false)
      this.$router.push(`/accumulate/adjustment/${path}`)
    }
  }
}
</script>
