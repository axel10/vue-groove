<template>
  <div class="HomeBottom" :style="{'background-color':background}">
    <div class="file-info" @click="$router.push('/playing/light')" v-if="playingFile.imgUrl">
      <div class="mask"></div>
      <div class="cover">
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
      <div class="buttons">
        <!--        <div class="round-btn random"  :class="{'active':isRandom}" @click="toggleRandom">
                  <Icon type="ios-shuffle"/>
                </div>-->
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
        <!--        <div class="round-btn repeat">
                  <Icon type="ios-repeat"/>
                </div>-->
        <Loop class="round-btn loop"></Loop>

        <div class="round-btn mobile-more" @click="showMobileMoreMenu">
          <Icon type="ios-more"/>
        </div>
      </div>
      <div class="progress">
        <p class="current">{{currentTimeStr}}</p>
        <div class="slider">
          <!--<Slider :value="timePercent" @on-change="handleSelectTime" :tip-format="formatProgress"></Slider>-->
          <TimeSlider></TimeSlider>
        </div>
        <p class="total">{{durationTimeStr}}</p>
      </div>
    </div>

    <div class="right">
      <div class="volume">
        <VolumeSlider>
          <VolumeIcon class="round-btn mute" :click-to-mute="true"></VolumeIcon>
        </VolumeSlider>
      </div>

      <div class="round-btn more" @click="showMoreMenu">
        <Icon type="ios-more"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";
  import {getTimeStr} from "../store/modules/audio";
  import Random from "./Operation/Random.vue";
  import Loop from "./Operation/Loop.vue";
  import VolumeIcon from "./Operation/VolumeIcon.vue";
  import {dropDownMenu, DropDownMenuItem, toggleFullScreen} from "../utils/utils";
  import {File} from "../store/modules/file";
  import VolumeSlider from "./Operation/VolumeSlider.vue";
  import TimeSlider from "./Operation/TimeSlider.vue";
  import {LoopMode} from "../utils/enum/LoopMode";


  const homeModule = namespace("home");
  const audioModule = namespace("audio");
  const playListModule = namespace("playList");

  @Component({
    components: {TimeSlider, VolumeSlider, VolumeIcon, Loop, Random}
  })
  export default class HomeBottom extends Vue {
    @audioModule.State playing!: boolean;
    @audioModule.State currentTime!: number;
    @audioModule.State duration!: number;
    @audioModule.State volume!: number;
    @audioModule.State isRandom!: boolean;
    @audioModule.State loopMode!: LoopMode;
    @audioModule.Getter currentTimeStr!: string;
    @audioModule.Getter durationTimeStr!: string;
    @audioModule.Getter timePercent!: any;
    @audioModule.Action toPrev!: any;
    @audioModule.Action toNext!: any;
    @audioModule.Mutation handleSelectTime!: any;
    @audioModule.Mutation toggleRandom!: any;
    @homeModule.State playingFile!: File;
    @homeModule.State isFullScreen!: boolean;
    @playListModule.State playingList!: Array<File>;

    get background() {
      if (this.playingFile && this.playingFile.id) {
        return "rgba(150, 150, 150, .5)";
      } else {
        return "rgba(27, 96, 147, 1)";
      }
    }

    formatProgress(val: number) {
      var sec = this.duration * (val / 100);
      return getTimeStr(sec);
    }

    togglePlay() {
      this.$store.dispatch("audio/togglePlay");
    }

    showMoreMenu(e: MouseEvent) {

      const contextMenu: Array<DropDownMenuItem> = [
        {
          label: "转到'正在播放'", callback: () => {
            this.$router.push("/playing/light");
          }, isDisable: this.playingList.length === 0
        },
        {
          label: this.isFullScreen ? "取消全屏" : "全屏", callback: () => {
            toggleFullScreen();
            setTimeout(() => {
              if (this.isFullScreen) {
                this.$router.push("/playing/light");
              }
            });
          }
        }, {
          label: "清空'正在播放'", callback: () => {
            this.$store.dispatch("audio/abort");
            this.$store.commit("playList/setPlayingList", []);
          }
        }/*, {
          label: "test",
          children: [
            {label: "kakakak"}
          ]
        }*/
      ];
      dropDownMenu(e, contextMenu);
    }

    showMobileMoreMenu(e: MouseEvent) {

      let loopLabel = "";
      switch (this.loopMode) {
        case LoopMode.close:
          loopLabel = "循环播放全部";
          break;
        case LoopMode.loopAll:
          loopLabel = "单曲循环";
          break;
        case LoopMode.loopSingle:
          loopLabel = '关闭循环'
          break
      }

      const contextMenu: Array<DropDownMenuItem> = [
        {
          label: "转到'正在播放'", callback: () => {
            this.$router.push("/playing/light");
          }, isDisable: this.playingList.length === 0
        },
        {
          label: this.isFullScreen ? "取消全屏" : "全屏", callback: () => {
            toggleFullScreen();
            setTimeout(() => {
              if (this.isFullScreen) {
                this.$router.push("/playing/light");
              }
            });
          }
        }, {
          label: "清空'正在播放'", callback: () => {
            this.$store.dispatch("audio/abort");
            this.$store.commit("playList/setPlayingList", []);
          }
        },
        {
          el: new Vue({
            template: "<VolumeSlider><VolumeIcon style='font-size: 30px'></VolumeIcon></VolumeSlider>",
            components: {VolumeSlider, VolumeIcon},
            store: this.$store
          })
        },{
          label:loopLabel,
          callback:()=>{
            this.$store.commit('audio/switchLoopMode')
          }
        }


      ];
      dropDownMenu(e, contextMenu);
    }
  }
</script>

<style scoped lang="scss">
  .HomeBottom {
    height: 100px;
    display: flex;
    justify-content: center;
    /*background-color: rgba(150, 150, 150, .5);*/
    position: relative;
    transition: background-color 1s;

    .round-btn {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      text-align: center;
      width: 41px;
      height: 41px;
      font-size: 26px;
      color: #fff;
      border: 2px solid rgba(255, 255, 255, 0);

      &:hover {
        box-sizing: border-box;
        border: 2px solid rgba(255, 255, 255, .5);
      }

      &.loop {
        box-sizing: border-box;
        padding: 6px 7px 8px;
        /*padding: 7px;*/

      }

      &.mobile-more {
        display: none;
      }
    }

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