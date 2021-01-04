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
            <el-col :lg="8" :md="12">
              <el-form-item
                :rules="searchRules.clientId"
                label="应用平台编码"
                prop="clientId">
                <el-input v-model="searchForm.clientId" max="10" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="searchRules.clientName" label="应用平台名称" prop="clientName">
                <el-input v-model="searchForm.clientName" max="10" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">应用平台信息列表</div>
        <div class="flex-buttons">
          <el-button @click="dialogAdd=true">新增应用平台</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column prop="brand" label="品牌"/>
          <el-table-column prop="clientId" label="应用平台编码"/>
          <el-table-column prop="clientName" label="应用平台名称"/>
          <el-table-column prop="clientDesc" label="应用平台描述"/>
          <el-table-column label="应用平台状态" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="clickEditor(scope.row)">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-popconfirm title="点击确定后将启用本条策略" @onConfirm="updataPlat(scope.row,'0')">
                <el-button slot="reference" :disabled="scope.row.startFlag==='0'" type="text" >启用</el-button>
              </el-popconfirm>
              <el-divider direction="vertical"/>
              <el-popconfirm title="点击确定后将禁用本条策略" @onConfirm="updataPlat(scope.row,'1')">
                <el-button slot="reference" :disabled="scope.row.startFlag==='1'" type="text" >禁用</el-button>
              </el-popconfirm>
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
            @current-change="currentChange"/>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogEditor" :before-close="handleClose" title="平台信息详情" width="500px">
      <el-form ref="editorForm" :model="editorForm" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <el-form-item label="创建时间">
          {{ editorForm.createDate }}
        </el-form-item>
        <el-form-item

          label="应用平台编码"
          prop="clientId">
          {{ editorForm.clientId }}
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入',trigger: 'blur' },
            { min: 1, max: 20,message: '请输入5-20位字母或数字'}
          ]"
          prop="brand"
          label="品牌">
          <el-select v-model="editorForm.brand" placeholder="请选择">
            <el-option v-for="item of brand" :key="item.id" :label="item.value" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '必填项不能为空', trigger: 'blur' },
            { min: 1, max: 20,message: '请输入5-20位字母或数字',trigger: ['blur', 'change']}
          ]"
          prop="clientName"
          label="应用平台名称">
          <el-input v-model="editorForm.clientName" clearable/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入50个以内文字', trigger: 'blur' },
            { min: 1, max: 50,message: '请输入50个以内文字',trigger: ['blur', 'change']}
          ]"
          label="应用平台描述"
          prop="clientDesc">
          <el-input v-model="editorForm.clientDesc" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialogEditor=false"> 取消</el-button>
        <el-button @click="updataHandlear"> 提交</el-button>
      </div>

    </el-dialog>
    <el-dialog :visible.sync="dialogAdd" :before-close="handleClose" title="新增应用平台信息" width="500px">
      <el-form ref="addForm" :model="addForm" :inline="true" label-width="150px" label-position="left" @submit.native.prevent>
        <el-form-item
          :rules="rules.clientId"
          label="应用平台编码"
          prop="clientId">
          <el-input v-model="addForm.clientId" clearable>
            <template slot="prepend">AC-</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="品牌"
          prop="brand">
          <el-select v-model="addForm.brand" placeholder="请选择">
            <el-option v-for="item of brand" :key="item.id" :label="item.value" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入20个以内文字', trigger: 'blur' },
            { min: 1, max: 20,message: '请输入20个以内文字',trigger: ['blur', 'change']}
          ]"
          prop="clientName"
          label="应用平台名称">
          <el-input v-model="addForm.clientName" clearable />
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入20个以内文字', trigger: 'blur' },
            { min: 1, max: 50,message: '请输入50个以内文字',trigger: ['blur', 'change']}
          ]"
          label="应用平台描述"
          prop="clientDesc">
          <el-input v-model="addForm.clientDesc" clearable/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '应用平台状态', trigger: 'blur' },
          ]"
          prop="startFlag"
          label="应用平台状态">
          <el-radio v-model="addForm.startFlag" label="0">启用</el-radio>
          <el-radio v-model="addForm.startFlag" label="1">禁用</el-radio>
        </el-form-item>

      </el-form>
      <div><span style="color:#C0C0C0;font-size:12px;">注：如为TOE应用端，应用平台编码命名格式为“AC-TOE-XXXXX”</span></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialogAdd=false"> 取消</el-button>
        <el-button @click="addhandlear">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getInfo, putInfo, postInfo } from '@/api/Platform'
export default {
  name: 'Platform',
  components: {
    breadcrumb
  },
  data() {
    const validatePass = (rule, value, callback) => {
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
    const validateID = (rule, value, callback) => {
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
    const clientId = (rule, value, callback) => {
      if (value.length > 20 || value.length < 5) {
        callback(new Error('请输入5-请输入5-20位字母或数字'))
      } else {
        callback()
      }
      // else if (value.match(/^[a-zA-Z0-9]+$/)) {
      //   callback()
      // }
      // else {
      //   callback(new Error('请输入合法字符'))
      // }
    }
    return {
      searchForm: {
        creatTime: ['', ''],
        changeType: null,
        postId: null,
        cardId: null,
        clientName: null,
        clientId: ''
      },
      brand: [{ id: 'HQ', vlaue: 'HQ' }],
      addForm: {
        startFlag: '0',
        clientName: '',
        brand: '',
        clientId: ''
      },
      editorForm: {},
      type: [{
        id: 'HQ',
        vlaue: 'HQ'
      }],
      dialogEditor: false,
      dialogAdd: false,
      pageSize: 10,
      total: 10,
      pageNo: 1,
      param: {},
      totalPage: 0,
      tableData: [],
      rules: {
        clientId: { validator: clientId, trigger: 'blur' }
      },
      searchRules: {
        clientName: [
          { validator: validatePass, trigger: 'blur' }
        ],
        clientId: [
          { validator: validateID, trigger: 'blur' }
        ]
      }
    }
  },
  // watch:{
  //   'addForm.clientDesc':{
  //     handler(n){
  //       this.addForm.clientDesc.slice(0,50)
  //     }
  //   }
  // },
  mounted() {
    this.initParam(1)
    this.getinfo()
  },
  methods: {
    checkForm() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.initParam(1)
          this.currentChange(1)
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    currentChange(num) {
      this.pageNo = this.param.pageNo = num
      this.init()
    },
    updataHandlear() {
      this.$refs['editorForm'].validate((valid) => {
        if (valid) {
          const param = { ...this.editorForm }
          param.clientId = 'AC-' + param.clientId
          putInfo(param).then(res => {
            this.init()
          })
        }
      })
    },
    addhandlear() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const param = { ...this.addForm }
          param.clientId = 'AC-' + param.clientId
          postInfo(param).then(res => {
            this.init()
            this.addForm = {
              startFlag: '0',
              clientName: '',
              brand: '',
              clientId: ''
            }
          })
        }
      })
    },
    clickEditor(row) {
      this.dialogEditor = true
      this.editorForm = { ...row }
      this.editorForm.clientId =
        this.editorForm.clientId.indexOf('AC-') > -1
          ? this.editorForm.clientId.split('AC-').reverse()[0]
          : this.editorForm.clientId
    },
    updataPlat(row, flag) {
      putInfo({
        id: row.id,
        'brand': row.brand,
        'clientDesc': row.clientDesc,
        'clientId': row.clientId,
        'clientName': row.clientName,
        'growthStrategyUrl': row.growthStrategyUrl,
        'rightsIntroduceUrl': row.rightsIntroduceUrl,
        'startFlag': flag
      }).then(res => {
        row.startFlag = flag
        this.$message({
          message: flag === '0' ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    },
    initParam(pageNo) {
      this.param = {
        startTime: this.searchForm.creatTime[0],
        endTime: this.searchForm.creatTime[1],
        clientId: this.searchForm.clientId,
        clientName: this.searchForm.clientName,
        pageNo: pageNo,
        pageSize: this.pageSize
      }
    },
    getinfo() {
      getInfo(this.param).then(res => {
        this.tableData = res.result
        this.pageSize = res.pageSize
        this.total = res.totalNum
        this.totalPage = res.totalPage
        this.pageNo = res.pageNo
      })
    },
    clear() {
      this.searchForm = {
        creatTime: ['', ''],
        changeType: null,
        postId: null,
        cardId: null,
        clientName: null,
        clientId: ''
      }
    },
    init() {
      this.dialogAdd = false
      this.dialogEditor = false
      this.getinfo()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form{
    text-align: left;
    .center{
      text-align: center;
    }
  }
</style>
