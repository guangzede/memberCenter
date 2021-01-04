<template>
  <div class="background">
    <breadcrumb />

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :lazy="true" name="ins">
        <el-button slot="label" :type="activeName==='ins'?'primary':'default'" size="medium">积分增减</el-button>
        <steam-ins/>
      </el-tab-pane>
      <el-tab-pane :lazy="true" name="freeze">
        <el-button slot="label" :type="activeName==='freeze'?'primary':'default'" size="medium">积分冻结</el-button>
        <steam-freeze/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import breadcrumb from '@/components/breadcrumb'
import steamIns from './components/steamIns'
import steamFreeze from './components/steamFreeze'
export default {
  name: 'Steam',
  components: {
    breadcrumb,
    steamIns,
    steamFreeze
  },
  data() {
    return {
      activeName: 'ins'
    }
  },
  methods: {
    handleClick(e) {
      this.activeName = e.name
    }
  }
}
</script>

<style lang="scss" scoped>
>>>.el-tabs__nav-scroll{
  padding: 0 20px;
    margin-top: 10px;
    display: flex;
}
>>> .el-tabs__nav {
    padding-bottom: 10px;
}
</style>

<style lang="scss" scoped>
.background{
  background: #eee;
}
.el-tabs__nav-scroll{
  padding: 0 20px;
}
>>>.el-tabs__content{
  background: #fff;
}
.el-image{
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 20px;
}
.el-button--medium{
  border-radius: 0;
}
>>>.el-tabs__nav{
  padding-bottom: 10px;
}
// .el-breadcrumb{
//   border: none;
// }
>>>.el-tabs__nav-scroll{
  padding: 0 20px;
  margin-top: 10px;
}
</style>
