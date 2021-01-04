<template>
  <div>
    <router-view v-if="this.$route.path !=='/rights/query'" class="sibling" />
    <div class="sibling">
      <div class="background">
        <breadcrumb />
        <el-tabs v-model="activeName">
          <el-tab-pane :lazy="true" name="unused">
            <el-button slot="label" :type="activeName==='unused'?'primary':'default'" size="medium" >未使用权益</el-button>
            <unused/>
          </el-tab-pane>
          <el-tab-pane :lazy="true" name="used">
            <el-button slot="label" :type="activeName==='used'?'primary':'default'" size="medium" >已使用权益</el-button>
            <used/>
          </el-tab-pane>
          <el-tab-pane :lazy="true" name="overdue">
            <el-button slot="label" :type="activeName==='overdue'?'primary':'default'" size="medium">已过期权益</el-button>
            <overdue/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import unused from './component/unused'
import used from './component/used'
import overdue from './component/overdue'
import breadcrumb from '@/components/breadcrumb'
export default {
  name: 'Query',
  components: {
    overdue, used, unused, breadcrumb
  },
  data() {
    return {
      activeName: 'unused'
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
