<template>
  <el-container class="content panel" direction="horizontal">
    <el-aside width="200px" class="subnav hidden-xs-only">
      <router-view v-if="true" name="subnav" />
    </el-aside>
    <router-view v-if="true" name="form" />
  </el-container>
</template>

<script>
  import AliPlayer from '@/components/AliPlayer/Index'
  import store from '@/store'
  export default {
    name: 'online-player',
    components: {
      [AliPlayer.name]: AliPlayer
    },
    beforeRouteEnter (to, from, next) {
      store.dispatch('app/hideSpeedometer')
      next()
    },
    beforeRouteLeave (to, from, next) {
      this.$store.dispatch('app/showSpeedometer')
      next()
    },
    mounted () {
    },
    data () {
      return {
        loading: true,
        wd: '',
        sourceUrl: '',
        searchData: [],
        interval: 0.05,
        props: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        }
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px
  }
</style>
