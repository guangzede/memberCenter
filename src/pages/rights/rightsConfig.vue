<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-popconfirm title="您是否取消本次操作？" @confirm="$router.push('/rights/levelConfig/rightsConfigList')" >
            <el-button slot="reference" type="transparent" >取消</el-button>
          </el-popconfirm>

          <el-button type="primary" @click="submit">提交</el-button>
        </div>
        <div class="keyvalue">
          <div class="key">权益名称</div>
          <div class="value">{{ data.rightName }}</div>
        </div>
        <div class="keyvalue">
          <div class="key">权益编码</div>
          <div class="value">{{ data.rightCode }}</div>
        </div>
        <div class="keyvalue">
          <div class="key">权益类别</div>
          <div class="value">{{ data.rightType==='1'?'非消费类':'消费类' }}</div>
        </div>
        <div class="keyvalue">
          <div class="key">权益状态</div>
          <div class="value">{{ data.rightStatus==='0'?'启用':'禁用' }}</div>
          {{ data.rightStatus }}
        </div>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">会员权益配置</div>

        <el-table ref="table" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="level" label="会员等级" />
          <el-table-column prop="memberLevelName" label="等级名称"/>
          <el-table-column prop="ischanged" label="是否适用">
            <template slot="header" slot-scope="scope">
              是否适用<el-checkbox v-model="selectAll" true-label="1" false-label="0"/>全选
            </template>
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.configStatus" true-label="1" false-label="0"/>
            </template>
          </el-table-column>
          <el-table-column label="权益发放数量">
            <template slot-scope="scope">
              <el-input-number v-if="data.configStatus==='0'&&scope.row.configStatus=='1'" v-model.number="scope.row.account" :min="0" :max="99999" maxlength="5" placeholder="-"/>
              <el-input v-else :disabled="true" value="-" placeholder="" class="tcenter"/>
            </template>
          </el-table-column>
          <el-table-column label="发放频次">
            <template slot-scope="scope">
              <el-select v-if="data.configStatus=='0'&&scope.row.configStatus=='1'" v-model="scope.row.restrictionUnit" >
                <el-option
                  v-for="item of restrictionUnit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  empty="每日"
                />
              </el-select>
              <template v-else-if="data.configStatus=='1'&&scope.row.configStatus=='1'">{{ showText(scope.row,'restrictionUnit') }}</template>
              <template v-else>-</template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { queryLevelByRightId, addLevelRightsInfo } from '@/api/rights'
export default {
  name: 'RightConfig',
  components: {
    breadcrumb
  },
  data() {
    return {
      tableData: [],
      baseSet: null,
      selectAll: false,
      restrictionUnit: [
        { label: '当日发放', value: 'day' },
        { label: '每月发放', value: 'month' },
        { label: '每季度发放', value: 'season' },
        { label: '每半年发放', value: 'halfyear' },
        { label: '每年发放', value: 'year' }
      ]
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    }
  },
  watch: {
    selectAll: {
      handler(n) {
        this.tableData.forEach(ele => {
          ele.configStatus = n
        })
      }
    }
  },
  mounted() {
    queryLevelByRightId({ rightId: this.data.id }).then(res => {
      this.baseSet = new Set()
      this.tableData = []
      res.result.forEach(element => {
        element.configStatus = element.configStatus || '1'
      })
      this.tableData = res.result
    })
  },
  methods: {
    showText(row, prop) {
      try {
        return this.restrictionUnit.filter(item => {
          return item.value === row[prop]
        })[0].label
      } catch (e) {
        return '当日发放'
      }
    },
    submit() {
      const pool = this.tableData.filter(element => {
        element.memberRightsId = this.data.id
        return element.configStatus === '1'
      })
      if (pool.length < 1) {
        this.$message({
          message: '您未选择更改',
          type: 'warning'
        })
        return
      }
      addLevelRightsInfo(pool).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$parent.initParam(1)
        this.$parent.init()
        this.$router.push('/rights/levelConfig')
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.tcenter  >>> input{
  text-align: center;
}
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
</style>
