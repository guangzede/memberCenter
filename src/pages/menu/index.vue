<template>
  <div>
    <div class="background">
      <breadcrumb />
    </div>
    <div class="app-container shadow">
      <div class="content">
        <div class="class-name">菜单管理</div>
        <div class="flex-buttons">
          <el-button plain @click="addRootMenu">添加一级菜单</el-button>
        </div>
        <el-table :data="treeData" :tree-props="{children: 'children'}" stripe row-key="id"><!--- default-expand-all-->
          <el-table-column prop="menuName" label="名称" sortable width="270" />
          <!-- <el-table-column prop="id" width="70" label="id" sortable /> -->
          <el-table-column prop="menuCode" width="100" label="菜单编码" sortable />
          <el-table-column prop="parentCode" label="父菜单编码" width="120" sortable />
          <!-- <el-table-column prop="menuLevel" label="菜单等级" width="100" sortable /> -->
          <el-table-column prop="menuDesc" label="描述" sortable />
          <el-table-column prop="menuUrl" label="菜单路径" sortable />
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button type="text" @click="updataMenu(scope.$index, scope.row)">修改</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="addNewMenu(scope.$index, scope.row)">新增子菜单</el-button>
              <el-divider direction="vertical"/>
              <el-button type="text" @click="deletemenu(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogaddMenu" :before-close="handleClose" :title="dialogTitle" destroy-on-close width="400px">
        <el-form ref="ruleForm" :model="gridAddmenu" :rules="rules" label-width="100px" label-position="left" @submit.native.prevent >
          <el-form-item
            :rules="rules.menuCode"
            prop="menuCode"
            label="菜单编码">
            <el-input v-model="gridAddmenu.menuCode" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            :rules="rules.menuCode"
            prop="menuDesc"
            label="菜单描述">
            <el-input v-model="gridAddmenu.menuDesc" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            :rules="rules.menuCode"
            prop="menuName"
            label="菜单名称"
          >
            <el-input v-model="gridAddmenu.menuName" autocomplete="off"/>
          </el-form-item>
          <el-form-item
            :rules="rules.menuCode"
            label="菜单路径"
            prop="menuUrl">
            <el-input v-model="gridAddmenu.menuUrl" autocomplete="off">
              <template v-if="gridAddmenu.parentCode">{{ gridAddmenu.path }}</template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="gridAddmenu.menuLevel!==0"
            :rules="rules.menuCode"
            label="父菜单编码"
            prop="parentCode">
            <el-input v-model="gridAddmenu.parentCode" :disabled="true" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogaddMenu = false">取 消</el-button>
          <el-divider direction="vertical"/>
          <el-button v-if="isUpdataStage" @click="submitForm(updatemenu)">修改</el-button>
          <el-button v-else @click="submitForm(addmenu)">新增</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMenuList, addMenu, updateMenu, deleteMenu } from '@/api/menu.js'
import { tree0 } from '@/utils/menu.js'
import breadcrumb from '@/components/breadcrumb'
import { mapState } from 'vuex'
export default {
  name: 'Menu',
  components: {
    breadcrumb
  },
  data() {
    const menuCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不可为空或含有空格'))
      } else if (value.trim().length < 1) {
        callback(new Error('不可为空或含有空格'))
      } else if (value && value.trim().length > 120) {
        callback(new Error('长度最大120'))
      } else {
        callback()
      }
    }
    return {
      treeData: [],
      dialogaddMenu: false,
      isUpdataStage: true,
      gridAddmenu: {},
      dialogTitle: '',
      isAddRootMenu: false,
      rules: {
        menuCode: [{ validator: menuCode, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      size: state => state.settings.size
    })
  },

  mounted() {
    this.init()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
        // this.$refs.ruleForm.clearValidate()
      }).catch(_ => {})
    },
    submitForm(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          callback()
        }
      })
    },
    addRootMenu() {
      this.isAddRootMenu = true
      this.isUpdataStage = false
      this.dialogaddMenu = true
      this.gridAddmenu = { menuLevel: 0 }
      this.dialogTitle = '新增一级菜单'
    },
    deletemenu(row) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu({ id: row.id }).then(res => {
          this.init()
        })
      }).catch(() => {
      })
    },
    init() {
      getMenuList().then(res => {
        this.treeData = tree0(res.result, true)
      })
    },
    addNewMenu(index, row) {
      this.isAddRootMenu = false
      this.isUpdataStage = false
      this.dialogaddMenu = true
      this.dialogTitle = '新增子菜单'
      this.gridAddmenu = {
        menuLevel: row.menuLevel + 1,
        parentCode: row.menuCode
      }
    },
    updataMenu(index, row) {
      this.isAddRootMenu = false
      this.isUpdataStage = true
      this.dialogaddMenu = true
      this.dialogTitle = '修改菜单 - ' + row.menuName
      console.log(row)
      this.gridAddmenu = {
        id: row.id,
        menuCode: row.menuCode,
        menuDesc: row.menuDesc,
        menuLevel: row.menuLevel,
        menuName: row.menuName,
        menuUrl: row.menuUrl,
        path: row.path,
        parentCode: row.parentCode
      }
    },
    updatemenu() {
      this.dialogaddMenu = true
      updateMenu(this.gridAddmenu).then(res => {
        this.dialogaddMenu = false
        this.init()
      })
    },
    addmenu() {
      this.dialogaddMenu = true
      addMenu({ ...this.gridAddmenu }).then(res => {
        this.init()
        this.dialogaddMenu = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  >>>.el-table div.cell{
    text-align: left;
    padding-left: 1em;
  }
.app-container{
  min-height: calc(100vh - 100px);
}
</style>
