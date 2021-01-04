<template>
  <div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clearOptions('changeSearchForm')">清空</el-button>
          <el-button type="primary" @click="checkForm(1)">查询</el-button>
        </div>
        <el-form
          ref="searchForm"
          :model="changeSearchForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <el-row :gutter="20">
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="创建时间">
                <el-date-picker
                  v-model="changeSearchForm.createTime"
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
                  v-model="changeSearchForm.time"
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
              <el-form-item :rules="rules.check" label="成长值规则编码" prop="tacticsCode">
                <el-input v-model="changeSearchForm.tacticsCode" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item :rules="rules.check" label="成长值规则名称" prop="tacticsRemark">
                <el-input v-model="changeSearchForm.tacticsRemark" clearable placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :xl="6" :lg="8" :md="12">
              <el-form-item label="成长值规则状态">
                <el-select v-model="changeSearchForm.tacticsFlag" placeholder="请选择">
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
        <div class="flex-buttons">
          <el-button
            type="primary"
            @click="linkTo('/growth/growthConfig/addRule')"
          >新增成长值规则</el-button>
        </div>
        <el-table :data="changeTableData" style="width: 100%" stripe>
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column prop="tacticsCode" label="成长值规则编码" />
          <el-table-column prop="tacticsRemark" label="成长值规则名称" />
          <el-table-column prop="tacticsType" label="成长值计算方式">
            <template
              slot-scope="scope"
            >{{ scope.row.tacticsType==='regular'?'固定成长值': scope.row.tacticsType==='amount'?'根据参数值换算':'应用端自定义成长值' }}</template>
          </el-table-column>
          <el-table-column prop="tacticsIntegral" label="计算参数数值">
            <template slot-scope="scope">
              <template v-if="scope.row.tacticsType==='amount'">{{ scope.row.growthRatio }}%</template>
              <template
                v-else-if="scope.row.tacticsType==='regular'"
              >{{ scope.row.tacticsIntegral }}</template>
              <template v-else>≤{{ scope.row.tacticsIntegral }}</template>
            </template>
          </el-table-column>
          <el-table-column prop="province" label="成长值有效期">
            <template
              slot-scope="scope"
            >{{ scope.row.validateDate===''?'永久有效':scope.row.validateDate +'个月' }}</template>
          </el-table-column>
          <el-table-column prop="updateDate" label="更新时间" />
          <el-table-column prop="updateBy" label="操作人" />
          <el-table-column label="操作" width="190px">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="linkTo('/growth/rule/transformDetail',scope.row,true)"
              >详情</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="linkTo('/growth/rule/transformEditor',scope.row,false)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-popconfirm title="点击确定后将启用本条策略" @onConfirm="updataFlag(scope.row,'0')">
                <el-button slot="reference" :disabled="scope.row.tacticsFlag==0" type="text">启用</el-button>
              </el-popconfirm>
              <el-divider direction="vertical" />
              <el-popconfirm title="点击确定后将禁用本条策略" @onConfirm="updataFlag(scope.row,'1')">
                <el-button slot="reference" :disabled="scope.row.tacticsFlag==1" type="text">禁用</el-button>
              </el-popconfirm>
              <!-- <el-button :disabled="scope.row.tacticsFlag==1" type="text" @click="updataFlag(scope.row,'1')">禁用</el-button> -->
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
import { getGrowthTacticsList } from '@/api/growth'
import { postAdd } from '@/api/growth'
export default {
  name: 'Manual',
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
      changeTableData: [],
      changeSearchForm: {
        time: ['', ''],
        createTime: ['', ''],
        tacticsCode: null,
        tacticsRemark: null,
        tacticsFlag: null,
        isGrowth: 0
      },
      pageSize: 10,
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
    'flush': {
      deep: true,
      handler() {
        this.currentChange(1)
      }
    }
  },
  mounted() {
    this.currentChange(1)
  },
  methods: {
    checkForm(a) {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.getChangeData(a)
        }
      })
    },
    currentChange(num) {
      this.pageNo = num
      this.getChangeData(num)
    },
    getChangeData(pageNo) {
      const param = {
        startTime: this.changeSearchForm.time[0],
        endTime: this.changeSearchForm.time[1],
        createStartTime: this.changeSearchForm.createTime[0],
        createEndTime: this.changeSearchForm.createTime[1],
        tacticsCode: this.changeSearchForm.tacticsCode,
        tacticsRemark: this.changeSearchForm.tacticsRemark,
        tacticsFlag: this.changeSearchForm.tacticsFlag,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
      getGrowthTacticsList(param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.changeTableData = res.result
        this.pageNo = res.pageNo
      })
    },
    clearOptions() {
      this.changeSearchForm = {
        time: ['', ''],
        createTime: ['', ''],
        tacticsCode: null,
        tacticsRemark: null,
        tacticsFlag: null,
        isGrowth: 0
      }
    },
    linkTo(path, data, type) {
      this.$store.commit('postData', data)
      this.$store.commit('editable', type)
      this.$router.push(path)
    },
    updataFlag(data, flag) {
      data.tacticsFlag = flag
      postAdd(data).then(res => {
        this.$message({
          message: flag === '0' ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
