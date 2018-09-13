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
    <!--</keep-alive>-->

    <Audio></Audio>
  </div>
</template>

<script lang="ts">
  import {Component, Watch, Vue} from "vue-property-decorator";
  import Audio from "./components/Audio.vue";
  import {namespace} from "vuex-class";
  import {File} from "./store/modules/file";

  const homeModule = namespace("home");

  @Component({
    components: {Audio}
  })
  export default class extends Vue {

    @homeModule.State playingFile !: File;
    @homeModule.State isDark !: boolean;

    public created() {
      this.$store.dispatch("home/init");
      if (window.screen.width <= 450) {
        this.$store.commit("home/setIsMobile", true);
      }
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
      if (!val || !oldVal) return;
      if (val.imgUrl === oldVal.imgUrl) return;
      var bgs: Array<HTMLImageElement> = Array.prototype.slice.call(document.querySelectorAll(".app-bg"));
      if (this.bgToken === null) this.bgToken = false;

      if (this.bgToken === false) {
        // bgs[0].src = val.imgUrl;
        bgs[0].style.backgroundImage = `url('${val.imgUrl}')`;
      } else {
        // bgs[1].src = val.imgUrl;
        bgs[1].style.backgroundImage= `url('${val.imgUrl}')`;

      }
      this.bgToken = !this.bgToken;
    }

    bgToken: any = false;

  }

</script>

<style lang="scss">
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
      height: 110%;
      filter: blur(35px) saturate(100%);
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

      .app-bg{
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

<style lang="scss">
  @import './mobile.scss';
</style>