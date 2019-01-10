<template>
  <div class="PlayList" ref="main">
    <div class="top" ref="top">
      <div class="left">
        <div class="cover">
          <div class="small-block" ref="block1"></div>
          <div class="block" ref="block2"></div>
          <div class="cd" ref="cd">
            <img :src="topImgUrl" alt="" v-if="topImgUrl.length>0">
            <Icon type="ios-list" v-if="topImgUrl.length===0"/>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="placeholder"></div>
        <div class="top-area">
          <div class="title">{{distPlayList.title}}</div>
          <div class="list-info" ref="listInfo">
            <p>{{distPlayList.content.length}}首歌，{{totalMinute}}分钟</p>

          </div>
        </div>
        <div class="buttons">
          <div class="play-all" @click="playAll"><span><Icon type="ios-play-outline"/></span>全部播放</div>
          <div class="rename" @click="rename"><span><Icon type="ios-create-outline"/></span>重命名</div>
          <div class="remove" @click="remove"><span><Icon type="ios-trash-outline"/></span>删除</div>
        </div>
      </div>
    </div>
    <div class="bottom">

      <div class="no-item" v-if="distPlayListContent.length===0">
        <h4>播放列表没有音乐？</h4>
        <div class="to-file" @click="$router.push('/')">
          <div class="cd">
            <img src="/res/vcplayer/cd.png" alt="">
          </div>
          <div class="info">
            <p>从作品列表添加歌曲</p>
            <p class="link">转到"作品列表"</p>
          </div>
        </div>
      </div>

      <ul class="list" ref="list" :class="{'hide':distPlayListContent.length<=0}"
          :style="{paddingBottom:isSelectMode?'70px':0}">
        <li class="PlayListContentItem token" style="height: 50px;outline: none"></li>
        <PlayListContentItem v-for="(item,i) in distPlayListContent"
                             :item="item"
                             :index="i"
                             :selectedItems="selectedItems"
                             :key="guid()"
                             :class="{'deep':i%2===0}"
                             @select="(val)=>{selectedItems=val}">
        </PlayListContentItem>
      </ul>

      <SelectBottomTools v-if="isSelectMode">
        <li class="item cancel" @click="cancelSelect">
          <p class="icon">
            <Icon type="ios-list-box-outline"/>
          </p>
          <p>取消</p>
        </li>
        <li class=" split"></li>
        <li class="item add-to" @click="showAddToMenu">
          <p class="icon">
            <Icon type="ios-add"/>
          </p>
          <p>添加到</p>
        </li>
        <li class="item remove" @click="play">
          <p class="icon">
            <Icon type="ios-play-outline"/>
          </p>
          <p>播放</p>
        </li>
        <li class="item remove" @click="removeSelected">
          <p class="icon">
            <Icon type="ios-trash-outline"/>
          </p>
          <p>移除</p>
        </li>
        <li class="item select-all" @click="selectAll">
          <p class="icon">
            <Icon type="ios-checkmark-circle-outline"/>
          </p>
          <p>全选</p>
        </li>
      </SelectBottomTools>


    </div>

  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";
  import PlayListContentItem from "@/components/PlayListContentItem.vue";
  import {dropDownMenu, editPlayListModal, guid} from "@/utils/utils";
  import {confirm} from "@/utils/utils";
  import {Sortable, Plugins} from "@shopify/draggable";
  import {getAddFileToContextMenuItems, getLargeImg, playAllSelectFile, SortList} from "../utils/utils";
  import {PlayList, PlayListContentDataItem} from "../store/modules/playList";
  import {File} from "../store/modules/file";
  import SelectContainer from "../mixins/selectContainer";
  import SelectBottomTools from "../components/Operation/SelectBottomTools.vue";

  const playListModule = namespace("playList");
  const fileModule = namespace("file");
  const homeModule = namespace("home");


  class distPlayList extends PlayList {
    filesContent!: Array<File>;
  }

  @Component({
    components: {SelectBottomTools, PlayListContentItem}
  })
  export default class PlayListView extends SelectContainer {
    // @Prop(Object) item;
    @playListModule.State playLists!: Array<PlayList>;
    @playListModule.State playingList!: Array<File>;
    @fileModule.State allFile!: Array<File>;
    @homeModule.State isFold!: boolean;
    @homeModule.State isMobile!: boolean;

    @Watch("selectedItems")
    onSelectedItemsChanged(val: Array<File>) {
      if (val.length > 0) {
        this.$store.commit("home/setIsHideBottom", true);
      } else {
        this.$store.commit("home/setIsHideBottom", false);
      }
    }

    @Watch("$route")
    onRouteChange() {
      this.initContent();
      setTimeout(() => {
        const list = <HTMLElement>this.$refs.list;
        const top = <HTMLElement>this.$refs.top;
        const scrollWidth = top.offsetWidth - list.offsetWidth;
        top.style.width = top.offsetWidth - scrollWidth + "px";
      }, 1);
    }

    @Watch("isFold")
    onIsFoldChanged() {
      setTimeout(() => {
        const list = <HTMLElement>this.$refs.list;
        const top = <HTMLElement>this.$refs.top;
        const scrollWidth = top.offsetWidth - list.offsetWidth;
        top.style.width = top.offsetWidth - scrollWidth + "px";
      });
    }

    @Watch("distPlayListContent")
    onDistPlayListContentChanged(val: Array<File>) {
      this.$store.commit("playList/setPlayListContent", {
        listId: this.distPlayList!.id,
        content: val.map((o: File) => new PlayListContentDataItem(o.title,o.p))
      });
    }

    // 字段同playList,Content中为具体的文件
    distPlayList!: distPlayList;
    distPlayListContent: Array<File> = [];
    selectedItems: Array<File> = [];
    guid: Function = guid;
    title: string = "播放列表";

    public created() {
      this.initContent();
      this.$store.commit("home/setCurrentTitle", this.title);
    }

    public destroyed() {
      const top = document.querySelector(".mobile-top") as HTMLElement;
      if (!top || !this.isMobile) return;
      top.className += "mobile-top";
    }

    public mounted() {


      const list = <HTMLElement>this.$refs.list;
      const onStart = (e: any) => {
        if (e.data.startIndex === 0) {
          e.cancel();
        }
      };

      const onSort = (e: any) => {
        if (e.data.over && e.data.over.className.indexOf("token") !== -1) e.cancel();
      };

      const onEnd = (e: any) => {
        this.$store.commit("playList/sortPlayListContent", {
          listId: this.distPlayList!.id,
          oldIndex: e.data.oldIndex - 1,
          newIndex: e.data.newIndex - 1
        });

        setTimeout(function () {
          const items: Array<HTMLElement> = Array.prototype.slice.call(document.querySelectorAll(".PlayListItemBase"));

          items.forEach((o, i) => {
            if (i % 2 === 0) {
              o.className = "PlayListItemBase deep";
            } else {
              o.className = "PlayListItemBase";
            }
          });
        });
      };

      SortList(list, {onStart, onSort, onEnd}, {delay: 400});

      if (this.isMobile) {
        const top = document.querySelector(".mobile-top") as HTMLElement;
        top.className += " blue";
        return;
      }

      const main = <HTMLElement>this.$refs.main;
      const top = <HTMLElement>this.$refs.top;
      const topHeight = top.offsetHeight;
      const cd = <HTMLElement>this.$refs.cd;
      const listInfo = <HTMLElement>this.$refs.listInfo;
      const block1 = <HTMLElement>this.$refs.block1;
      const block2 = <HTMLElement>this.$refs.block2;
      const blockHeight = block1.offsetHeight;
      const scrollWidth = main.offsetWidth - list.offsetWidth;
      top.style.width = main.offsetWidth - scrollWidth + "px";
      window.onresize = function () {
        top.style.width = main.offsetWidth - scrollWidth + "px";
      };
      let cdSize = cd.offsetHeight;
      const cdMinSize = 90;
      const topMinSize = 135;
      main.addEventListener("scroll", function (e: Event) {
        const scrollTop = (<HTMLElement>e.target).scrollTop;
        top.style.height = (topHeight - scrollTop < topMinSize ? topMinSize : topHeight - scrollTop) + "px";
        const distCdSize = cdSize - scrollTop < cdMinSize ? cdMinSize : cdSize - scrollTop;
        cd.style.height = distCdSize + "px";
        cd.style.width = distCdSize + "px";

        block1.style.height = blockHeight * (top.offsetHeight / topHeight) + "px";
        block2.style.height = blockHeight * (top.offsetHeight / topHeight) + "px";

        if (top.offsetHeight < 160) {
          listInfo.style.opacity = "0";
        } else {
          listInfo.style.opacity = "1";
        }
      });
    }


    get topImgUrl() {
      return this.distPlayList!.filesContent.length ? getLargeImg(this.distPlayList!.filesContent[0].imgUrl) : "";
      // return this.distPlayList!.filesContent.length ? this.distPlayList!.filesContent[0].imgUrl.replace('/small/','/large/') : "";
    }

    get totalMinute() {
      if (!Object.keys(this.distPlayList).length) {
        return 0
      }
      const sec = this.distPlayList!.filesContent.reduce((total, timeStr) => {
        const timeArr = timeStr.time.split(":").map(o => parseInt(o));
        return total + timeArr[0] * 60 + timeArr[1];
      }, 0);
      return Math.floor(sec / 60);
    }

    initContent() {
      const id = this.$route.params["id"];
      const currentPlayList = this.playLists.find(o => o.id === id);
      if (!currentPlayList || Object.keys(currentPlayList).length === 0) {
        return;
      }
      const playListContentData: Array<PlayListContentDataItem> = currentPlayList.content;

      const content: any = playListContentData.map(o => {
        return this.allFile.find((file: File) => file.title === o.title && file.p === o.p);
      }).filter(o => o) || [];


      this.distPlayList = {...currentPlayList, filesContent: content};
      this.distPlayListContent = content;
    }

    cancelSelect() {
      this.selectedItems = [];
    }

    selectAll() {
      this.selectedItems = this.distPlayList!.filesContent;
    }

    showAddToMenu(e: MouseEvent) {
      let contextMenu: any = getAddFileToContextMenuItems(this.selectedItems, this);
      dropDownMenu(e, contextMenu);
    }

    removeSelected() {
      this.$store.dispatch("playList/removePlayListContents", {
        listId: this.distPlayList!.id,
        ids: this.selectedItems.map(o => o.id)
      });
      this.distPlayListContent = this.distPlayListContent.filter(o => this.selectedItems.map(o => o.id).indexOf(o.id) === -1);
      this.selectedItems = [];
    }

    playAll() {
      if (!this.distPlayListContent.length) {
        this.$Message.info("列表中还没有任何作品:(");
        return;
      }
      ;
      this.$store.dispatch("file/playDirs", this.distPlayListContent);
    }

    play() {
      playAllSelectFile(this);
    }

    rename() {
      editPlayListModal({isRename: true, oldName: this.distPlayList!.title}).then(name => {
        this.$store.dispatch("playList/renamePlayList", {name, id: this.distPlayList!.id});
      });
    }

    remove() {
      confirm({title: "确定要删除吗?", info: "该播放列表下的所有条目都将被删除"}).then(() => {
        this.$store.dispatch("playList/removePlayList", {id: this.distPlayList!.id, context: this});
      });
    }
  }
</script>

<style scoped lang="scss">
  .PlayList {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
    position: relative;

    .top {
      width: 100%;
      position: fixed;
      transition: all .01s;
      background-color: #2d7adc;
      display: flex;
      height: 300px;
      box-sizing: border-box;
      padding: 30px 40px;
      z-index: 100;
      .left {
        /*width: 280px;*/
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .cover {
          /*width: 200px;*/
          .small-block, .block {
            height: 8px;
            margin: 0 auto;
          }
          .small-block {
            width: 80%;
            background-color: rgba(255, 255, 255, .4);
          }
          .block {
            width: 90%;
            background-color: rgba(255, 255, 255, .7);
          }
          .cd {
            transition: all .01s;

            width: 200px;
            height: 200px;
            background-color: #eee;
            font-size: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
            }
          }
        }

      }
      .right {
        .placeholder {
          height: 12%;
        }

        color: #fff;
        display: flex;
        flex-direction: column;
        flex: 1;
        box-sizing: border-box;
        padding-left: 30px;
        /*padding: 40px 40px 40px 20px;*/
        text-align: left;
        .top-area {
          .title {
            font-size: 30px;
            font-weight: lighter;
            font-family: -webkit-body;
          }
          .list-info {
            transition: opacity .2s;
            font-size: 14px;
          }
        }
        .buttons {
          margin-top: auto;
          font-size: 14px;
          height: 32px;
          div {
            display: inline-flex;
            align-items: center;
            margin-right: 30px;
            span {
              display: inline-flex;
              align-items: center;
              font-size: 20px;
              margin-right: 5px;
            }
          }
        }
      }

      .bottom {
        padding: 25px 15px 0;
        box-sizing: border-box;
      }
    }

    .bottom {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;

      .list {
        box-sizing: border-box;
        padding: 30px 20px 0;
        width: 100%;
        position: relative;
        top: 255px;

        > .deep {
          background-color: #eee;
        }

        /*overflow: auto;*/
        &.hide {
          visibility: hidden;
          position: absolute;
        }
      }

      .no-item {
        margin-top: 340px;
        align-self: flex-start;
        margin-left: 40px;
        text-align: left;
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
            /*box-sizing: border-box;*/
            /*padding: 10px;*/
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
              font-size: 14px;
            }
          }

          &:hover {
            opacity: .8;
          }
        }
      }
    }

  }
</style>

