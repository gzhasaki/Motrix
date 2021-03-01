<template>
  <el-container class="content panel" direction="vertical">
    <el-header class="panel-header" height="84">
      <h4 class="hidden-xs-only">{{ playingTitle }}</h4>
    </el-header>
    <el-main class="panel-content" style="overflow: hidden">
      <ali-player style=" height: calc(100% - 50px);   margin: 32px 0;"></ali-player>
    </el-main>
  </el-container>
</template>

<script>
  import AliPlayer from '@/components/AliPlayer/Index'
  import { mapState } from 'vuex'

  export default {
    name: 'online-player-basic',
    components: {
      AliPlayer,
      [AliPlayer.name]: AliPlayer
    },
    computed: {
      ...mapState('app', {
        playingTitle: state => state.playingTitle
      })
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
