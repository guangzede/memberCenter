<template>
  <div>
    <router-view v-if="this.$route.path !=='/rights/information'" class="sibling" />
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
                <el-form-item label="创建时间">
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
                <el-form-item :rules="rules.check" label="权益编码" prop="rightCode">
                  <el-input v-model="searchForm.rightCode" clearable placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item :rules="rules.check" label="权益名称" prop="rightName">
                  <el-input v-model="searchForm.rightName" clearable placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :xl="6" :lg="8" :md="12">
                <el-form-item label="权益状态">
                  <el-select v-model="searchForm.rightStatus" clearable placeholder="请选择">
                    <el-option
                      v-for="item of status"
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
          <div class="class-name">权益信息列表</div>
          <div class="flex-buttons">
            <el-button type="primary" @click="addInformation('add')" >新增权益信息</el-button>
          </div>
          <el-table :data="actionTableData" style="width: 100%" stripe>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="rightCode" label="权益编码" />
            <el-table-column prop="rightType" label="权益类别" >
              <template slot-scope="scope">
                {{ labelMatchValue('rightType',scope.row.rightType) }}
              </template>
            </el-table-column>
            <el-table-column prop="rightBusinessType" label="权益业务分类">
              <template slot-scope="scope">
                {{ labelMatchValue('rightBusinessType',scope.row.rightBusinessType) }}
              </template>
            </el-table-column>
            <el-table-column prop="rightSource" label="权益来源">
              <template slot-scope="scope">
                {{ labelMatchValue('rightSource',scope.row.rightSource) }}
              </template>
            </el-table-column>
            <el-table-column prop="grantPattern" label="权益发放方式">
              <template slot-scope="scope">
                {{ labelMatchValue('grantPattern',scope.row.grantPattern) }}
              </template>
            </el-table-column>
            <el-table-column prop="rightName" label="权益名称"/>
            <el-table-column prop="account" label="发行总量" />
            <el-table-column prop="valideTime" label="权益有效期" >
              <template slot-scope="scope">{{ scope.row.valideTime?scope.row.valideTime+'个月':'永久有效' }}</template>
            </el-table-column>
            <el-table-column prop="rightDesc" label="权益描述" />
            <el-table-column prop="rightStatus" label="权益应用状态">
              <template slot-scope="scope">
                {{ labelMatchValue('rightStatus',scope.row.rightStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="createBy" label="操作人" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column label="操作" width="250px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="addInformation('detail',scope.row)">详情</el-button>
                <el-divider direction="vertical" />
                <el-button type="text" @click="addInformation('edit',scope.row)" >编辑</el-button>
                <el-divider direction="vertical" />
                <el-popconfirm title="您确定【启用】该权益信息的应用？" @confirm="updataFlag(scope.row,'0')">
                  <el-button slot="reference" :disabled="scope.row.rightStatus==0" type="text">启用</el-button>
                </el-popconfirm>
                <el-divider direction="vertical" />
                <el-popconfirm title="您确定【禁用】该权益信息的应用？" @confirm="updataFlag(scope.row,'1')">
                  <el-button slot="reference" :disabled="scope.row.rightStatus==1" type="text">禁用</el-button>
                </el-popconfirm>
                <!-- <el-divider direction="vertical" />
                <el-button type="text" @click="linkTo(`/rights/information/config`,scope.row)">去配置</el-button> -->
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
import { rightsQueryInfo, updateRightInfoStatus } from '@/api/rights'
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
    return {
      searchForm: {
        time: ['', ''],
        rightCode: null,
        rightName: null,
        rightStatus: null
      },
      total: 10,
      pageNo: 1,
      totalPage: 0,
      pageSize: 10, actionTableData: [],
      growthType: [
        { value: '0', label: '互动成长值' },
        { value: '1', label: '转化成长值' },
        { value: '2', label: '车主行为成长值' }
      ],
      status: [
        { value: '', label: '全选' },
        { value: '0', label: '启用' },
        { value: '1', label: '禁用' }
      ],

      rightSource: [
        { label: '自建', value: '0' },
        { label: '电商', value: '1' },
        { label: '兑吧', value: '2' }
      ],
      rightBusinessType: [
        { label: '维修保养', value: '0' },
        { label: '商城优惠', value: '1' },
        { label: '金融保险', value: '2' },
        { label: '活动特权', value: '3' },
        { label: '异业合作', value: '4' },
        { label: '其他', value: '5' }
      ],
      rightType: [
        { label: '消费类', value: '0' },
        { label: '非消费类', value: '1' }
      ],
      restrictionTime: [
        { label: '6个月', value: '6' },
        { label: '12个月', value: '12' },
        { label: '24个月', value: '24' },
        { label: '36个月', value: '36' },
        { label: '60个月', value: '60' },
        { label: '永久有效', value: '' }
      ],
      grantPattern: [
        { label: '会员通用权益', value: '0' },
        { label: '应用端自定义权益', value: '1' }
      ],
      rightStatus: [
        { label: '启用', value: '0' },
        { label: '禁用', value: '1' }
      ],
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
      return this[tag].filter(ele => {
        return ele.value === value
      })[0].label
    },
    addInformation(type, data) {
      this.$store.commit('setRightsType', type)
      this.$router.push('/rights/information/' + type)
      if (data) {
        this.$store.commit('postData', data)
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
        rightStatus: this.searchForm.rightStatus,
        rightName: this.searchForm.rightName,
        rightCode: this.searchForm.rightCode,
        pageNo: pageNo,
        pageSize: this.pageSize
      }
      rightsQueryInfo(param).then(res => {
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.pageNo = res.pageNo
        this.actionTableData = res.result
      })
    },
    clearOptions() {
      this.searchForm = {
        time: ['', ''],
        rightCode: null,
        rightName: null,
        rightStatus: null
      }
    },
    linkTo(path, data, type) {
      this.$router.push(path)
      if (data) this.$store.commit('postData', data)
      if (type) this.$store.commit('editable', type)
    },
    updataFlag(row, flag) {
      updateRightInfoStatus({ id: row.id, rightStatus: flag, rightCode: row.rightCode }).then(res => {
        if (res.resultStatus !== 'FAILED') {
          this.$message({
            message: flag === '0' ? '启用成功' : '禁用成功',
            type: 'success'
          })
          row.rightStatus = flag
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
