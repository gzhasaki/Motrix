<template>
  <el-container class="content panel" direction="horizontal">
    <el-aside width="200px" class="subnav hidden-xs-only">
      <router-view name="subnav" />
    </el-aside>
    <router-view name="form" />
  </el-container>
</template>

<script>
  import AliPlayer from '@/components/AliPlayer/Index'

  export default {
    name: 'online-player',
    components: {
      [AliPlayer.name]: AliPlayer
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
