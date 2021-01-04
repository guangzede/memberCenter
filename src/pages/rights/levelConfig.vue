<template>
  <div>
    <router-view v-if="this.$route.path !=='/rights/levelConfig'" class="sibling" />
    <div class="sibling">
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
                <el-form-item label="权益配置时间">
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
                <el-form-item :rules="rules.check" label="会员等级名称">
                  <el-select v-model="searchForm.levelId" placeholder="请选择" clearable>
                    <el-option v-for="item of level" :key="item.id" :label="item.levelName" :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item :rules="rules.check" label="权益状态" >
                  <el-select v-model="searchForm.rightStatus" placeholder="请选择" clearable>
                    <el-option v-for="item of rightStatus" :key="item.label" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item :rules="rules.check" label="权益编码" prop="rightCode">
                  <el-input v-model="searchForm.rightCode" clearable placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item :rules="rules.check" label="权益名称" prop="rightName">
                  <el-input v-model="searchForm.rightName" clearable placeholder="请输入" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">会员等级权益信息列表</div>
          <div class="flex-buttons">
            <el-button type="primary" @click="$router.push('/rights/levelConfig/rightsConfigList')" >配置会员权益</el-button>
          </div>
          <el-table :data="unused" style="width: 100%" stripe>
            <el-table-column prop="createTime" label="权益配置时间" />
            <el-table-column prop="level" label="会员等级" />
            <el-table-column prop="levelName" label="会员等级名称" />
            <el-table-column prop="rightName" label="权益名称" />
            <el-table-column prop="rightType" label="权益类别" >
              <template slot-scope="scope">
                {{ labelMatchValue('rightType',scope.row.rightType) }}
              </template>
            </el-table-column>
            <el-table-column prop="account" label="收益发放数量" />
            <el-table-column prop="rightCode" label="权益编码" />
            <el-table-column prop="valideTime" label="权益有效期" >
              <template slot-scope="scope">{{ scope.row.valideTime?scope.row.valideTime+'个月':'永久有效' }}</template>
            </el-table-column>
            <el-table-column prop="rightStatus" label="权益状态" >
              <template slot-scope="scope">
                {{ labelMatchValue('rightStatus',scope.row.rightStatus) }}
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
              @current-change="currentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryLevelRightInfo, queryUserLevel } from '@/api/rights'
export default {
  name: 'LevelConfig',
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
    return {
      searchForm: {
        time: ['', ''],
        levelId: null,
        rightStatus: null,
        rightCode: null,
        rightName: null
      },
      level: [],
      rightType: [
        { label: '消费类', value: '0' },
        { label: '非消费类', value: '1' }
      ],
      rightStatus: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ],
      total: 10,
      pageNo: 1,
      totalPage: 0,
      pageSize: 10,
      unused: [],
      rules: {
        check: [
          { validator: check, trigger: 'blur' }
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
    'flush': {
      immediate: true,
      handler(n) {
        if (n) this.currentChange(1)
      }
    }
  },

  mounted() {
    queryUserLevel().then(res => {
      this.level = res.result
    })
    this.currentChange(1)
  },
  methods: {
    labelMatchValue(tag, value) {
      return this[tag].filter(ele => {
        return ele.value === value
      })[0].label
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
        levelId: this.searchForm.levelId,
        rightStatus: this.searchForm.rightStatus,
        rightCode: this.searchForm.rightCode,
        rightName: this.searchForm.rightName,
        pageNo: pageNo,
        pageSize: this.pageSize
      }
      queryLevelRightInfo(param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.pageNo = res.pageNo
        this.unused = res.result
      })
    },
    clearOptions() {
      this.searchForm = {
        time: ['', ''],
        levelId: null,
        rightStatus: null,
        rightCode: null,
        rightName: null
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
