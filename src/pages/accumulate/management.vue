<template>
  <div >
    <router-view v-if="this.$route.path !=='/accumulate/management'" :editable="editable" class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb/>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name" >查询条件</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="clearOptions">清空</el-button>
            <el-button @click="checkParam">查询</el-button>
          </div>
          <el-form ref="searchForm" :model="searchForm" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
            <el-row :gutter="20">
              <el-col :lg="8" :md="12" >
                <el-form-item label="创建时间">
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
              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.check" label="积分规则编码" prop="tacticsCode">
                  <el-input v-model="searchForm.tacticsCode" clearable placeholder="请输入"/>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12">
                <el-form-item :rules="rules.check" label="积分规则名称" prop="tacticsRemark">
                  <el-input v-model="searchForm.tacticsRemark" clearable placeholder="请输入"/>
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item label="积分规则状态">
                  <el-select v-model="searchForm.tacticsFlag" :width="120" placeholder="请选择">
                    <el-option v-for="item in scoreRule" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">积分规则配置列表</div>
          <div class="flex-buttons">
            <el-button @click="linkTo('','','addRule')">新增积分规则</el-button>
          </div>
          <el-table :data="tableData" style="width: 100%" stripe>
            <el-table-column prop="createDate" label="创建时间" />
            <el-table-column prop="tacticsCode" label="积分规则编码"/>
            <el-table-column prop="changeType" label="积分规则类型">
              <template slot-scope="scope">
                {{ scope.row.changeType==='integral_minus'?'积分减少':'积分增加' }}
              </template>
            </el-table-column>
            <el-table-column prop="tacticsRemark" label="积分规则名称"/>
            <el-table-column prop="tacticsType" label="是否固定积分">
              <template slot-scope="scope">
                {{ scope.row.tacticsType==='regular'?'是':'否' }}
              </template>
            </el-table-column>
            <el-table-column prop="tacticsIntegral" label="固定积分值">
              <template slot-scope="scope">
                {{ scope.row.tacticsType==='regular'?scope.row.tacticsIntegral:'-' }}
              </template>
            </el-table-column>
            <el-table-column prop="validateDate" label="积分有效期">
              <template slot-scope="scope">
                {{ scope.row.validateDate?scope.row.validateDate+'个月':'-' }}
              </template>
            </el-table-column>
            <el-table-column prop="validateDate" label="积分规则有效期">
              <template slot-scope="scope">
                {{ scope.row.expirationDate?scope.row.expirationDate:'-' }}
              </template>
            </el-table-column>
            <el-table-column prop="updateDate" label="更新时间" />
            <el-table-column label="操作人"><template slot-scope="scope">{{ scope.row.updateBy?scope.row.updateBy:'-' }}</template></el-table-column>
            <el-table-column label="操作" width="190px">
              <template slot-scope="scope">
                <el-button type="text" @click="linkTo(true,scope.row,'detail')">详情</el-button>
                <el-divider direction="vertical"/>
                <el-button type="text" @click="linkTo(false,scope.row,'eidtor')">编辑</el-button>
                <el-divider direction="vertical"/>
                <el-popconfirm title="点击确定后将启用本条策略" @onConfirm="updataFlag(scope.row,'0')">
                  <el-button slot="reference" :disabled="scope.row.tacticsFlag==='0'" type="text" >启用</el-button>
                </el-popconfirm>
                <el-divider direction="vertical"/>
                <el-popconfirm title="点击确定后将禁用本条策略" @onConfirm="updataFlag(scope.row,'1')">
                  <el-button slot="reference" :disabled="scope.row.tacticsFlag==='1'" type="text" >禁用</el-button>
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
import { getInfo, putFlag } from '@/api/score'
export default {
  name: 'AccManagement',
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
    return {
      searchForm: {
        creatTime: ['', ''],
        tacticsCode: '',
        tacticsRemark: '',
        tacticsFlag: ''
      },

      editable: false,
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0,
      data: {},
      scoreRule: [
        { value: '', label: '全部' },
        { value: '0', label: '启用' },
        { value: '1', label: '禁用' }
      ],
      tableData: [{}],
      param: {},
      rules: {
        check: [
          { validator: validateCheck, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initParam(1)
    this.init()
  },
  methods: {
    checkParam() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.initParam(1)
          this.init()
        }
      })
    },
    initParam(pageNo) {
      const param = {
        startTime: this.searchForm.creatTime[0],
        endTime: this.searchForm.creatTime[1],
        tacticsCode: this.searchForm.tacticsCode,
        tacticsRemark: this.searchForm.tacticsRemark,
        tacticsFlag: this.searchForm.tacticsFlag,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
      this.param = { ...param }
    },
    updataFlag(row, flag) {
      var temp = { ...row }
      temp.tacticsFlag = flag
      putFlag(temp).then(res => {
        row.tacticsFlag = flag
        this.$message({
          message: flag === '0' ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    },
    clearOptions() {
      this.searchForm = {
        creatTime: ['', ''],
        tacticsCode: '',
        tacticsRemark: '',
        tacticsFlag: ''
      }
    },
    init() {
      getInfo(this.param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.pageNo = res.pageNo
        this.tableData = [...res.result]
      })
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    linkTo(type, row, path) {
      this.$store.commit('postData', row)
      this.$store.commit('editable', type)
      this.$router.push(`/accumulate/management/${path}`)
    }
  }
}
</script>
