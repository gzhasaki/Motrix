<template>
  <nav class="subnav-inner">
    <h3>{{ title }}</h3>
  <div style="font-size: 11px;">
    <el-input @keydown.enter.native="search" size="mini" placeholder="输入视频名称" v-model="wd"
              class="input-with-select">
      <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-tree
      :props="props"
      lazy
      :load="loadNode"
      @node-click="handleNodeClick"
      :data="searchData">
                    <span class="custom-tree-node" slot-scope="{ node}">
                            <span :titile="node.label">{{ node.label }}</span>
                            <span v-show="node.level > 1">
                                <el-button
                                  type="text"
                                  size="mini"
                                  @click.stop="() => copyUrl(node)">
                                复制链接
                                </el-button>
                            </span>
                     </span>
    </el-tree>
  </div>
  </nav>
</template>

<script>
  import '@/components/Icons/preference-basic'
  import '@/components/Icons/preference-advanced'
  import '@/components/Icons/preference-lab'
  import {
    get
  } from '@/utils/request'

  export default {
    name: 'mo-preference-subnav',
    props: {
      current: {
        type: String,
        default: 'basic'
      }
    },
    computed: {
      title () {
        // return this.$t('subnav.preferences')
        return this.$t('在线播放')
      }
    },
    mounted () {
      this.search()
    },
    data () {
      return {
        loading: true,
        wd: '',
        searchData: [],
        props: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        }
      }
    },
    methods: {
      nav (category = 'basic') {
        this.$router.push({
          path: `/preference/${category}`
        }).catch(err => {
          console.log(err)
        })
      },
      loadNode: function (node, resolve) {
        if (this.searchData.length !== 0) {
          if (node.level === 1) {
            const vodId = node.data.data.vod_id
            get('https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail&ids=' + vodId).then(res => {
              if (res.list && res.list.length !== 0) {
                const result = res.list[0]
                const playUrl = result.vod_play_url
                const split = result.vod_play_note
                const array = playUrl.split(split)
                let playListString
                for (let i = 0; i < array.length; i++) {
                  if (array[i].indexOf('.m3u8') !== -1) {
                    playListString = array[i]
                  }
                }
                if (playListString) {
                  const seasonData = []
                  const seasons = playListString.split('#')
                  for (let i = 0; i < seasons.length; i++) {
                    const season = seasons[i]
                    const strings = season.split('$')
                    seasonData.push({
                      label: strings[0],
                      leaf: true,
                      url: strings[1]
                    })
                  }
                  return resolve(seasonData)
                }
                return resolve([])
              }
            })
          } else {
            return resolve([])
          }
        }
      },
      search () {
        this.loading = true
        get('https://api.okzy.tv/api.php/provide/vod/at/json/?wd=' + encodeURI(this.wd)).then(res => {
          const result = res.list
          this.searchData = []
          result.forEach(item => {
            const data = {}
            data.label = item.vod_name + '_' + item.vod_remarks
            data.data = item
            this.searchData.push(data)
          })
          this.wd = ''
        }).finally(() => {
          this.loading = false
        })
      },
      handleNodeClick (node) {
        if (node.leaf) {
          // this.sourceUrl = node.url
          window.EventBus.$emit('change-play-url', { url: node.url })
        }
      },
      copyUrl (node) {
        if (node.data && node.data.leaf) {
          // clipboard.writeText(node.data.url)
          this.$message({
            message: '复制成功',
            duration: 600,
            type: 'success'
          })
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
