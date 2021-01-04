<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions('changeSearchForm')">清空</el-button>
          <el-button type="primary" @click="getChangeData(1)">查询</el-button>
        </div>
        <el-form
          ref="searchForm"
          :model="changeSearchForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="所属应用" prop="clientId">
                <el-select v-model="changeSearchForm.clientId" clearable style="width: 200px">
                  <el-option
                    v-for="item in clientList"
                    :key="item.id"
                    :label="item.clientName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item :rules="rules.inputText" label="姓名" prop="userName">
                <el-input v-model="changeSearchForm.userName" maxlength="10" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item :rules="rules.inputText" label="手机号" prop="userPhone">
                <el-input v-model="changeSearchForm.userPhone" maxlength="11" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :lg="8" :xl="6" :md="12">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="createDate"
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
        <div class="class-name">个人子账户列表</div>
        <el-table :data="changeTableData" style="width: 100%" stripe>
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column prop="clientName" label="所属应用" />
          <el-table-column prop="userName" label="姓名"/>
          <el-table-column prop="userPhone" label="手机号"/>
          <el-table-column prop="totalIntegral" label="子账户当前积分"/>
          <el-table-column prop="clientName" label="关联的应用账户" />
        </el-table>
        <div class="table-footer">
          <span>{{ total }}条记录，共{{ totalPage }}页</span>
          <el-pagination
            :total="total"
            :current-page="pageNo"
            background
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { childAccountListDataMap } from '@/api/personalAccount'
import { selectToeClients } from '@/api/accumulate'
export default {
  name: 'ChildAccount',
  data() {
    const validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符！！'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        inputText: [
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      clientList: [],
      createDate: ['', ''],
      changeTableData: [],
      changeSearchForm: {
        clientId: '',
        userName: '',
        userPhone: '',
        startDate: '',
        endDate: ''
      },
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0
    }
  },
  computed: {
    flush() {
      return this.$store.getters.flush
    }
  },
  watch: {
  },
  mounted() {
    this.getToeClients()
    this.currentChange(1)
  },
  methods: {
    checkSpecialKey(str) {
      const specialKey = "[`%~!#$^&*()={}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    },
    currentChange(num) {
      this.pageNo = num
      this.getChangeData(num)
    },
    getToeClients() {
      selectToeClients().then(res => {
        this.clientList = res.data
      })
    },
    getChangeData(pageNo) {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.pageNo = pageNo
          this.changeSearchForm.pageNo = this.pageNo
          this.changeSearchForm.pageSize = this.pageSize
          if (this.createDate !== null) {
            if (this.createDate[0] !== '') {
              this.changeSearchForm.startDate = this.createDate[0] + 'T00:00:00'
            }
            if (this.createDate[1] !== '') {
              this.changeSearchForm.endDate = this.createDate[1] + 'T23:59:59'
            }
          }
          childAccountListDataMap(this.changeSearchForm).then(res => {
            this.total = res.result.total
            this.totalPage = res.result.pages
            this.changeTableData = res.result.list
          })
        }
      })
    },
    clearOptions() {
      this.changeSearchForm = {
        clientId: '',
        userName: '',
        userPhone: '',
        startDate: '',
        endDate: ''
      }
      this.createDate = ['', '']
    }
  }
}
</script>
