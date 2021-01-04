<template>
  <div>
    <router-view v-if="this.$route.path !=='/accumulate/adjustmentAudit'" class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb />
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="baseInfo">
            <el-button slot="label" :type="activeName==='baseInfo'?'primary':'default'" size="medium"> 待审核</el-button>
            <div class="app-container shadow">
              <div class="content ">
                <div class="class-name">查询条件</div>
                <div class="flex-buttons">
                  <el-button type="transparent" @click="clearOption">清空</el-button>
                  <el-button type="primary" @click="checkForm1('0',1)">查询</el-button>
                </div>
                <el-form ref="searchForm1" :model="searchForm" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8" :md="12">
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
                    <el-col :xl="6" :lg="8" :md="12" >
                      <el-form-item :rules="rules.check" label="申请单号" prop="number">
                        <el-input v-model="searchForm.number" clearable placeholder="请输入申请单号"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
            <div class="app-container shadow">
              <div class="content">
                <div class="class-name">积分调整申请列表</div>
                <el-table :data="tableData" style="width: 100%" stripe >
                  <el-table-column prop="createDate" label="申请时间"/>
                  <el-table-column prop="applyNum" label="申请单号"/>
                  <el-table-column prop="createBy" label="申请人"/>
                  <el-table-column prop="applyDesc" label="调整说明"/>
                  <el-table-column label="申请单状态">
                    <template slot-scope="scope">
                      {{ scope.row.applyStatus=='0'?'待审核':'已审核' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="linkTo('auditInfo',scope.row,true,false)">审核</el-button>
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
          </el-tab-pane>
          <el-tab-pane name="carInfo">
            <el-button slot="label" :type="activeName==='carInfo'?'primary':'default'" size="medium" > 已审核</el-button>
            <div class="app-container shadow">
              <div class="content">
                <div class="class-name">查询条件</div>
                <div class="flex-buttons">
                  <el-button type="transparent" @click="clearOption">清空</el-button>
                  <el-button type="primary" @click="checkForm2('1',1)">查询</el-button>
                </div>
                <el-form ref="searchForm2" :model="searchForm" type="flex" justify="start" label-width="100px" label-position="left" @submit.native.prevent>
                  <el-row :gutter="20">
                    <el-col :xl="6" :lg="8" :md="12">
                      <el-form-item label="审核时间">
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
                    <el-col :xl="6" :lg="8" :md="12" >
                      <el-form-item :rules="rules.check" label="申请单号" prop="number">
                        <el-input v-model="searchForm.number" clearable placeholder="请输入申请单号"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
            <div class="shadow app-container">
              <div class="content">
                <div class="class-name">积分调整审核列表</div>
                <!-- <div class="flex-buttons">
                  <el-button >一键审核</el-button>
                </div> -->
                <el-table :data="tableData" style="width: 100%" stripe >
                  <el-table-column prop="createDate" label="申请时间"/>
                  <el-table-column prop="applyNum" label="申请单号"/>
                  <el-table-column prop="createBy" label="申请人"/>
                  <el-table-column label="审核结果">
                    <template slot-scope="scope">
                      {{ scope.row.applyResult==='0'?'审核通过':'审核不通过' }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="applyDesc" label="调整说明"/> -->
                  <el-table-column label="申请单状态">
                    <template slot-scope="scope">
                      {{ scope.row.applyStatus=='0'?'待审核':'已审核' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="linkTo('orderDetail',scope.row,false,true)">详情</el-button>
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
          </el-tab-pane>
        </el-tabs>
      </div>

    </div>
  </div>

</template>

<script>
import { applyInfoList } from '@/api/accumulate'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Detail',
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
        time: ['', ''],
        number: ''
      },
      activeName: 'baseInfo',
      pageSize: 15,
      total: 1,
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      applyStatus: 0,
      rules: {
        check: { validator: validateCheck, trigger: 'blur' }
      }
    }
  },
  created() {
    this.init(0)
  },
  methods: {

    checkForm1(a, b) {
      this.$refs['searchForm1'].validate((valid) => {
        if (valid) {
          this.init(a, b)
        }
      })
    },
    checkForm2(a, b) {
      this.$refs['searchForm2'].validate((valid) => {
        if (valid) {
          this.init(a, b)
        }
      })
    },
    clearOption() {
      this.searchForm = {
        time: ['', ''],
        number: ''
      }
    },
    init(pageNo) {
      const param = {
        applyStatus: this.applyStatus,
        startTime: this.searchForm.time[0],
        endTime: this.searchForm.time[1],
        applyNum: this.searchForm.number,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
      applyInfoList(param).then(res => {
        this.tableData = res.result
        this.total = res.totalNum
        this.pageNo = res.pageNo
        this.totalPage = res.totalPage
      })
    },
    currentChange(pageNo) {
      this.init(pageNo)
    },
    handleClick(tab, event) {
      this.clearOption()
      this.pageNo = 1
      this.applyStatus = tab.index
      this.init(tab.index)
      console.log(tab.index)
    },
    linkTo(path, data, type, isAdjustment) {
      this.$store.commit('postData', data)
      this.$store.commit('editable', type)
      this.$store.commit('isAdjustment', isAdjustment)
      this.$router.push(`/accumulate/adjustmentAudit/${path}`)
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
