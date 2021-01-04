<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">角色管理</div>
        <div class="flex-buttons">
          <el-button plain @click="dialogaddRole = true">新增角色</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="roleName" label="角色名称"/>
          <el-table-column prop="roleCode" label="角色编码"/>
          <el-table-column prop="roleDesc" label="角色描述"/>
          <el-table-column prop="createDate" label="创建时间" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="dialogRoleUpdata(scope.row),dialogUpdataRole = !dialogUpdataRole">修改</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="roleDelete(scope.row)">删除</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="getMenuHandler(scope.row),dialogUpdataMenu=!dialogUpdataMenu">更改权限</el-button>
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
      <el-dialog :visible.sync="dialogUpdataRole" :before-close="handleClose" title="修改" width="400px">
        <el-form ref="ruleForm" :model="gridRole" label-width="100px" label-position="left" @submit.native.prevent>
          <el-form-item
            :rules="rules.roleName"
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="gridRole.roleName" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            :rules="rules.roleName"
            label="角色编码"
            prop="roleCode">
            <el-input v-model="gridRole.roleCode" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            :rules="rules.roleName"
            label="角色描述"
            prop="roleDesc">
            <el-input v-model="gridRole.roleDesc" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="transparent" @click="dialogUpdataRole = false">取 消</el-button>
          <el-divider direction="vertical"/>
          <el-button type="primary" @click="submitForm">提 交</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogaddRole" :before-close="handleClose" title="新增角色" width="400px">
        <el-form ref="addRuleForm" :model="gridAddRole" label-width="100px" label-position="left" @submit.native.prevent>
          <el-form-item
            :rules="rules.roleName"
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="gridAddRole.roleName" autocomplete="off"/>
          </el-form-item>

          <el-form-item
            :rules="rules.roleName"
            label="角色编码"
            prop="roleCode">
            <el-input v-model="gridAddRole.roleCode" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            :rules="rules.roleName"
            label="角色描述"
            prop="roleDesc">
            <el-input v-model="gridAddRole.roleDesc" autocomplete="off"/>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="transparent" @click="dialogaddRole = false">取 消</el-button>
          <el-button type="primary" @click="submitAddForm">提 交</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogUpdataMenu" :before-close="handleClose" width="80%" title="更改菜单权限" @close="initSet">
        <el-table
          :data="tableMenu"
          :tree-props="{children: 'children'}"
          row-key="id"
          default-expand-all>
          <el-table-column >
            <template slot-scope="scope">
              {{ scope.row.menuName }}
              <el-checkbox v-model="scope.row.checked" @change="updaRoleMenuInfo(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column prop="menuLevel" label="菜单等级" width="80"/>
          <el-table-column prop="path" label="菜单路径" />
          <el-table-column prop="parentCode" label="父菜单" width="120" />
          <el-table-column prop="menuCode" label="菜单编码" width="180"/>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="transparent" @click="dialogUpdataMenu = false,initSet">取 消</el-button>
          <el-divider direction="vertical"/>
          <el-button type="primary" @click="menuUpdata">提 交</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogaddMenu" :before-close="handleClose" width="80%">
        <el-form ref="dialog" :model="gridAddmenu" @submit.native.prevent>
          <el-form-item label="菜单编码">
            <el-input v-model="gridAddmenu.menuCode" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="菜单描述">
            <el-input v-model="gridAddmenu.menuDesc" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="菜单等级">
            <el-input v-model="gridAddmenu.menuLevel" type="number" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="gridAddmenu.menuName" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="菜单路径">
            <el-input v-model="gridAddmenu.menuUrl" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="父菜单编码">
            <el-input v-model="gridAddmenu.parenCode" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="transparent" @click="dialogaddMenu = false">取 消</el-button>
          <el-divider direction="vertical"/>
          <el-button type="primary" @click="addmenu">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import { getRoleDictList } from '@/api/user'
import { getRoleList, deleteRole, addRole, updateRole } from '@/api/role'
import { getMenu, addMenu, deleteRoleMenu, addRoleMenu } from '@/api/menu'

import { tree0 } from '@/utils/menu.js'
export default {
  name: 'Role',
  components: {
    breadcrumb
  },
  data() {
    const roleName = (rule, value, callback) => {
      if (!value || value.length < 1 || value.length > 20) {
        callback(new Error('输入长度1-20'))
      } else if (value.match(/\s/)) {
        callback(new Error('请移除空格'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      dict: [],
      pageSize: 10,
      total: 10,
      pageNo: 1,
      totalPage: 0,
      dialogUpdataRole: false,
      dialogUpdataMenu: false,
      dialogaddMenu: false,
      dialogaddRole: false,
      baseData: [],
      gridRole: [],
      tempRoleCode: '',
      gridAddmenu: {},
      gridAddRole: {},
      tableMenu: [],
      multipleSelection: new Set(),
      temp: {},
      rules: {
        roleName: [
          { validator: roleName, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'tableMenu': {
      handler() {

      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.initPages()
    getRoleDictList().then(res => {
      this.dict = res.result
    })
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => { done() }).catch(_ => {})
    },
    exprotData() {
    },
    currentChange(num) {
      this.pageNo = num
      this.initPages()
    },
    initSet() {
      this.multipleSelection.clear()
    },
    menuUpdata() {
      var pool = []
      this.multipleSelection.forEach(item => {
        if (item.checked) {
          pool.push(addRoleMenu({ menuCode: item.menuCode, roleCode: this.tempRoleCode }))
        } else {
          pool.push(deleteRoleMenu({ id: item.systemRoleMenuInfoId }))
        }
      })
      Promise.all(pool).then(res => {
        this.dialogUpdataRole = false
        this.dialogUpdataMenu = false
        this.initSet()
        this.multipleSelection.clear()
        this.initPages()
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.roleUpdata()
        }
      })
    },
    updaRoleMenuInfo(row) {
      this.multipleSelection.add(row)
      if (row.children.length > 0) {
        row.children.forEach((item) => {
          item.checked = row.checked
          if (row.checked) {
            this.multipleSelection.add(item)
          }
          if (item.children.length > 0) {
            item.children.forEach((leep) => {
              leep.checked = row.checked
              if (row.checked) {
                this.multipleSelection.add(leep)
              }
            })
          }
        })
      }
    },
    getMenuHandler(row) {
      this.temp = row
      this.tempRoleCode = row.roleCode
      getMenu({ roleCode: row.roleCode }).then(res => {
        this.baseData = res.result
        this.tableMenu = tree0(res.result, true)
      })
    },
    initPages(param = {
      pageSize: this.pageSize,
      pageNo: this.pageNo
    }) {
      getRoleList(param).then(res => {
        this.tableData = [...res.result]
        this.total = res.totalNum
        this.totalPage = res.totalPage
      })
      this.dialogUpdataRole = false
    },
    roleDelete(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp = row
        deleteRole({ id: row.id }).then(res => {
          this.initPages()
        })
      }).catch(() => {
      })
    },
    dialogRoleUpdata(row) {
      this.temp = row
      this.gridRole = { ...row }
    },
    roleUpdata() {
      updateRole({
        id: this.gridRole.id,
        roleName: this.gridRole.roleName,
        roleCode: this.gridRole.roleCode,
        roleDesc: this.gridRole.roleDesc
      }).then(res => {
        this.dialogUpdataRole = false
        this.initPages()
      })
    },
    addmenu() {
      addMenu({ ...this.gridAddmenu, id: this.temp.id }).then(res => {
      })
    },
    submitAddForm() {
      this.$refs['addRuleForm'].validate(valid => {
        if (valid) {
          this.addRole()
        }
      })
    },
    addRole() {
      const param = {
        roleDesc: this.gridAddRole.roleDesc,
        roleCode: this.gridAddRole.roleCode,
        roleName: this.gridAddRole.roleName
      }
      addRole(param).then(res => {
        this.initPages()
        this.gridAddRole = {}
        this.dialogaddRole = false
      })
    },
    roleUpdate() {
      updateRole()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  min-height: calc(100vh - 100px);
}
</style>
