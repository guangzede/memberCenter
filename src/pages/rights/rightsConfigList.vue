<template>
  <div>
    <router-view v-if="this.$route.path !=='/rights/levelConfig/rightsConfigList'" class="sibling" />
    <div class="sibling">
      <div class="background">
        <breadcrumb />
      </div>
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
                  <el-select v-model="searchForm.rightStatus" placeholder="请选择">
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
            <!-- <el-button type="primary" @click="addInformation('add')" >新增权益信息</el-button> -->
          </div>
          <el-table :data="levelData" style="width: 100%" stripe>
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
            <el-table-column prop="rightName" label="权益名称"/>
            <el-table-column prop="valideTime" label="权益有效期" >
              <template slot-scope="scope">{{ scope.row.valideTime?scope.row.valideTime+'个月':'永久有效' }}</template>
            </el-table-column>

            <el-table-column prop="rightDesc" label="备注" />
            <el-table-column prop="rightStatus" label="权益状态">
              <template slot-scope="scope">
                {{ labelMatchValue('rightStatus',scope.row.rightStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="configStatus" label="配置状态">
              <template slot-scope="scope">
                {{ scope.row.configStatus==='0'?'未配置':'已配置' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="doConfig(scope.row)">配置</el-button>
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
import breadcrumb from '@/components/breadcrumb'
import { queryUserLevel, queryRightsConfList } from '@/api/rights'
export default {
  name: 'Media',
  components: {
    breadcrumb
  },
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
      growthType: [
        { value: '0', label: '互动成长值' },
        { value: '1', label: '转化成长值' },
        { value: '2', label: '车主行为成长值' }
      ],
      status: [
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
      rightConfigStatus: [
        { label: '未配置', value: '0' },
        { label: '已配置', value: '1' }
      ],
      searchForm: {
        rightCode: null,
        rightName: null,
        rightStatus: null
      },
      pageSize: 10,
      total: 10,
      data: {},
      pageNo: 1,
      totalPage: 0,
      tableData: [],
      levelData: [],
      dialogConfig: false,
      param: {},
      rules: {
        check: [
          { validator: check, trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.initParam()
    this.init()
  },
  methods: {
    doConfig(row) {
      this.$store.commit('postData', row)
      this.$router.push('/rights/levelConfig/rightsConfigList/config')
    },
    labelMatchValue(tag, value) {
      return this[tag].filter(ele => {
        return ele.value === value
      })[0].label
    },
    checkSearchForm() {
      this.$refs['searchForm'].validate(valid => {
        if (valid) {
          this.checkSearch()
        }
      })
    },
    clearOptions() {
      this.searchForm = {
        rightCode: null,
        rightName: null,
        rightStatus: null
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    checkSearch() {
      this.initParam(1)
      this.init()
    },
    clearSearchOptions() {
      this.searchForm = {
        enterTime: ['', ''],
        name: ''
      }
    },
    updataScene(row, value) {
      const param = {
        id: row.id,
        startFlag: value
      }
      queryUserLevel(param).then(res => {
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
        rightCode: this.searchForm.rightCode,
        rightName: this.searchForm.rightName,
        rightStatus: this.searchForm.rightStatus,
        pageNo: pageNo || this.pageNo,
        pageSize: this.pageSize
      }
    },
    init() {
      queryRightsConfList(this.param).then(res => {
        this.levelData = res.result
        this.pageNo = res.pageNo
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.keyvalue {
  & > div {
    &.key {
      width: 150px;
    }
    &.value {
      text-align: left;
      width: calc(100% - 150px);
      box-shadow: none;
    }
  }
}
.item {
  display: flex;
  justify-content: left;
}
.el-form {
  text-align: left;
}
.el-select > .el-input,
.el-form-item__content {
  width: 200px;
}

>>> .el-form-item--mini .el-form-item__label {
  font-size: 12px;
  font-weight: normal;
}
>>> .dialog {
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
  }
  .el-transfer-panel {
    width: 320px;
  }
}
.el-transfer-panel__list{
  height: 210px;
}
.el-transfer-panel .el-transfer-panel__footer {
  bottom: inherit;
  top: 40px;
}
>>> .el-dialog .el-form-item {
  width: 100%;
  margin-top: 5px;
  text-align: center;
  overflow: hidden;
  .el-form-item__content {
    width: 120px;
  }
}
>>> .el-dialog .el-form-item.second .el-form-item__content {
  width: 175px;
}
>>>.widthAuto .el-form-item__content{
  width: auto!important
}
span.info{
  color: #888;
  font-size: 80%;
}
.append:before{
  display: inline;
  content:'*';
  color: #F56C6C;
  margin-right: 4px;
  font-size:12px;
}
</style>

