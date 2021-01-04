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
          <el-button @click="checkSearch">查询</el-button>
        </div>
        <el-form ref="searchForm" :model="searchForm" :rules="rules" class=" searchForm" label-width="100px" label-position="left" @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :lg="8" :md="12">
              <el-form-item :rules="rules.maxLength" label="登录名称:" prop="preferredUsername">
                <el-input v-model="searchForm.preferredUsername" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="rules.maxLength" label="姓名:" prop="name">
                <el-input v-model="searchForm.name" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="rules.phone" label="手机号:" prop="mobile">
                <el-input v-model="searchForm.mobile" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="rules.maxLength" label="邮箱:" prop="email">
                <el-input v-model="searchForm.email" clearable placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">用户列表</div>
        <el-table :data="tableData" stripe style="width: 100%" >
          <!-- <el-table-column prop="id" label="id"/> -->
          <el-table-column prop="preferredUsername" label="登录名称"/>
          <el-table-column prop="name" label="名称" width="100px"/>
          <el-table-column label="手机号"><template slot-scope="scope">{{ scope.row.mobile?scope.row.mobile:'-' }}</template></el-table-column>
          <el-table-column prop="email" label="邮箱"/>
          <!-- <el-table-column prop="forbiddenFlag" label="状态码"/> -->
          <el-table-column prop="roleName" label="角色编码"/>
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" @click="editor(scope.row)">编辑</el-button>
              <!-- <el-divider direction="vertical"/> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <span>{{ total }}条记录，共{{ totalPage }}页</span>
          <el-pagination
            :total="total"
            background
            hide-on-single-page
            layout="prev, pager, next"
            @current-change="currentChange"/>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialog" :before-close="handleClose" title="用户信息修改" width="400px ">
      <el-form ref="ruleForm" :model="itemData" :inline="true" label-width="100px" label-position="left" @submit.native.prevent>
        <el-form-item label="登录名称" prop="preferredUsername">
          <el-input v-model="itemData.preferredUsername" :disabled="true" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="itemData.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="itemData.mobile" :disabled="true"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" >
          <el-input v-model="itemData.email" :disabled="true"/>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ]"
          label="角色名"
          prop="roleCode" >
          <el-select v-model="itemData.roleCode" placeholder="请选择" width="100">
            <el-option v-for="item of dict" :key="item.roleCode" :label="item.roleName" :value="item.roleCode" width="100"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="transparent" @click="dialog=false"> 取消</el-button>
        <el-divider direction="vertical"/>
        <el-button @click="editrorHandlear">提交</el-button>
      </div>
  </el-dialog></div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'

import { getUserInfoList, putSystemUserInfo, getRoleDictList } from '@/api/user'
export default {
  name: 'User',
  components: {
    breadcrumb
  },
  data() {
    const checkLentgh = (rule, value, callback) => {
      if (value && value.length > 30) {
        callback(new Error('最大长度为30'))
      } else {
        callback()
      }
    }
    const phone = (rules, value, callback) => {
      if (!value || value.match(/^1(3|4|5|6|7|8|9)\d{9}$/)) {
        callback()
      } else {
        callback(new Error('请输入正确号码'))
      }
    }
    return {
      tableData: [],
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0,
      searchForm: {},
      dialog: false,
      itemData: {},
      dict: [],
      rules: {
        maxLength: [
          { validator: checkLentgh, type: 'string' }
        ],
        phone: [
          { validator: phone, type: 'string' }
        ]
      }
    }
  },
  mounted() {
    this.init()
    getRoleDictList().then(res => {
      this.dict = res.result
    })
  },
  methods: {
    checkSearch() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.init()
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    init() {
      const param = {
        name: this.searchForm.name,
        mobile: this.searchForm.mobile,
        email: this.searchForm.email,
        preferredUsername: this.searchForm.preferredUsername,
        pageNo: this.pageNo,
        pageSize: this.pageSize

      }
      getUserInfoList(param).then(res => {
        this.tableData = res.result
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
    },
    clear() {
      this.searchForm = {}
    },
    currentChange(num) {
      this.pageNo = num
      this.init()
    },
    editrorHandlear() {
      const param = {
        id: this.itemData.id,
        roleCode: this.itemData.roleCode
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          putSystemUserInfo(param).then(res => {
            this.dialog = false
            this.init()
          })
        }
      })
    },
    editor(row) {
      this.dialog = true
      this.itemData = { ...row }
    }
  }
}
</script>

