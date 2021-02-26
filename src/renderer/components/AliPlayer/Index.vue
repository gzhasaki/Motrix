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
      initEvent () {
        const _this = this
        window.EventBus.$on('change-play-url', function (args) {
          if (!window.Aliplayer) {
            _this.insertScript()
          } else {
            _this.initPlayer()
          }
          _this.sourceUrl = args.url
          _this.instance.loadByUrl(_this.sourceUrl)
        })
      },
      changePlayUrl (url) {
        if (this.instance) {
          this.instance.loadByUrl(url)
        }
      },
      prePlay () {
        const duration = this.instance.getDuration()
        if (duration) {
          const currentTime = this.instance.getCurrentTime()
          this.instance.seek(currentTime + this.interval * duration)
        }
      },
      backPlay () {
        const duration = this.instance.getDuration()
        if (duration) {
          const currentTime = this.instance.getCurrentTime()
          this.instance.seek(currentTime - this.interval * duration)
        }
      },
      togglePlay () {
        if (this.isPlay) {
          this.instance.pause()
        } else {
          this.instance.play()
        }
      },
      upVol () {
        const volume = this.instance.getVolume()
        if (volume + 0.1 < 1) {
          this.instance.setVolume(volume + 0.1)
        }
      },
      downVol () {
        const volume = this.instance.getVolume()
        if (volume - 0.1 > 0) {
          this.instance.setVolume(volume - 0.1)
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
        if (this.instance == null) {
          // eslint-disable-next-line no-undef
          _this.instance = new Aliplayer({
            id: 'player-con',
            source: this.sourceUrl,
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
          _this.instance.on('play', function (e) {
            _this.isPlay = true
          })
          _this.instance.on('pause', function (e) {
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
