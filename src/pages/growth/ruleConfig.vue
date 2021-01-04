<template>
  <div>
    <router-view v-if="this.$route.path !=='/growth/ruleConfig'" class="sibling" />
    <div class="sibling">
      <div class="background">
        <breadcrumb />
        <el-tabs v-model="activeName">
          <el-tab-pane name="transform">
            <el-button slot="label" :type="activeName==='transform'?'primary':'default'" size="medium" >积分规则关联</el-button>
            <transform/>
          </el-tab-pane>
          <el-tab-pane name="manual">
            <el-button slot="label" :type="activeName==='manual'?'primary':'default'" size="medium" >手动添加规则</el-button>
            <manual/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import manual from './component/manual'
import transform from './component/transform'
import { postAdd } from '@/api/growth'
export default {
  name: 'RuleConfig',
  components: {
    breadcrumb,
    manual,
    transform
  },
  data() {
    return {
    }
  },
  computed: {
    activeName: {
      get() {
        return this.$store.state.activeName
      },
      set(val) {
        this.$store.commit('tabChangeActive', val)
      }
    }
  },

  mounted() {
  },
  methods: {
    updataFlag(row, flag) {
      const temp = { ...row }
      temp.tacticsFlag = flag
      postAdd(temp).then(res => {
        row.tacticsFlag = flag
        this.$message({
          message: flag === '0' ? '启用成功' : '禁用成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item {
  text-align: left;
}

.background {
  background: #eee;
}
.el-tabs__nav-scroll {
  padding: 0 20px;
}
>>> .el-tabs__content {
  background: #fff;
  box-sizing: border-box;
}
.el-image {
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 20px;
}
.el-button--medium {
  border-radius: 0;
}
>>> .el-tabs__nav {
  padding-bottom: 10px;
}
>>> .el-tabs__nav-scroll {
  padding: 0 20px;
  margin-top: 10px;
}

.el-table .cell {
  text-align: center;
}

</style>
