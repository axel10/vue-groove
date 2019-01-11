<template>
  <transition name="playing">
    <div class="Playing">
      <div class="wrap" v-if="playingList.length!==0">
        <div class="header" ref="header">
          <div class="back" @click="goBack">
            <Icon type="ios-arrow-round-back"/>
          </div>
        </div>
        <div class="main">
          <PlayingToolBar :moveShowList="moveShowList"
                          @toggleList="toggleList" ref="playingToolBar"></PlayingToolBar>
          <div class="music-list" :class="{'hide':!isShowList,'show':isShowList,
            'moveShow':moveShowList===true,'moveHide':moveShowList===false
          }">
            <ul class="list" ref="list">
              <PlayingListContentItem v-for="(item) in playingList" :item="item"
                                      :isShowAdd='true'
                                      :selectedItems="selectedItems"
                                      :key="guid()"
                                      @select="handlePlayingItemSelect"
              ></PlayingListContentItem>
            </ul>
          </div>
        </div>
      </div>

      <div class="select-tools" v-if="isSelectMode">
        <div class="item cancel" @click="cancelSelect">
          <p class="icon">
            <Icon type="ios-list-box-outline"/>
          </p>
          <p>取消</p>
        </div>
        <div class=" split"></div>
        <div class="item add-to" @click="showAddToMenu">
          <p class="icon">
            <Icon type="ios-add"/>
          </p>
          <p>添加到</p>
        </div>
        <div class="item remove" @click="removeSelectedItem">
          <p class="icon">
            <Icon type="ios-trash-outline"/>
          </p>
          <p>移除</p>
        </div>
        <div class="item select-all" @click="selectAll">
          <p class="icon">
            <Icon type="ios-checkmark-circle-outline"/>
          </p>
          <p>全选</p>
        </div>
      </div>

      <transition name="noItem">
        <div class="no-item-mask" v-if="playingList.length===0" @click="randomPlayAll">
          <div class="no-item">
            <h4>在这里，你将看到正在播放的歌曲以及即将播放的歌曲</h4>
            <div class="to-file">
              <div class="cd">
                <Icon type="ios-shuffle"/>
              </div>
              <div class="info">
                <p>全部随机播放</p>
                <p class="link">转到"作品列表"</p>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="big-cover">
        <div class="big-cover" v-show="isMobile && !isShowList" ref="bigCover">
          <img :src="getLargeImg(playingFile.imgUrl)" alt="">
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import PlayingToolBar from "@/components/PlayingToolBar.vue";
  import PlayingListContentItem from "../components/PlayingListContentItem.vue";
  import CreatePlayListModal from "../components/CreatePlayListModal.vue";
  import {
    dropDownMenu,
    editPlayListModal,
    getAddFileToContextMenuItems,
    guid,
    SortList,
    getLargeImg
  } from "../utils/utils";
  import {PlayList, PlayListContentDataItem} from "../store/modules/playList";
  import {File} from "../store/modules/file";
  import SelectContainer from "../mixins/selectContainer";

  const playingModule = namespace("playing");
  const playListModule = namespace("playList");
  const homeModule = namespace("home");
  const audioModule = namespace("audio");

  @Component({
    components: {CreatePlayListModal, PlayingListContentItem, PlayingToolBar}
  })
  export default class Playing extends SelectContainer {
    @homeModule.State playingFile!: File;
    @homeModule.State isMobile!: boolean;
    @playingModule.State isShowList!: boolean;
    @playListModule.State playLists!: Array<PlayList>;
    @playListModule.State playingList!: Array<File>;
    @audioModule.State playing!: boolean;

    @Watch("playingFile")
    onPlayingFileChanged() {
      this.initBigCoverPosition()
    }

    selectedItems: Array<File> = [];
    guid: Function = guid;
    getLargeImg: Function = getLargeImg;

    public created() {
      if (this.$route.params["light"] === "light") {
        this.$store.commit("playing/setShowList", false);
        this.$store.commit("home/setIsDark", false);
      } else {
        this.$store.commit("playing/setShowList", true);
        this.$store.commit("home/setIsDark", true);
      }
    }

    public mounted() {

      setTimeout(() => {
        this.initBigCoverPosition();
      });

      const list = <HTMLElement>this.$refs.list;
      const onEnd = (e: any) => {
        this.$store.commit("playList/sortPlayingListContent", {
          oldIndex: e.data.oldIndex,
          newIndex: e.data.newIndex
        });
      };
      SortList(list, {onEnd}, {delay: 400});
    }

    handlePlayingItemSelect(items){
      console.log(items)
      this.selectedItems = items
    }

    goBack() {
      this.$router.go(-1);
    }

    randomPlayAll() {
      this.$store.dispatch("file/randomPlayAll");
    }

    showAddToMenu(e: MouseEvent) {
      e.stopPropagation();

      let contextMenu = getAddFileToContextMenuItems(this.selectedItems, this);
      dropDownMenu(e, contextMenu);
    }

    showCreatePlayListModal() {
      editPlayListModal().then((name: any) => {
        this.$store.dispatch("playList/createPlayList", {name, content:this.selectedItems.map(o => {return new PlayListContentDataItem(o.title,o.p)})});
      });
    }

    toggleList() {
      if (this.isShowList) {
        this.hideList();
      } else {
        this.showList();
      }
    }

    // 禁止进入页面产生动画用的变量
    moveShowList: boolean | null = null;

    showList() {
      this.moveShowList = true;
      this.$store.commit("playing/setShowList", true);
      this.$store.commit("home/setIsDark", true);
      document!.querySelector(".arrow")!.className = "arrow";

      this.$router.replace("/playing/dark");

    }

    hideList() {
      this.moveShowList = false;
      this.$store.commit("playing/setShowList", false);
      this.$store.commit("home/setIsDark", false);
      document!.querySelector(".arrow")!.className = "arrow up";
      this.cancelSelect();
      this.$router.replace("/playing/light");


      setTimeout(() => {
        this.initBigCoverPosition();
      });
    }

    initBigCoverPosition() {
      setTimeout(() => {
        const coverHeight = document.body.clientWidth * 0.6;
        const bigCover = this.$refs.bigCover as HTMLElement;
        const playingToolBar = this.$refs.playingToolBar as Vue;
        if (!playingToolBar || !bigCover) return;
        const firstEle = playingToolBar.$el.childNodes[0] as HTMLElement;
        const offsetTop = document.body.clientHeight - playingToolBar.$el.offsetHeight + parseInt(getComputedStyle(firstEle).marginTop || "0");
        const top: number = (offsetTop - coverHeight) / 2;
        bigCover.style.top = top + "px";
      });
    }

    cancelSelect() {
      this.selectedItems = [];
    }

    removeSelectedItem() {
      const selectIds = this.selectedItems.map(o => o.id);
      this.$store.dispatch("playList/removePlayingList", selectIds);
      this.selectedItems = [];
    }

    selectAll() {
      this.selectedItems = this.playingList;
    }
  }


</script>

<style scoped lang="scss">

  .playing-enter-active, .playing-leave-active {
    transition: opacity .6s;
  }

  .playing-enter, .playing-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .Playing {
    /*padding: 0 20px;*/
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    top: 0;

    .wrap {
      height: 100%;
      max-height: 100%;
      .header {
        z-index: 200;
        position: absolute;
        top: 0;
        left: 0;
        height: 24px;
        transition: opacity .3s;
        .back {
          height: 32px;
          width: 50px;
          background-color: rgb(0, 90, 158);
          color: #fff;
          font-size: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 0;
          top: 0;

          &:hover {
            background-color: rgb(7, 77, 133);
          }
          a {
            color: #fff;
          }
        }
      }

      .main {
        box-sizing: border-box;
        display: flex;
        flex: 1;
        flex-direction: column;
        position: relative;
        height: 100%;
        max-height: 100%;

        .music-list {

          width: 100%;
          flex: 1;
          overflow-y: auto;
          /*          display: flex;
                    flex-direction: column;*/
          color: rgba(255, 255, 255, .7);
          .list {
            width: 100%;
            overflow: hidden;
            outline: none;

          }
          &.hide {
            /*animation: listHide .3s cubic-bezier(1, 0, 1, 1) forwards;*/
            transform: translateY(90vh);
          }
          &.moveHide {
            animation: listHide .3s cubic-bezier(1, 0, 1, 1) forwards;
          }
          &.show {
            /*animation: listShow .4s cubic-bezier(1, .5, .5, 1) forwards;*/
            transform: translateY(0);
          }
          &.moveShow {
            animation: listShow .4s cubic-bezier(1, .5, .5, 1) forwards;
          }
        }
      }
    }

    .select-tools {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 70px;
      background-color: #fff;
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;

      .split {
        width: 1px;
        margin: 5px 10px;
        background-color: #aaa;
      }

      .item {
        width: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #ccc;
        }
        .icon {
          font-size: 28px;
        }
      }
    }

    .no-item-mask {
      transition: opacity .4s;
      z-index: 100;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      margin: auto;
      color: #fff;
      background-color: #000;
      .no-item {
        /*margin-top: 40px;*/
        text-align: left;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto auto auto 40px;

        height: 100px;

        h4 {
          font-weight: normal;
          margin-bottom: 16px;
          font-size: 20px;
        }
        .to-file {
          display: flex;
          .cd {
            width: 50px;
            height: 50px;
            font-size: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 50%;
              height: 50%;
            }
          }
          .info {
            font-size: 16px;
            .link {
              color: rgb(0, 90, 158);
              font-size: 12px;
            }
          }

          &:hover {
            opacity: .8;
          }
        }
      }

    }

    .big-cover {
      width: 60%;
      /*height: 300px;*/
      position: absolute;
      left: 0;
      right: 0;
      /*bottom: 25%;*/
      top: 0;
      margin: auto;
      transition: transform .5s, opacity .5s;
      img {
        width: 100%;
      }
    }
  }

  .noItem-enter, .noItem-leave-to {
    opacity: 0;
  }

  .big-cover-enter, .big-cover-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }

  @keyframes listHide {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(90vh);
    }
  }

  @keyframes listShow {
    0% {
      transform: translateY(90vh);
    }
    100% {
      transform: translateY(0);
    }
  }


</style>

<style lang="scss">
  .draggable-mirror {
    display: none !important;
  }
</style>
