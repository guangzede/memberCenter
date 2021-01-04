<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions()">清空</el-button>
          <el-button type="primary" @click="checkSearchForm(1)">查询</el-button>
        </div>
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="使用时间">
                <el-date-picker
                  v-model="searchForm.time"
                  :clearable="false"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item :rules="rules.check" label="权益名称" prop="rightName">
                <el-input v-model="searchForm.rightName" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <!-- <el-col :xl="6" :lg="8" :md="12">
              <el-form-item :rules="rules.check" label="会员姓名" prop="aId">
                <el-input v-model="searchForm.memberName" clearable placeholder="请输入" />
              </el-form-item>
            </el-col> -->
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item :rules="rules.phone" label="会员手机号" prop="phone">
                <el-input v-model="searchForm.phone" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="权益来源">
                <el-select v-model="searchForm.rightSource" placeholder="请选择" clearable>
                  <el-option v-for="item of rightSource" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">权益发放列表</div>
        <el-table :data="unused" style="width: 100%" stripe>
          <el-table-column prop="updateTime" label="使用时间" />
          <el-table-column prop="memberName" label="会员姓名" />
          <el-table-column prop="phone" label="会员手机号" />
          <el-table-column prop="rightCode" label="权益编码" />
          <el-table-column prop="rightName" label="权益名称" />
          <el-table-column prop="rightSource" label="权益来源" >
            <template slot-scope="scope">
              {{ labelMatchValue('rightSource',scope.row.rightSource) }}
            </template>
          </el-table-column>
          <el-table-column prop="useAccount" label="使用数量" />
          <el-table-column prop="grantPattern" label="权益发放方式" >
            <template slot-scope="scope">
              {{ labelMatchValue('grantPattern',scope.row.grantPattern) }}
            </template>
          </el-table-column>
          <el-table-column prop="rightBusinessType" label="权益业务分类" />
          <el-table-column prop="usedPlatform" label="使用对应平台" />
          <el-table-column prop="commemtDesc" label="使用说明" />
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
import { rightAssignmentInfo } from '@/api/rights'
export default {
  name: 'Chezhu',
  data() {
    const check = (rule, value, callback) => {
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
    const phone = (rule, value, callback) => {
      if (!value || value.match(/^[0-9]{0,11}$/)) {
        callback()
      } else {
        callback(new Error('请输入正确的号码'))
      }
    }
    return {
      searchForm: {
        time: ['', ''],
        rightName: null,
        memberName: null,
        phone: null,
        rightSource: null
      },
      rightSource: [
        { label: '自建', value: '0' },
        { label: '电商', value: '1' },
        { label: '兑吧', value: '2' }
      ],
      grantPattern: [
        { label: '会员通用权益', value: '0' },
        { label: '应用端自定义权益', value: '1' }
      ],
      total: 10,
      pageNo: 1,
      totalPage: 0,
      pageSize: 10,
      unused: [],
      rules: {
        check: [
          { validator: check, trigger: 'blur' }
        ],
        phone: [
          { validator: phone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    flush() {
      return this.$store.getters.flush
    }
  },
  watch: {
    'activeName2': {
      handler(n) {
        this.search(1)
      }
    },
    'flush': {
      immediate: true,
      handler(n) {
        if (n) this.currentChange(1)
      }
    }
  },

  mounted() {
    this.currentChange(1)
  },
  methods: {
    labelMatchValue(tag, value) {
      try {
        return this[tag].filter(ele => {
          return ele.value === value
        })[0].label
      } catch (error) {
        console.log(tag)
      }
    },
    checkSearchForm(a) {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.getActionData(a)
        }
      })
    },
    currentChange(num) {
      this.pageNo = num
      this.getActionData(num)
    },
    getActionData(pageNo) {
      const param = {
        startTime: this.searchForm.time[0],
        endTime: this.searchForm.time[1],
        rightName: this.searchForm.rightName,
        memberName: this.searchForm.memberName,
        rightSource: this.searchForm.rightSource,
        phone: this.searchForm.phone,
        pageNo: pageNo,
        pageSize: this.pageSize,
        rightStatus: 1
      }
      rightAssignmentInfo(param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.pageNo = res.pageNo
        this.unused = res.result
      })
    },
    clearOptions() {
      this.searchForm = {
        time: ['', ''],
        rightName: null,
        memberName: null,
        phone: null,
        rightSource: null
      }
    },
    linkTo(path, data, type) {
      this.$store.commit('postData', data)
      this.$store.commit('editable', type)
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
