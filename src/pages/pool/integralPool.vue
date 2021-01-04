<template>
  <div >
    <router-view class="sibling"/>
    <div class="sibling">
      <div class="background">
        <breadcrumb/>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name" >查询条件</div>
          <div class="flex-buttons">
            <el-button type="transparent" @click="resetQuery">清空</el-button>
            <el-button @click="handleQuery">查询</el-button>
          </div>
          <el-form ref="queryForm" :model="queryParams" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
            <el-row :gutter="20">
              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.inputText" label="积分池编码" prop="integralPoolCode">
                  <el-input
                    v-model="queryParams.integralPoolCode"
                    maxlength="30"
                    placeholder="请输入积分池编码"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item :rules="rules.inputText" label="积分池名称" prop="integralPoolName">
                  <el-input
                    v-model="queryParams.integralPoolName"
                    placeholder="请输入积分池名称"
                    maxlength="20"
                    clearable
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
              </el-col>
              <el-col :lg="8" :md="12" >
                <el-form-item label="创建时间">
                  <el-date-picker
                    v-model="queryParams.timeInterval"
                    :clearable="false"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="handleQuery"/>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </div>
      </div>
      <div class="app-container shadow">
        <div class="content">
          <div class="class-name">积分池列表</div>
          <div class="flex-buttons">
            <el-button @click="handleAdd">新增积分池</el-button>
          </div>
          <el-table :data="poolList">
            <el-table-column label="创建时间" align="center" prop="createDate"/>
            <el-table-column label="积分池编码" align="center" prop="integralPoolCode" />
            <el-table-column label="积分池名称" align="center" prop="integralPoolName" />
            <el-table-column label="充值总金额(元)" align="center" prop="rechargeLimit" />
            <el-table-column label="充值次数" align="center" prop="rechargeCount" />
            <el-table-column label="分配总金额(元)" align="center" prop="distributionAmount" />
            <el-table-column label="分配次数" align="center" prop="distributionCount" />
            <el-table-column label="可用金额(元)" align="center" prop="availableAmount" />
            <el-table-column label="预算失效日期" align="center" prop="validateDate" />
            <el-table-column label="失效金额(元)" align="center" prop="invalidAmount" />
            <el-table-column label="关联预算信息" align="center" prop="budgetCode" />
            <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="230">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleDetail(scope.row)"
                >详情</el-button>
                <el-divider direction="vertical"/>
                <el-button
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                >编辑</el-button>
                <el-divider direction="vertical"/>
                <el-popconfirm title="点击确定后将启用本条积分池" @onConfirm="handleUpdateStatus(scope.row.id,1)">
                  <el-button
                    slot="reference"
                    :disabled="scope.row.status ==='1'"
                    size="mini"
                    type="text"
                  >启用</el-button>
                </el-popconfirm>
                <el-divider direction="vertical"/>
                <el-popconfirm title="点击确定后将禁用本条积分池" @onConfirm="handleUpdateStatus(scope.row.id,0)">
                  <el-button
                    slot="reference"
                    :disabled="scope.row.status==='0'"
                    size="mini"
                    type="text"
                  >禁用</el-button>
                </el-popconfirm>
                <el-divider v-if="scope.row.status==='1' " direction="vertical"/>
                <el-button
                  v-if="scope.row.status==='1' "
                  size="mini"
                  type="text"
                  @click="handleBudget(scope.row)"
                >充值</el-button>
                <el-divider v-if="scope.row.availableAmount>0" direction="vertical"/>
                <el-button
                  v-if="scope.row.availableAmount>0"
                  size="mini"
                  type="text"
                  @click="handleDistribution(scope.row)"
                >分配</el-button>
                <!--<el-divider v-if="scope.row.invalidFlag==='1' && scope.row.invalidAmount>0 " direction="vertical"/>-->
                <!--<el-button-->
                <!-- v-if="scope.row.invalidFlag==='1' && scope.row.invalidAmount>0 "-->
                <!-- size="mini"-->
                <!-- type="text"-->
                <!-- @click="handleCarryForward(scope.row)"-->
                <!--&gt;结转</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="table-footer">
            <span>{{ total }}条记录，共{{ totalPage }}页</span>
            <el-pagination
              :total="total"
              :current-page="queryParams.pageNo"
              background
              hide-on-single-page
              layout="prev, pager, next"
              @current-change="currentChange"/>
          </div>
        </div>
      </div>
      <!-- 添加预算 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item
            v-if="dialogType===0"
            :rules="[
              {required: true, message: '请选择预算'}
            ]"
            label="选择预算"
            prop="budgetCode">
            <el-select v-model="form.budgetCode" placeholder="请选择" @change="selectedBudgetCode">
              <el-option v-for="item of budgets" :key="item.id" :label="item.budgetName" :value="item.budgetCode"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType===0" label="可用额度(元)" prop="availableAmount">
            <el-input v-model="form.budgetAmount" disabled />
          </el-form-item>
          <el-form-item v-if="dialogType===0" label="充值额度(元)" prop="budgetAmount" >
            <el-input v-model="form.budgetAmount" disabled/>
          </el-form-item>
          <el-form-item v-if="dialogType===1" label="积分池编码" prop="integralPoolCode" >
            <el-input v-model="form.integralPoolCode" disabled/>
          </el-form-item>
          <el-form-item v-if="dialogType===1 || dialogType===2" label="积分池名称" prop="integralPoolName" >
            <el-input v-model="form.integralPoolName" disabled/>
          </el-form-item>
          <el-form-item v-if="dialogType===1" label="可用额度(元)" prop="availableAmount">
            <el-input v-model="form.availableAmount" disabled/>
          </el-form-item>
          <el-form-item
            v-if="dialogType===1"
            :key="'请选择应用积分池账户'"
            :rules="[
              {required: true, message: '请选择应用积分池账户'}
            ]"
            label="选择应用积分池账户"
            prop="applicationIds">
            <el-select v-model="form.applicationIds" placeholder="选择应用积分池账户(可多选)" multiple style="width: 200px" @change="selectedApplication()" >
              <el-option v-for="item of applications" :key="item.id" :label="item.accountName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(item,index) in form.selectApplicationList"
            :label="item.accountName"
            :key="item.id"
            :rules="[
              {required: true, message: '充值金额不能为空', trigger: 'blur'},
              { type: 'number', min: 1, max: 99999999, message: '数值区间为[1-99999999]', trigger: 'blur' }]"
            :prop="'selectApplicationList.' + index + '.distributionAmount'"
          >
            <el-input v-model.number="item.distributionAmount" placeholder="请输入充值金额" maxlength="8">
              <template slot="append">(元)</template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="dialogType===2" label="结转额度(元)" prop="invalidAmount" >
            <el-input v-model="form.invalidAmount" disabled/>
          </el-form-item>
          <div v-if="dialogType===2">
            结转至：
          </div>
          <el-form-item v-if="dialogType===2" label="选择积分池" prop="notInvalidId" required>
            <el-select v-model="form.notInvalidId" placeholder="请选择">
              <el-option
                v-for="item of invalidIntegralPools"
                :key="item.id"
                :label="item.integralPoolName"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType===2" label="充值额度(元)" prop="rechargeLimit" >
            <el-input v-model="form.invalidAmount" disabled/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="transparent" @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { listPool, updatePoolStatus, recharge, getNotInvalidPoolAll, carryForward } from '@/api/integralPool'
import { listBudgetByRecharge } from '@/api/budget'
import { rechargeSubmitList, selectAccountAll } from '@/api/application'
export default {
  name: 'IntegralPool',
  components: {
    breadcrumb
  },
  data() {
    const validateInput = (rule, value, callback) => {
      if (!this.checkSpecialKey(value)) {
        callback(new Error('不能含有特殊字符！！'))
      } else {
        callback()
      }
    }
    return {
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        timeInterval: ['', ''],
        params: {
          startTime: undefined,
          endTime: undefined
        },
        integralPoolCode: null,
        integralPoolName: null
      },
      editable: false,
      // 总条数
      total: 0,
      // 总页数
      totalPage: 0,
      // 积分池表格数据
      poolList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        inputText: [
          { validator: validateInput, trigger: 'blur' }
        ]
      },
      // 预算集合
      budgets: [],
      // 应用集合
      applications: [],
      // 失效的积分池集合
      invalidIntegralPools: [],
      // 0充值 1分配
      dialogType: 0,
      oldList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    checkSpecialKey(str) {
      const specialKey = '%'
      for (let i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    },
    /** 查询积分池列表 */
    getList() {
      this.queryParams.params.startTime = this.queryParams.timeInterval[0]
      this.queryParams.params.endTime = this.queryParams.timeInterval[1]
      if (this.queryParams.params.startTime !== '') {
        this.queryParams.params.startTime = this.queryParams.params.startTime + ' 00:00:00'
      }
      if (this.queryParams.params.endTime !== '') {
        this.queryParams.params.endTime = this.queryParams.params.endTime + ' 23:59:59'
      }
      listPool(this.queryParams).then(response => {
        this.poolList = response.result.list
        this.total = response.result.total
        this.totalPage = response.result.pages
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        timeInterval: ['', ''],
        params: {
          startTime: undefined,
          endTime: undefined
        },
        integralPoolCode: null,
        integralPoolName: null
      }
      this.resetForm('queryForm')
      this.handleQuery()
    },
    currentChange(num) {
      this.queryParams.pageNo = num
      this.getList()
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
      }
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$store.commit('isDetail', false)
      this.$router.push(`/pool/integralPool/add/`)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$store.commit('isDetail', false)
      this.$router.push(`/pool/integralPool/edit/${row.id}`)
    },
    /** 修改状态按钮操作 */
    handleUpdateStatus(id, status) {
      const params = { id, status }
      updatePoolStatus(params).then(res => {
        if (res.resultStatus === 'SUCCEED') {
          this.$message({
            message: status === 0 ? '禁用成功' : '启用成功',
            type: 'success'
          })
          this.getList()
        }
      })
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      this.$store.commit('isDetail', true)
      this.$router.push(`/pool/integralPool/detail/${row.id}`)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        budgetCode: null,
        budgetAmount: null,
        integralPoolCode: null,
        integralPoolName: null,
        availableAmount: null,
        applicationIds: [],
        selectApplicationList: []
      }
      this.resetForm('form')
    },
    /** 充值按钮操作 */
    handleBudget(row) {
      this.reset()
      this.form.integralPoolId = row.id
      this.form.integralPoolCode = row.integralPoolCode
      this.getBudgetList(row.id)
    },
    /** 分配按钮操作 */
    handleDistribution(row) {
      this.reset()
      this.open = true
      this.title = '分配'
      this.form.id = row.id
      this.form.integralPoolCode = row.integralPoolCode
      this.form.integralPoolName = row.integralPoolName
      this.form.availableAmount = row.availableAmount
      this.dialogType = 1
      this.getAppListAll(row.id)
    },
    /** 结转按钮操作 */
    handleCarryForward(row) {
      this.reset()
      this.open = true
      this.title = '结转'
      this.form.invalidId = row.id
      this.form.integralPoolName = row.integralPoolName
      this.form.budgetCode = row.budgetCode
      this.form.invalidAmount = row.invalidAmount
      this.dialogType = 2
      this.getNotInvalidIntegralPools()
    },
    getBudgetList(id) {
      listBudgetByRecharge({ poolId: id }).then(response => {
        this.budgets = response.result
        console.log(this.budgets)
        console.log(this.budgets.length)
        if (this.budgets.length > 0) {
          this.open = true
          this.title = '充值'
          this.dialogType = 0
        } else {
          this.$message({
            message: '目前该积分池无可用预算，不可充值，请稍后重试!',
            type: 'warning'
          })
        }
      })
    },
    getAppListAll(id) {
      selectAccountAll({ 'poolId': id }).then(response => {
        this.applications = response.result
      })
    },
    getNotInvalidIntegralPools() {
      getNotInvalidPoolAll({}).then(response => {
        this.invalidIntegralPools = response.result
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.dialogType === 0) {
            recharge(this.form.integralPoolId, this.form.id).then(response => {
              if (response.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '充值成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              }
            })
          } else if (this.dialogType === 1) {
            let countAmount = 0
            this.form.selectApplicationList.forEach(
              item => {
                countAmount += item.distributionAmount
              }
            )
            if (countAmount > this.form.availableAmount) {
              // this.form.selectApplicationList[index].distributionAmount = this.form.selectApplicationList[index].distributionAmount - (countAmount - this.form.availableAmount)
              return this.$message({
                message: '分配总金额不能大于可用额度!',
                type: 'warning'
              })
            }
            rechargeSubmitList(this.form.selectApplicationList).then(response => {
              if (response.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '分配成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              }
            })
          } else {
            carryForward(this.form.invalidId, this.form.notInvalidId).then(response => {
              if (response.resultStatus === 'SUCCEED') {
                this.$message({
                  message: '结转成功',
                  type: 'success'
                })
                this.open = false
                this.getList()
              }
            })
          }
        }
      })
    },
    selectedBudgetCode() {
      this.budgets.forEach(item => {
        if (item.budgetCode === this.form.budgetCode) {
          Object.assign(this.form, item)
        }
      })
    },
    selectedApplication() {
      this.oldList = []
      this.oldList.push(...this.form.selectApplicationList)
      this.form.selectApplicationList = []
      this.form.applicationIds.forEach(
        id => {
          this.applications.forEach(item => {
            if (id === item.id) {
              let distributionAmount = ''
              this.oldList.forEach(app => {
                if (id === app.id) {
                  distributionAmount = app.distributionAmount
                }
              })
              const data = { 'id': id, 'poolId': this.form.id, 'distributionAmount': distributionAmount, 'accountName': item.accountName }
              this.form.selectApplicationList.push(data)
            }
          })
        }
      )
    }
  }
}
</script>
<style>
.el-select__tags-text{
  display: inline-block;
  max-width: 160px;
  vertical-align: middle;
  line-height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-select .el-tag__close{
  vertical-align: middle;
  margin: 0px;
  right: 0;
  top: 0;
}
</style>
