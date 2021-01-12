<template>
  <div class="HomeBottom" :style="{'background-color':background}">
    <div class="file-info" @click="$router.push('/playing/light')" v-if="playingFile">
      <div class="mask"></div>
      <div class="cover" v-if="playingFile && playingFile.imgUrl">
        <img :src="playingFile.imgUrl" alt="">
      </div>
      <div class="info">
        <h5>
          {{playingFile.title}}
        </h5>
        <p>{{playingFile.p}}</p>
      </div>
    </div>

    <div class="center">
      <div>
        <i class="ios-play-outline"></i>
      </div>
      <div class="buttons">
        <Random class="round-btn"></Random>
        <div class="round-btn prev" @click="toPrev">
          <Icon type="ios-skip-backward-outline"/>
        </div>
        <div class="round-btn play" @click="togglePlay">
          <Icon v-if="!playing" type="ios-play-outline" style="padding-left: 4px;"/>
          <Icon v-if="playing" type="ios-pause-outline"/>
        </div>
        <div class="round-btn next" @click="toNext">
          <Icon type="ios-skip-forward-outline"/>
        </div>
        <Loop class="round-btn loop"></Loop>

        <div class="round-btn mobile-more" @click="showMobileMoreMenu">
          <Icon type="ios-more"/>
        </div>
      </div>
      <div class="progress">
        <p class="current">{{currentTimeStr}}</p>
        <div class="slider">
          <TimeSlider></TimeSlider>
        </div>
        <p class="total">{{durationTimeStr}}</p>
      </div>
    </div>

    <div class="right">
<!--      <div class="like-group" v-if="playingFile.title">
        <div class="group" :class="{'active':liked}">
          <div class="round-btn svg no-border" @click="like('like')">
            &lt;!&ndash;<img src="../assets/like.svg" alt="" >&ndash;&gt;
            <svg ref="like" t="1546226736126" class="icon" style="" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="9852" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
              <path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
                    p-id="9853" fill="#ffffff"/>
            </svg>
          </div>
          <span>21123</span>
        </div>

        <div class="group">
          <div class="round-btn svg no-border" style="padding: 8px 7px 6px;">
            <svg t="1546226758727" class="icon" style="" viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="10000" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
              <path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4-8.3-3.6-17.2-5.4-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81z m627.2 160.4H496.8l9.6 198.4c0.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7-19.6-0.1-36.9-13.4-42.2-32.3L329 459.2V172h415.4c20.4 9.2 33.6 29.4 33.6 51.8 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19c12.5 10.8 19.6 26.5 19.6 43 0 19.1-11 37.5-28.8 48.4z"
                    p-id="10001" fill="#ffffff"></path>
            </svg>
          </div>
          <span>21123</span>
        </div>

      </div>-->
      <div class="volume">
        <VolumeSlider>
          <VolumeIcon class="round-btn mute" :click-to-mute="true"></VolumeIcon>
        </VolumeSlider>
      </div>

      <div class="round-btn more" @click="showMoreMenu">
        <Icon type="ios-more"/>
      </div>
    </div>

    <!-- <LikeBtnGrout></LikeBtnGrout> -->

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"
  import {State, Mutation, Action, namespace} from "vuex-class"
  import {getTimeStr} from "@/store/modules/audio"
  import Random from "./Operation/Random.vue"
  import Loop from "./Operation/Loop.vue"
  import VolumeIcon from "./Operation/VolumeIcon.vue"
  import {
    dropDownMenu,
    DropDownMenuItem,
    exitFullScreen,
    fullScreen, getOffsetLeft, getOffsetTop,
    isFullScreen, showLoginModal,
    toggleFullScreen
  } from "@/utils/utils"
  import {File} from "@/store/modules/file"
  import VolumeSlider from "./Operation/VolumeSlider.vue"
  import TimeSlider from "./Operation/TimeSlider.vue"
  import {LoopMode} from "@/utils/enum/LoopMode"
  import {fire, shake} from "@/utils/animatie"
  import Modal from "@/components/Modal.vue"
  import mainApi from "@/api/mainApi"
  import LikeBtnGrout from '@/components/LikeBtnGroup.vue'


  const homeModule = namespace("home")
  const audioModule = namespace("audio")
  const playListModule = namespace("playList")

  @Component({
    components: {LikeBtnGrout, TimeSlider, VolumeSlider, VolumeIcon, Loop, Random, Modal}
  })
  export default class HomeBottom extends Vue {
    @audioModule.State playing!: boolean
    @audioModule.State currentTime!: number
    @audioModule.State duration!: number
    @audioModule.State volume!: number
    @audioModule.State isRandom!: boolean
    @audioModule.State loopMode!: LoopMode
    @audioModule.Getter currentTimeStr!: string
    @audioModule.Getter durationTimeStr!: string
    @audioModule.Getter timePercent!: any
    @audioModule.Action toPrev!: any
    @audioModule.Action toNext!: any
    @audioModule.Mutation handleSelectTime!: any
    @audioModule.Mutation toggleRandom!: any
    @homeModule.State playingFile!: File
    @homeModule.State isLogin!: boolean
    @homeModule.State liked!: boolean
    @homeModule.State disliked!: boolean
    // @homeModule.State isFullScreen!: boolean;
    @playListModule.State playingList!: Array<File>

    get background() {
      if (this.playingFile && this.playingFile.title) {
        return "rgba(150, 150, 150, .5)"
      } else {
        return "rgba(27, 96, 147, 1)"
      }
    }

    formatProgress(val: number) {
      const sec = this.duration * (val / 100)
      return getTimeStr(sec)
    }

/*     like(e: MouseEvent,a) {
      if (this.disliked) {
        return
      }
      const {like: target} = this.$refs as HTMLElement
      const parent = target.parentElement
      const left = getOffsetLeft(parent) + parent.offsetWidth / 2
      const top = getOffsetTop(parent) + parent.offsetHeight / 2
      const callLike = () => {
        if (!this.liked) {
          fire(left, top)
          shake(target)
        }
        this.$store.dispatch("home/like", {action: "like"})
      }

      if (!this.isLogin) {
        showLoginModal().then(o => {
          callLike()
        })
      } else {
        callLike()
      }
    } */


    public togglePlay() {
      this.$store.dispatch("audio/togglePlay")
    }

    showMoreMenu(e: MouseEvent) {
      const contextMenu: Array<DropDownMenuItem> = [
        {
          label: "转到'正在播放'", callback: () => {
            this.$router.push("/playing/light")
          }, isDisable: this.playingList.length === 0
        },
        {
          label: isFullScreen() ? "取消全屏" : "全屏", callback: () => {
            if (isFullScreen()) {
              exitFullScreen()

            } else {
              fullScreen()
              this.$router.push("/playing/light")

            }
          }
        }, {
          label: "清空'正在播放'", callback: () => {
            this.$store.dispatch("audio/abort")
            this.$store.commit("playList/setPlayingList", [])
          }
        }/*, {
          label: "test",
          children: [
            {label: "kakakak"}
          ]
        }*/
      ]
      dropDownMenu(e, contextMenu)
    }

    showMobileMoreMenu(e: MouseEvent) {

      let loopLabel = ""
      switch (this.loopMode) {
        case LoopMode.close:
          loopLabel = "循环播放全部"
          break
        case LoopMode.loopAll:
          loopLabel = "单曲循环"
          break
        case LoopMode.loopSingle:
          loopLabel = "关闭循环"
          break
      }

      const contextMenu: Array<DropDownMenuItem> = [
        {
          label: "转到'正在播放'", callback: () => {
            this.$router.push("/playing/light")
          }, isDisable: this.playingList.length === 0
        },
        {
          label: isFullScreen() ? "取消全屏" : "全屏", callback: () => {
            if (isFullScreen()) {
              exitFullScreen()
            } else {
              fullScreen()
              this.$router.push("/playing/light")
            }
          }
        }, {
          label: "清空'正在播放'", callback: () => {
            this.$store.dispatch("audio/abort")
            this.$store.commit("playList/setPlayingList", [])
          }
        },
        {
          el: new Vue({
            template: "<VolumeSlider><VolumeIcon style='font-size: 30px'></VolumeIcon></VolumeSlider>",
            components: {VolumeSlider, VolumeIcon},
            store: this.$store
          })
        }, {
          label: loopLabel,
          callback: () => {
            this.$store.commit("audio/switchLoopMode")
          }
        }
      ]
      dropDownMenu(e, contextMenu)
    }
  }
</script>

<style scoped lang="scss">
  @import "../var";

  .HomeBottom {
    height: 100px;
    display: flex;
    justify-content: center;
    /*background-color: rgba(150, 150, 150, .5);*/
    position: relative;
    transition: background-color 1s;


    .file-info {
      position: absolute;
      left: 0;
      display: flex;
      /*width: 300px;*/
      height: 100%;
      padding-right: 20px;
      color: #fff;
      max-width: 30%;

      &:hover {
        .mask {
          opacity: .1;
        }
      }

      .mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background-color: #000;
        opacity: 0;
      }

      .cover {
        width: 100px;
        height: 100px;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-right: 6px;
        text-align: left;
        margin-left: 10px;
        flex: 1;
        max-width: 80%;

        h5 {
          font-weight: normal;
          font-size: 20px;
          margin: 0 0 8px 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        p {
          margin: 0;
          font-weight: bold;
          font-size: 16px;
        }
      }

    }

    .center {
      width: 33%;
      display: flex;
      flex-direction: column;

      .buttons {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 3;
        position: relative;
        top: 3px;

        .round-btn {
          margin: 0 6px;

          &.active {
            /*background-color: rgba(255,255,255,.5);*/
          }
        }

        .play {
          width: 55px;
          height: 55px;
          font-size: 40px;

          box-sizing: border-box;
        }
      }

      .progress {
        width: 100%;
        flex: 2;
        display: flex;
        align-items: center;

        .current, .total {
          font-size: 12px;
          color: #fff;
        }

        .current {
          margin-right: 20px;
        }

        .total {
          margin-left: 20px;
        }

        .slider {
          flex: 1;
        }
      }
    }

    .right {
      margin-right: 20px;
      margin-top: 20px;
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;

      & > .like-group {
        margin-right: .6rem;

        & > .group {
          display: flex;
          align-items: center;

          &.active {
            color: #b2ddff;

            path {
              fill: #b2ddff;
            }
          }
        }
      }

      .mute {
        margin-right: 8px;
        font-size: 40px;
      }

      .volume {
        width: 180px;
      }

      .more {
        margin-left: 10px;
      }
    }

  }
</style>
