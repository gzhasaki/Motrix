<template>
  <div class="prism-player" id="player-con"></div>
</template>

<script>
  export default {
    name: 'ali-player',
    created () {
      this.initEvent()
      const _this = this
      window.addEventListener('keydown', function (events) {
        if (window.Aliplayer) {
          const key = events.key
          if (key === 'ArrowRight') {
            _this.prePlay()
          } else if (key === 'ArrowLeft') {
            _this.backPlay()
          } else if (key === ' ') {
            _this.togglePlay()
          } else if (key === 'ArrowUp') {
            _this.upVol()
          } else if (key === 'ArrowDown') {
            _this.downVol()
          }
        }
      }, true)
    },
    destroyed () {
      this.destroyedPlayer()
    },
    data () {
      return {
        interval: 0.05,
        isPlay: false,
        instance: null,
        sourceUrl: ''
      }
    },
    watch: {
      sourceUrl (oldValue, newValue) {

      }
    },
    methods: {
      destroyedPlayer () {
        if (window.aliPlayerInstance) {
          window.aliPlayerInstance.dispose()
          window.aliPlayerInstance = null
        }
      },
      initEvent () {
        const _this = this
        window.EventBus.$on('change-play-url', function (args) {
          if (args && args.url) {
            _this.sourceUrl = args.url
            if (!window.Aliplayer) {
              _this.insertScript()
            } else {
              _this.initPlayer()
            }
          }
        })
      },
      changePlayUrl (url) {
        if (window.aliPlayerInstance) {
          window.aliPlayerInstance.loadByUrl(url)
        }
      },
      prePlay () {
        const duration = window.aliPlayerInstance.getDuration()
        if (duration) {
          const currentTime = window.aliPlayerInstance.getCurrentTime()
          window.aliPlayerInstance.seek(currentTime + this.interval * duration)
        }
      },
      backPlay () {
        const duration = window.aliPlayerInstance.getDuration()
        if (duration) {
          const currentTime = window.aliPlayerInstance.getCurrentTime()
          window.aliPlayerInstance.seek(currentTime - this.interval * duration)
        }
      },
      togglePlay () {
        if (this.isPlay) {
          window.aliPlayerInstance.pause()
        } else {
          window.aliPlayerInstance.play()
        }
      },
      upVol () {
        const volume = window.aliPlayerInstance.getVolume()
        if (volume + 0.1 < 1) {
          window.aliPlayerInstance.setVolume(volume + 0.1)
        }
      },
      downVol () {
        const volume = window.aliPlayerInstance.getVolume()
        if (volume - 0.1 > 0) {
          window.aliPlayerInstance.setVolume(volume - 0.1)
        }
      },
      insertScript () {
        const _this = this
        const _script = document.createElement('script')
        _script.setAttribute('type', 'text/javascript')
        _script.setAttribute('src', 'https://g.alicdn.com/de/prismplayer/2.9.3/aliplayer-min.js')
        document.getElementsByTagName('head')[0].appendChild(_script)

        if (/msie/.test(window.navigator.userAgent.toLowerCase())) {
          _script.onreadystatechange = function () {
            if (this.readyState === 'loaded' || this.readyState === 'complete') {
              _this.initPlayer()
            }
          }
        } else if (/gecko/.test(window.navigator.userAgent.toLowerCase())) {
          _script.onload = function () {
            _this.initPlayer()
          }
        } else {
          _this.initPlayer()
        }
      },
      initPlayer () {
        const _this = this
        this.destroyedPlayer()
        if (window.aliPlayerInstance == null) {
          // eslint-disable-next-line no-undef
          window.aliPlayerInstance = new Aliplayer({
            id: 'player-con',
            source: _this.sourceUrl,
            width: '100%',
            height: '100%',
            autoplay: false,
            isLive: false,
            rePlay: false,
            playsinline: true,
            preload: true,
            controlBarVisibility: 'hover',
            useH5Prism: true
          }, function () {
          })
          window.aliPlayerInstance.on('play', function (e) {
            _this.isPlay = true
          })
          window.aliPlayerInstance.on('pause', function (e) {
            _this.isPlay = false
          })
        }
      }
    }
  }
</script>

<style scoped>
  @import 'https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css';

</style>
