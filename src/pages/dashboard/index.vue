<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎 : {{ user.userName }}</div>

  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-text {
  font-size: 60px;
  color: #fff;
  padding-top: 100px;
  box-sizing: border-box;
}
.dashboard-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 59px;
  background-image: url("https://auth.faw.cn/auth/resources/6.0.1/login/cooperation/img/cooperation-bg.png");
    background-position: bottom center;

}
</style>
