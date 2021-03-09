<template>
  <nav class="subnav-inner">
    <h3>{{ title }}</h3>
    <el-autocomplete
      class="inline-input"
      v-model="wd"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @keydown.enter.native="search"
      @select="search"
    >
      <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
    </el-autocomplete>
  <div style="position: fixed;
    font-size: 12px;
    height: calc(100vh - 130px);
    width: 173px;
    overflow-x: hidden;">

    <el-tree
      v-loading="loading"
      :props="props"
      lazy
      :load="loadNode"
      @node-click="handleNodeClick"
      :data="searchData">
                    <span class="custom-tree-node" slot-scope="{ node}">
<!--                      <i class="el-icon-download"></i>-->
                        <span v-show="node.level > 1 && node.data.download">
                            <el-button
                            type="text"
                            size="mini"
                            @click.stop="() => copyUrl(node)">
                            下载
                            </el-button>
                        </span>
                    <span :titile="node.label">{{ node.label }}</span>
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
  import {
    initTaskForm,
    buildUriPayload
  } from '@/utils/task'
  import { mapState } from 'vuex'
  import { cloneDeep } from 'lodash'
  // import { diffConfig } from '@shared/utils'

  const initSearchHistory = (config) => {
    const {
      playSearchHistory
    } = config
    const result = {
      playSearchHistory
    }
    return result
  }

  export default {
    name: 'mo-onlineplayer-subnav',
    props: {
      current: {
        type: String,
        default: 'basic'
      }
    },
    computed: {
      title () {
        return this.$t('在线播放')
      },
      ...mapState('hasaki', {
        hasakiConfig: state => state.hasakiConfig
      })
    },
    mounted () {
      this.buildHistoryByCache(this.form.playSearchHistory)
      this.search()
    },
    data () {
      const form = cloneDeep(initSearchHistory(this.$store.state.hasaki.hasakiConfig))
      const formOriginal = cloneDeep(form)
      return {
        loading: true,
        wd: '',
        searchData: [],
        history: history,
        props: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },
        form,
        formOriginal
      }
    },
    watch: {
      'form.playSearchHistory' (oldValue, newValue) {
        this.buildHistoryByCache(newValue)
      }
    },
    methods: {
      buildHistoryByCache (cache) {
        if (cache) {
          this.history = []
          for (let i = cache.length - 1; i >= 0; i--) {
            const his = cache[i]
            this.history.push({
              value: his
            })
          }
        }
      },
      querySearch (queryString, cb) {
        const his = this.history
        const results = queryString ? his.filter(this.createFilter(queryString)) : his
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (his) => {
          return (his.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      loadNode: function (node, resolve) {
        if (this.searchData.length !== 0) {
          if (node.level === 1) {
            const vodId = node.data.data.vod_id
            get('https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail&ids=' + vodId).then(res => {
              if (res.list && res.list.length !== 0) {
                const result = res.list[0]
                const downloadUrl = result.vod_down_url
                const downloadMap = {}
                if (downloadUrl) {
                  const downloadUrlArray = downloadUrl.split('#')
                  for (let i = 0; i < downloadUrlArray.length; i++) {
                    const downloadUrlString = downloadUrlArray[i]
                    const downloadSplit = downloadUrlString.split('$')
                    // 第1集：下载地址
                    downloadMap[downloadSplit[0]] = downloadSplit[1]
                  }
                }
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
                      url: strings[1],
                      data: result,
                      download: downloadMap[strings[0]]
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
        if (this.wd !== '') {
          if (this.form.playSearchHistory.length === 10) {
            if (this.form.playSearchHistory.indexOf(this.wd) === -1) {
              this.form.playSearchHistory.shift()
            }
          }
          if (this.form.playSearchHistory.indexOf(this.wd) === -1) {
            this.form.playSearchHistory.push(this.wd)
          }
          this.$store.dispatch('hasaki/save', this.form)
            .then(() => {
              // this.syncFormConfig()
            })
            .catch(() => {
              this.$msg.success(this.$t('preferences.save-fail-message'))
            })
        }
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
          this.$store.dispatch('app/updatePlayingTitle', '正在播放：' + node.data.vod_name + '（' + node.label + ')')
          window.EventBus.$emit('change-play-url', { url: node.url })
        }
      },
      copyUrl (node) {
        if (node.data && node.data.leaf) {
          const downloadUrl = node.data.download
          this.$store.dispatch('app/updateAddTaskUrl', downloadUrl)
          const form = initTaskForm(this.$store.state)
          const vodName = node.data.data.vod_name
          form.out = vodName + '（' + node.label + ')' + downloadUrl.substring(downloadUrl.lastIndexOf('.'))
          const payload = buildUriPayload(form)
          this.$store.dispatch('task/addUri', payload).catch(err => {
            this.$msg.error(err.message)
          })
        }
      }
    }
  }
</script>

<style lang="scss">
</style>
