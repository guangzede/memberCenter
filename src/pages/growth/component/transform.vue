<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="flex-buttons left">
          <el-button
            :class="activeName2==='first'?'check':''"
            type="text"
            @click="activeName2='first'"
          >积分规则关联</el-button>
          <el-button
            :class="activeName2==='second'?'check':''"
            type="text"
            @click="activeName2='second'"
          >手动添加规则</el-button>
        </div>
        <el-divider />
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions('transformSearchForm')">清空</el-button>
          <el-button type="primary" @click="checkForm(1)">查询</el-button>
        </div>
        <el-form
          v-if="activeName2==='first'"
          ref="searchForm"
          :model="transformSearchForm"
          type="flex"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="transformSearchForm.createTime"
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
              <el-form-item label="更新时间">
                <el-date-picker
                  v-model="transformSearchForm.time"
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
              <el-form-item :rules="rules.check" label="积分规则编码" prop="tacticsCode">
                <el-input
                  v-model="transformSearchForm.tacticsCode"
                  maxlength="50"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item :rules="rules.check" label="积分规则名称" prop="tacticsRemark">
                <el-input
                  v-model="transformSearchForm.tacticsRemark"
                  maxlength="50"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="积分规则状态">
                <el-select v-model="transformSearchForm.tacticsFlag" placeholder="请选择">
                  <el-option
                    v-for="item of changeType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">成长值规则配置列表</div>
        <el-table :data="transformTableData" style="width: 100%" stripe>
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column prop="tacticsCode" label="关联积分规则编码" />
          <el-table-column prop="tacticsRemark" label="关联积分规则名称" />
          <el-table-column prop="tacticsType" label="是否固定积分">
            <template slot-scope="scope">{{ scope.row.tacticsType==='regular'?'是':'否' }}</template>
          </el-table-column>
          <el-table-column prop="province" label="成长值有效期">
            <template
              slot-scope="scope"
            >{{ scope.row.growthValidateDate===''?'永久有效':scope.row.growthValidateDate +'个月' }}</template>
          </el-table-column>
          <el-table-column prop="tacticsFlag" label="规则状态">
            <template slot-scope="scope">{{ scope.row.tacticsFlag=='0'?'启用':'禁用' }}</template>
          </el-table-column>
          <el-table-column prop="updateDate" label="更新时间" />
          <el-table-column prop="updateBy" label="操作人" />
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="linkTo('/growth/growthConfig/interactionDetail',scope.row,true)"
              >详情</el-button>
              <!-- <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="linkTo('/growth/growthConfig/interactionEditor',scope.row,false)"
              >编辑</el-button> -->
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
</template>

<script>
import { getIntegralTacticsList, getGrowthTacticsList, postAdd } from '@/api/growth'
export default {
  name: 'Transform',
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
      transformSearchForm: {
        time: ['', ''],
        createTime: ['', ''],
        tacticsCode: null,
        tacticsRemark: null,
        tacticsFlag: null,
        isGrowth: 0
      },
      transformTableData: [],
      changeTableData: [],
      pageSize: 10,
      activeName2: 'first',
      total: 10,
      pageNo: 1,
      totalPage: 0,
      changeType: [
        { value: '', label: '全部' },
        { value: '0', label: '启用' },
        { value: '1', label: '禁用' }
      ],
      rules: {
        check: { validator: validateCheck, trigger: 'blur' }
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
      immediate: true,
      handler(n) {
        this.search(1)
      }
    },
    'flush': {
      deep: true,
      immediate: true,
      handler() {
        this.search(1)
      }
    }
  },
  mounted() {},
  methods: {
    checkForm(a) {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.search(a)
        }
      })
    },
    updataFlag(row, flag) {
      const temp = { ...row }
      temp.tacticsFlag = flag
      postAdd(temp).then(res => {
        row.tacticsFlag = flag
        this.$message({
          message: flag === '0' ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    },
    search(pageNo) {
      const param = {
        startTime: this.transformSearchForm.time[0],
        endTime: this.transformSearchForm.time[1],
        createStartTime: this.transformSearchForm.createTime[0],
        createEndTime: this.transformSearchForm.createTime[1],
        tacticsCode: this.transformSearchForm.tacticsCode,
        tacticsRemark: this.transformSearchForm.tacticsRemark,
        tacticsFlag: this.transformSearchForm.tacticsFlag,
        isGrowth: this.transformSearchForm.isGrowth,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize,
        changeType: 'integral_add'
      }
      this.getTransformData(param)
    },
    getTransformData(param) {
      getIntegralTacticsList(param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.pageNo = res.pageNo
        this.transformTableData = res.result
      })
    },
    getChangeData(param) {
      getGrowthTacticsList(param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.changeTableData = res.result
        this.pageNo = res.pageNo
      })
    },
    clearOptions() {
      this.transformSearchForm = {
        time: ['', ''],
        createTime: ['', ''],
        tacticsCode: null,
        tacticsRemark: null,
        tacticsFlag: null,
        growthType: 1,
        isGrowth: 0
      }
    },
    linkTo(path, data, type) {
      this.$store.commit('postData', data)
      this.$store.commit('editable', type)
      this.$router.push(path)
    },
    currentChange(num) {
      this.search(num)
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-buttons.left {
  position: relative;
  top: 15px;
  text-align: left;
  padding-left: 50px;
  button {
    font-weight: normal;
    font-size: 16px;
    color: #888;
  }
  .check {
    color: #333;
    font-weight: bold;
  }
}
</style>
