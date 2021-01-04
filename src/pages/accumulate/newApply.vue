<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div >
          <div class="class-name" >调整原因</div>
          <div class="flex-buttons">
            <el-popconfirm v-if="tableData.length" title="点击确定后数据将被清空" @onConfirm="$router.push('./')">
              <el-button slot="reference" type="transparent">取消</el-button>
            </el-popconfirm>
            <el-button v-else type="transparent" @click="$router.push('./')">返回</el-button>
            <el-button :disabled="btnDisable" @click="submit">提交</el-button>
          </div>
          <el-form ref="infoForm" :model="info" type="flex" justify="start" class="content" label-width="100px" label-position="left" @submit.native.prevent>
            <el-form-item
              :rules="[
                { required: true, message: '请输入30个以内文字', trigger: 'blur' }
              ]"
              label="调整原因说明"
              prop="info">
              <el-input v-model="info.info" maxlength="30" resize="none" type="textarea" style="width:400px" clearable placeholder="请输入30个以内文字"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="app-container show shadow">
      <div class="content">
        <div class="class-name">已添加积分调整信息</div>
        <div class="flex-buttons">
          <el-button @click="dialog=true">添加调整</el-button>
        </div>
        <el-table :data="tableData" height="300" style="width: 100%" stripe>
          <el-table-column type="index" width="50" label="序号"/>
          <el-table-column prop="memberName" label="会员姓名" />
          <el-table-column prop="phone" label="会员手机号"/>
          <el-table-column prop="integral" label="当前积分值"/>
          <el-table-column prop="changeType" label="积分调整类型">
            <template slot-scope="scope">
              {{ scope.row.changeType==='integral_add'?'积分增加':'积分减少' }}
            </template>
          </el-table-column>
          <el-table-column prop="changeIntegral" label="调整积分值" >
            <template slot-scope="scope">
              <span v-if="scope.row.changeType==='integral_minus'" class="red">
                {{ '-'+ scope.row.changeIntegral }}
              </span>
              <span v-else>{{ '+' + scope.row.changeIntegral }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button type="text" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" title="按条件搜索" width="600px" @submit.native.prevent>
      <el-form ref="ruleForm" :model="dialogData" label-width="120px" label-position="left" @submit.native.prevent >
        <el-form-item
          :rules="[{ required: true, trigger: 'blur',message:'请选择' },]"
          prop="condition"
          label="选择搜索条件">
          <el-radio-group v-model="dialogData.condition">
            <el-radio :label="'phone'">按手机号搜索</el-radio>
            <el-radio :label="'vin'">按车主Vin码搜索</el-radio>
            <el-radio :label="'aid'">按客户ID搜索</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item :rules="rules.numbers" prop="content" label="搜索内容">
              <el-input
                v-model="dialogData.content"
                :placeholder="dialogData.numberPlaceholder"
                :maxlength="dialogData.numberLength"
                clearable />

            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button @click="getInfo" >搜 索</el-button>
            <el-button type="transparent" @click="new function(){dialog = false;dialogData.content = ''}">关 闭</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="searhForm" :model="dialogData" label-width="120px" label-position="left" @submit.native.prevent >
        <div v-if="searched" class="content">
          <div class="class-name">已查询车主信息</div>
          <p><span>会员姓名:</span>{{ searchData.memberName }}</p>
          <p><span>会员手机号:</span>{{ searchData.phone }}</p>
          <p><span>当前积分总值:</span>{{ searchData.integral }}</p>
          <el-form-item
            :rules="[{ required: true, trigger: 'blur',message: '请选择积分方式' },]"
            prop="scoreValue"
            label="调整积分方式">
            <el-select v-model="dialogData.scoreValue" placeholder="请选择" width="100">
              <el-option v-for="item of scoreLabel" :key="item.value" :label="item.label" :value="item.value" width="100"/>
            </el-select>
          </el-form-item>
          <el-form-item
            :rules="[{ required: true,message: '请输入积分数值' },
                     {type:'number',min:0,max:999999,message:'数值区间为[0-999999]'}]"
            label="请输入积分数值"
            prop="Integral"
          >
            <el-input v-model.number="dialogData.Integral" maxlength="6"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="addItem">添加</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { queryUserInfo, postApplyInfo } from '@/api/accumulate'
export default {
  name: 'AuditInfo',
  components: {
    breadcrumb
  },
  data() {
    const check = (rule, value, callback) => {
      if (value === undefined || value === '') {
        callback()
      } else if (value.length === 17 && this.dialogData.condition === 'vin') {
        callback()
      } else if (value.match(/^1(3|4|5|6|7|8|9)\d{9}$/) && this.dialogData.condition === 'phone') {
        callback()
      } else if (value.match(/\d/) && this.dialogData.condition === 'aid') {
        callback()
      } else {
        callback(new Error('请输入正确的号码'))
      }
    }
    return {
      scoreLabel: [
        { label: '积分增加', value: 'integral_add' },
        { label: '积分减少', value: 'integral_minus' }
      ],
      tableData: [
      ],
      rules: {
        numbers: [
          { validator: check, type: 'String' }
        ]
      },
      searchData: {},
      searched: false,
      dialog: false,
      dialogData: {
        content: '',
        condition: 'phone',
        numberLength: 11,
        numberPlaceholder: ''
      },
      btnDisable: true,
      info: {
        cutFlag: '0',
        info: ''
      }
    }
  },
  computed: {
    data() {
      return this.$store.getters.data
    }
  },
  watch: {
    'dialogData.condition': {
      immediate: true,
      handler(v) {
        this.dialogData.content = ''
        switch (v) {
          case 'phone':
            this.dialogData.numberPlaceholder = '请输入11位手机号'
            this.dialogData.numberLength = 11
            break
          case 'vin':
            this.dialogData.numberPlaceholder = '请输入17位vin码'
            this.dialogData.numberLength = 17
            break
          case 'aid':
            this.dialogData.numberPlaceholder = '请输入id号码'
            this.dialogData.numberLength = 19
            break
        }
      }
    },
    'tableData': {
      handler(v) {
        if (this.tableData.length > 0) {
          this.btnDisable = false
        } else {
          this.btnDisable = true
        }
      }
    }
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
        this.searched = false
        this.dialogData = {
          condition: '0',
          content: ''
        }
      }).catch(_ => {})
    },
    getInfo() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const param = {
            code: this.dialogData.content,
            checkType: this.dialogData.condition
          }
          queryUserInfo(param).then(res => {
            if (res.resultStatus === 'SUCCEED') {
              this.searched = true
              this.searchData = res.result
            }
            if (res.resultStatus === 'FAILED') {
              this.searched = false
            }
          })
        }
      })
    },
    addItem() {
      this.$refs['searhForm'].validate((valid) => {
        if (valid) {
          this.tableData.push({
            'changeIntegral': this.dialogData.Integral,
            'memberName': this.searchData.memberName,
            'changeType': this.dialogData.scoreValue,
            'phone': this.searchData.phone,
            'integral': this.searchData.integral
          })
          this.searched = false
          this.dialogData = {
            condition: 'phone',
            content: ''
          }
          this.$message({
            showClose: true,
            type: 'success',
            message: '调整信息暂存成功。'
          })
          this.dialog = false
        }
      })
    },
    deleteRow(index) {
      this.tableData.splice(index, 1)
    },
    submit() {
      const param = {
        applyDesc: this.info.info,
        detailInfos: this.tableData
      }
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          postApplyInfo(param).then(res => {
            this.$message({
              showClose: true,
              type: 'success',
              message: '提交成功，请等待业务审核'
            })
            this.$router.push('./')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p{
  font-size: 12px;
  text-align: left;
  margin: .8em 0;
  font-weight: bold;
  span{
    font-weight: normal;
    padding-right: 1em;
  }
}
.el-form-item__content {
    width: 400px !important;
}
.el-radio-group{
  text-align: left;
  label{
   margin-bottom: 10px;
  }
}
.keyvalue{
  .key{
    width:120px;
  }
  .value{
    box-shadow: none;
    text-align: left;
  }
}

textarea{
  resize: none;
}
</style>
