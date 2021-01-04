<template>
  <el-breadcrumb separator="/" >
    <template v-for="(item,index) of $route.matched">
      <template v-if="index!==$route.matched.length-1">
        <el-breadcrumb-item :key="index">{{ item.meta.title }}</el-breadcrumb-item>
      </template>
    </template>
  </el-breadcrumb>
</template>

