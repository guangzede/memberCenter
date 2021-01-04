<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">查询条件</div>
        <div class="flex-buttons">
          <el-button type="transparent" @click="clear">清空</el-button>
          <el-button @click="checkForm">查询</el-button>
        </div>
        <el-form ref="searchForm" :model="searchForm" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :lg="8" :md="12">
              <el-form-item label="应用积分池账户名称" label-width="130px" prop="accountName">
                <el-input v-model="searchForm.accountName" max="10" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item label="创建时间" prop="creatTime">
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
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">应用积分池账户列表</div>
        <div class="flex-buttons">
          <el-button @click="openDialog('','add')">新增</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column prop="accountName" label="应用积分池账户名称"/>
          <el-table-column prop="clientNames" label="应用范围"/>
          <el-table-column prop="availableMoney" label="累计充值金额（元）"/>
          <el-table-column prop="availableIntegral" label="可用积分"/>
          <el-table-column prop="failureIntegral" label="失效积分"/>
          <el-table-column prop="integralPool" label="关联积分池"/>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="openDialog(scope.row, 'details')">详情</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="openDialog(scope.row, 'edit')">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="openRecharge(scope.row)">充值</el-button>
              <el-divider direction="vertical"/>
              <el-popconfirm title="点击确定后将启用本账户" @onConfirm="updataPlat(scope.row,'1')">
                <el-button slot="reference" :disabled="scope.row.state==='1'" type="text" >启用</el-button>
              </el-popconfirm>
              <el-divider direction="vertical"/>
              <el-popconfirm title="点击确定后将禁用本账户" @onConfirm="updataPlat(scope.row,'2')">
                <el-button slot="reference" :disabled="scope.row.state==='2'" type="text" >禁用</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
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
    <el-dialog :visible.sync="dialogAdd" :before-close="handleClose" :title="titleName" width="500px">
      <el-form ref="addForm" :model="addForm" :disabled="disabledForm" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <el-form-item
          :rules="[
            { required: true, message: '请输入应用积分池账户名称', trigger: 'blur' },
          ]"
          label="应用积分池账户名称"
          prop="accountName">
          <el-input v-model="addForm.accountName" :maxlength="30" clearable/>
        </el-form-item>
        <el-form-item
          label="设置应用范围"
          prop="applyRange">
          <el-button type="text" size="medium" @click="checkStatus">选择规则应用范围</el-button>
          <el-checkbox-group v-model="applyRange" class="unClickable">
            <template v-for="(item) of rangeList">
              <el-checkbox :key="item.key" :label="item.key">{{ item.label }}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="应用积分池账户描述"
          prop="accountDesc">
          <el-input v-model="addForm.accountDesc" :maxlength="255" type="textarea" clearable/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '应用平台状态', trigger: 'blur' },
          ]"
          prop="state"
          label="应用平台状态">
          <el-radio v-model="addForm.state" label="1">启用</el-radio>
          <el-radio v-model="addForm.state" label="2">禁用</el-radio>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialogAdd=false"> 取消</el-button>
        <el-button v-if="!disabledForm" @click="addhandlear">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogRecharge" :before-close="handleClose" title="充值" width="500px">
      <el-form ref="RechargeForm" :model="RechargeForm" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <el-form-item
          :rules="[
            { required: true, message: '请选择预算', trigger: 'blur' },
          ]"
          label="选择预算"
          prop="poolId">
          <el-select v-model="RechargeForm.poolId" placeholder="请选择" clearable @change="poolChange">
            <el-option v-for="item of pools" :key="item.integralPoolCode+'('+item.integralPoolName+')'" :label="item.integralPoolCode+'('+item.integralPoolName+')'" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="可用额度（元）"
          prop="availableAmount">
          <el-input-number :disabled="true" v-model="RechargeForm.availableAmount" :controls="false" clearable/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入充值机金额', trigger: 'blur' },
          ]"
          label="充值额度（元）"
          prop="distributionAmount">
          <el-input-number v-model="RechargeForm.distributionAmount" :min="1" :max="RechargeForm.availableAmount?RechargeForm.availableAmount:0" :controls="false" :precision="0" clearable/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialogRecharge=false"> 取消</el-button>
        <el-button @click="RechargeSubmit">提交</el-button>
      </div>
    </el-dialog>

    <el-dialog :before-close="handleClose" :visible.sync="dialogRange" class="dialog" title="应用范围" width="880px">
      <el-transfer
        v-model="applyRange"
        :data="rangeData"
        :titles="['全选', '全选']"
        :button-texts="['移除', '添加']"
        style="text-align: left; display: inline-block"
        @change="transferChange"
      >
        <el-form
          slot="left-footer"
          :inline="true"
          :model="scoreForm"
          label-width="100px"
          label-position="left"
          @submit.native.prevent
        >
          <div>
            <el-form-item label="应用平台名称：" class="second">
              <el-input v-model="scoreForm.name" clearable style="width:62%" placeholder="请输入" />
              <el-button type="primary" @click="getSearchInfo">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getInfo, save, updateState, getUnselectedClient, RechargeSubmit, getPoolAll } from '@/api/application'
import { selectToeClients } from '@/api/accumulate'
export default {
  name: 'Account',
  components: {
    breadcrumb
  },
  data() {
    return {
      searchForm: {
        creatTime: ['', '']
      },
      addForm: {
        state: '1'
      },
      RechargeForm: {},
      pools: [],
      dialogAdd: false,
      titleName: '',
      pageSize: 10,
      total: 0,
      pageNo: 1,
      param: {},
      totalPage: 0,
      tableData: [],
      applyRange: [],
      rangeList: [],
      rangeData: [],
      scoreForm: {
        type: null,
        name: ''
      },
      dialogRange: false,
      dialogRecharge: false,
      disabledForm: false
    }
  },
  mounted() {
    this.initParam(1)
    this.getinfo()
  },
  methods: {
    checkForm() {
      this.initParam(1)
      this.currentChange(1)
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    openRecharge(row) {
      this.dialogRecharge = true
      this.RechargeForm = { id: row.id }
      this.getPoolAll(row.id)
    },
    poolChange(poolId) {
      for (const pool of this.pools) {
        if (pool.id === poolId) {
          this.RechargeForm.availableAmount = pool.availableAmount
        }
      }
    },
    getPoolAll(accountId) {
      getPoolAll({ accountId: accountId }).then(res => {
        this.pools = res.result
      })
    },
    openDialog(row, type) {
      if (type === 'add') {
        this.addForm = {
          state: '1'
        }
        this.applyRange = []
        this.rangeList = []
        this.titleName = '新增应用积分池账户'
        this.disabledForm = false
      }
      if (type === 'edit') {
        this.titleName = '应用积分池账户编辑'
        this.addForm = { ...row }
        this.rangeList = []
        this.applyRange = []
        selectToeClients().then(res => {
          this.rangeData = []
          for (const i of res.data) {
            this.rangeData.push({
              key: i.id,
              label: i.clientName
            })
          }
          for (const i of row.clientId.split(',')) {
            for (const j of this.rangeData) {
              if (parseInt(i) === j.key) {
                this.rangeList.push(j)
                this.applyRange.push(j.key)
              }
            }
          }
        })
        this.disabledForm = false
      }
      if (type === 'details') {
        this.titleName = '应用积分池账户详情'
        this.addForm = { ...row }
        this.rangeList = []
        this.applyRange = []
        selectToeClients().then(res => {
          this.rangeData = []
          for (const i of res.data) {
            this.rangeData.push({
              key: i.id,
              label: i.clientName
            })
          }
          for (const i of row.clientId.split(',')) {
            for (const j of this.rangeData) {
              if (parseInt(i) === j.key) {
                this.rangeList.push(j)
                this.applyRange.push(j.key)
              }
            }
          }
        })
        this.disabledForm = true
      }
      this.dialogAdd = true
      this.$refs['addForm'].clearValidate()
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    addhandlear() {
      if (this.addForm.accountName) {
        this.addForm.accountName = this.addForm.accountName.trim()
      }
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.applyRange.length) {
            const param = { ...this.addForm }
            param.applyRange = this.applyRange
            param.params = null
            save(param).then(res => {
              if (res.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.init()
                this.dialogAdd = false
                this.addForm = {
                  state: '1'
                }
              }
            })
          } else {
            return this.$message({ message: '请设置应用范围', type: 'warning' })
          }
        }
      })
    },
    RechargeSubmit() {
      this.$refs['RechargeForm'].validate((valid) => {
        if (valid) {
          RechargeSubmit(this.RechargeForm).then(res => {
            console.log(res)
            if (res.resultStatus === 'SUCCEED') {
              this.$message({
                message: '充值成功',
                type: 'success'
              })
              this.init()
              this.dialogRecharge = false
            }
          })
        }
      })
    },
    updataPlat(row, flag) {
      updateState({
        id: row.id,
        state: flag
      }).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          row.state = flag
          this.$message({
            message: flag === '1' ? '启用成功' : '禁用成功',
            type: 'success'
          })
        }
      })
    },
    initParam(pageNo) {
      this.param = {
        accountName: this.searchForm.accountName,
        pageNo: pageNo,
        pageSize: this.pageSize
      }
      if (this.searchForm.creatTime[0] !== '') {
        this.param.startTime = this.searchForm.creatTime[0] + ' 00:00:00'
      }
      if (this.searchForm.creatTime[1] !== '') {
        this.param.endTime = this.searchForm.creatTime[1] + ' 23:59:59'
      }
    },
    getinfo() {
      getInfo(this.param).then(res => {
        this.tableData = res.result.list
        this.pageSize = res.result.pageSize
        this.total = res.result.total
        this.totalPage = res.result.pages
        // this.pageNo = res.result.pageNo
      })
    },
    clear() {
      this.searchForm = {
        creatTime: ['', '']
      }
    },
    init() {
      this.dialogAdd = false
      this.getinfo()
    },
    checkStatus() {
      this.dialogRange = true
      this.getSearchInfo()
    },
    getSearchInfo() {
      getUnselectedClient({ clientName: this.scoreForm.name, accountId: this.addForm.id }).then(res => {
        this.rangeData = []
        for (const i of res.data) {
          this.rangeData.push({
            key: i.id,
            label: i.clientName
          })
        }
      })
    },
    transferChange(value, direction, movedKeys) {
      if (direction === 'right') {
        console.log('右移', value, movedKeys)
      }
      if (direction === 'left') {
        console.log('左移', value, movedKeys)
      }

      this.rangeList = []
      for (const i of this.applyRange) {
        for (const j of this.rangeData) {
          if (i === j.key) {
            this.rangeList.push(j)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .dialog {
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
  }
  .el-transfer-panel {
    width: 320px;
  }
}
  .el-form{
    text-align: left;
    .center{
      text-align: center;
    }
  }
</style>
