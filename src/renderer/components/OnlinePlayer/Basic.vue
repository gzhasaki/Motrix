<template>
  <el-container class="content panel" direction="vertical">
    <el-header class="panel-header" height="84">
      <h4 class="hidden-xs-only">{{ title }}</h4>
    </el-header>
    <el-main class="panel-content">
      <ali-player></ali-player>
    </el-main>
  </el-container>
</template>

<script>
  import AliPlayer from '@/components/AliPlayer/Index'

  export default {
    name: 'online-player',
    components: {
      AliPlayer,
      [AliPlayer.name]: AliPlayer
    },
    data () {
      return {
        title: 'title'
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss">
</style>
