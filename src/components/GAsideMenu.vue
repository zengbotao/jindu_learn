<!--
 * @Description: 
 * @Autor: zengbotao@myhexin.com
 * @Date: 2022-08-30 19:29:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-22 14:39:45
-->
<template>
    <el-menu-item v-if="!item.children" :index="item.path">
        <!-- <i class="el-icon-document"></i> 可以通过配置传递icon -->
        <span slot="title">{{item.meta.title}}</span>
    </el-menu-item>
    <el-submenu v-else :index="item.path">
        <template #title>{{item.meta.title}}</template>
         <GAsideMenu v-for="(it,i) in item.children" :key="i" :item="it"/>
    </el-submenu>

</template>
<script>
export default {
name:'GAsideMenu', // 递归组件的核心
props:{
item:{
type:Object,
required:true
}
}
}
</script>
<style scoped>

</style>