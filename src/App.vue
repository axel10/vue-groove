<template>
  <div id="app">
    <div class="bg">
      <!--<canvas id="bgCanvas"></canvas>-->
      <div class="bg-img" ref="bg">
        <transition name="bgImg">
          <!--<img src="" alt="" v-show="bgToken && bgToken!==null" class="app-bg">-->
          <div v-show="bgToken && bgToken!==null" class="app-bg"></div>
        </transition>
        <transition name="bgImg">
          <!--<img src="" alt="" v-show="!bgToken && bgToken!==null" class="app-bg" >-->
          <div v-show="!bgToken && bgToken!==null" class="app-bg"></div>
        </transition>
      </div>
      <div class="mask" :class="{'dark':isDark}"></div>
    </div>

    <!--<keep-alive>-->
    <router-view/>

<!--    <div class="mobile-ad-container">
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="ca-pub-5807827725641721"
           data-ad-slot="5229615181"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>-->
    <!--</keep-alive>-->

    <Audio></Audio>

    <transition name="loading-mask">
      <div class="loading-mask" v-if="!loaded">
        <img src="/res/vcplayer/groove.png" alt="">
      </div>
    </transition>


    <div class="ie-mask" v-if="isIE">
      <div class="content">
        <div class="icon">
          <img src="/res/vcplayer/miku.gif" alt="">
        </div>
        <p>本站不支持ie浏览器，请使用<a href="https://www.google.com/chrome/" target="_blank">chrome</a>或<a
                href="https://firefox.com" target="_blank">火狐</a>等现代浏览器打开本页面。</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator"
  import Audio from "./components/Audio.vue"
  import {namespace} from "vuex-class"
  import {File} from "./store/modules/file"
  import {isFullScreen, isIE} from "./utils/utils"
  import Notice from "@/utils/Notice"

  const homeModule = namespace("home")

  @Component({
    components: {Audio}
  })
  export default class extends Vue {

    @homeModule.State playingFile !: File
    @homeModule.State isDark !: boolean
    @homeModule.State loaded !: boolean

    get isIE() {
      return isIE()
    }

    public created() {
      this.$store.dispatch("home/init")
      if (window.screen.width <= 450) {
        this.$store.commit("home/setIsMobile", true)
      }

/*      Notice.open({
        title: "注意",
        desc: "为了获得最佳欣赏体验，请前往<a href=\"https://vcollection.org\" target=\"_blank\">V collection官网</a>获取完整版V collection。",
        duration: 9999
      })*/

      const that = this
      window.onresize = function () {
        that.$store.commit("home/setIsFullScreen", isFullScreen())
      }
    }

    public mounted() {
      //@ts-ignore
      // (adsbygoogle = window.adsbygoogle || []).push({})
    }

    /*    @Watch('$route')
        onRouteChange(val:any, oldVal:any) {
          if (!oldVal || !val) return
          // 背景变黑复原
          // this.$store.commit('home/setIsDark',false)

          // 模糊度变换动画
          if (val.name === 'playing' || oldVal.name === 'playing') {
            var elNodes = document.querySelectorAll('.bg-img')
            const els:Array<HTMLElement> = Array.prototype.slice.call(elNodes)
            els.forEach(el=>{
              el.className = 'bg-img no-blur'
              setTimeout(() => {
                el.className = 'bg-img'
              }, 500)
            })
          }
        }*/

    @Watch("playingFile")
    onPlayingFileChanged(val: File, oldVal: File) {
      if (!val || !oldVal) {
        return
      }
      if (val.imgUrl === oldVal.imgUrl) {
        return
      }
      var bgs: Array<HTMLImageElement> = Array.prototype.slice.call(document.querySelectorAll(".app-bg"))
      if (this.bgToken === null) {
        this.bgToken = false
      }

      if (this.bgToken === false) {
        // bgs[0].src = val.imgUrl;
        bgs[0].style.backgroundImage = `url('${val.imgUrl}')`
      } else {
        // bgs[1].src = val.imgUrl;
        bgs[1].style.backgroundImage = `url('${val.imgUrl}')`

      }
      this.bgToken = !this.bgToken
    }

    bgToken: any = false

  }

</script>

<style lang="scss">
  .mobile-ad-container {
    display: none;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #000;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;


  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  ul, ol, li {
    list-style: none;
  }

  .ivu-slider-wrap {
    background-color: rgba(255, 255, 255, .5) !important;
  }

  .ie-mask {
    z-index: 10000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      width: 20rem;
      padding: 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: white;
      border-radius: 4px;

      .icon {
        padding-bottom: 3rem;
        width: 4rem;
        height: 4rem;

        img {
          width: 100%;
        }
      }

      p {
        margin-top: 3rem;
        font-size: 1.2rem;
        text-align: center;
        width: 100%;
      }
    }
  }

  .bg {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    .mask {
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: .3;
      position: absolute;
      left: 0;
      top: 0;

      &.dark {
        opacity: .85;
      }
    }

    .bg-img {
      /*background-color: #000;*/
      width: 110%;
      height: 120%;
      filter: blur(35px) saturate(130%);
      transition: all 1s cubic-bezier(0, 1, 1, 1);
      transform: translateX(-5%) translateY(-5%);

      /*      &.no-blur {
              filter: blur(0px)
            }*/
      img {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        transition: opacity 1s;
      }

      .app-bg {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        transition: opacity 1s;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .bgImg-enter, .bgImg-leave-to {
    opacity: 0;
  }


</style>

<style lang="scss" scoped>
  @import "~@/var.scss";
  .loading-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    z-index: 1000000;
    transition: opacity .3s;

    img {
      width: 8rem;
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      margin: auto;
      /*animation: fadeIn .6s forwards;*/
      transform: translateY(-50%);

    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-40%);
    }
    100% {
      opacity: 1;
      transform: translateY(-50%);
    }
  }

  .loading-mask-leave-to {
    opacity: 0;
  }

  @media screen and (max-width: $mobileSize) {
    .mobile-ad-container{
      width: 100%;
      height: 80px;
      display: block;
    }
  }
</style>

<style lang="scss">
  @import './mobile.scss';
  @import "base";

  body, html, #app {
    overflow-x: hidden;
    width: 100%;
  }

  input {
    outline: none;
  }


</style>
