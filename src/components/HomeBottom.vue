<template>
  <div class="HomeBottom">
    <div class="file-info" @click="$router.push('/playing/light')" v-if="playingFile.imgUrl">
      <div class="mask"></div>
      <div class="cover">
        <img :src="playingFile.imgUrl"  alt="">
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
      </div>
      <div class="progress">
        <p class="current">{{currentTimeStr}}</p>
        <div class="slider">
          <Slider :value="timePercent" @on-change="handleSelectTime" :tip-format="formatProgress"></Slider>
        </div>
        <p class="total">{{durationTimeStr}}</p>
      </div>
    </div>

    <div class="right">
      <!--      <div class="round-btn mute">
              &lt;!&ndash;<Icon type="ios-volume-up"/>&ndash;&gt;
              &lt;!&ndash;<Icon type="ios-volume-off" />&ndash;&gt;
              <Icon type="ios-volume-down"/>
            </div>-->
      <VolumeIcon class="round-btn mute" :click-to-mute="true"></VolumeIcon>
      <div class="volume">
        <Slider :value="volume" @on-input="handleChangeVolume"></Slider>
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
  import VolumeIcon from "./VolumeIcon.vue";
  import {dropDownMenu, toggleFullScreen} from "../utils/utils";


  const homeModule = namespace("home");
  const audioModule = namespace("audio");
  const playListModule = namespace("playList");

  @Component({
    components: {VolumeIcon, Loop, Random}
  })
  export default class HomeBottom extends Vue {
    @audioModule.State playing!: boolean;
    @audioModule.State currentTime!: number;
    @audioModule.State duration!: number;
    @audioModule.State volume!: number;
    @audioModule.State isRandom!: boolean;
    @audioModule.Getter currentTimeStr!: string;
    @audioModule.Getter durationTimeStr!: string;
    @audioModule.Getter timePercent!: any;
    @audioModule.Action toPrev!: any;
    @audioModule.Action toNext!: any;
    @audioModule.Mutation handleSelectTime!: any;
    @audioModule.Mutation handleChangeVolume!: any;
    @audioModule.Mutation toggleRandom!: any;
    @homeModule.State playingFile!: File;
    @playListModule.State playingList!: Array<File>;

    formatProgress(val: number) {
      var sec = this.duration * (val / 100);
      return getTimeStr(sec);
    }

    togglePlay() {
      this.$store.dispatch("audio/togglePlay");
    }

    showMoreMenu(e: MouseEvent) {
      const contextMenu: any = [
        {
          label: "转到'正在播放'", callback: () => {
            this.$router.push("/playing/light");
          }, isDisable: this.playingList.length === 0
        },
        {
          label: "全屏", callback: () => {
            toggleFullScreen();
            this.$router.push("/playing/light");
          }
        }, {
          label: "清空'正在播放'", callback: () => {
            this.$store.dispatch('audio/abort')
            this.$store.commit('playList/setPlayingList',[])
          }
        },
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
    background-color: rgba(150, 150, 150, .5);
    position: relative;

    .round-btn {
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      text-align: center;
      width: 40px;
      height: 40px;
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
          margin-right: 10px;
        }
        .total {
          margin-left: 10px;
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
        width: 120px;
      }
      .more {
        margin-left: 10px;
      }
    }

  }
</style>