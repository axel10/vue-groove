<template>
  <div class="item FileItem" :class="{'selected':selected,'file':!item.content,'dir':item.content}"
       @click="handleSelect" @contextmenu="showDropDown">

    <div class="checkbox-area" v-if="isSelectMode">
      <div class="checkbox" :class="{'no-select':!selected}">
        <Icon type="ios-checkmark" v-if="selected"/>
      </div>
    </div>

    <div :class="{top:true,'no-bg':isDir}">
      <div class="file" v-if="!item.content">
        <div class="cover">
          <img :src="item.imgUrl" v-if="item.imgUrl" @load="showCover">
          <div class="dir-icon" v-if="!item.imgUrl">
            <img src="/res/vcplayer/cd.png">
          </div>
        </div>
      </div>

      <div class="dir" v-if="item.content">
        <div class="color-wrap" ref="colorWrap">

          <div class="cover">
            <div class="small-block"></div>
            <div class="block"></div>
            <div class="cd">
              <Icon type="ios-list"/>
            </div>
          </div>
        </div>
      </div>

      <div class="operation">
        <div class="play" @click="play">
          <Icon type="ios-play-outline"/>
        </div>
        <div class="add" @click="showAddToDropDown">
          <Icon type="ios-add"/>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="!item.content">
      <h5 :class="{'bold':item.imgUrl}">{{item.title}}</h5>
      <p class="artist">{{item.p?item.p:''}}</p>
    </div>

    <div class="bottom" v-if="item.content">
      <h5 class="title">{{item.title}}</h5>
      <p class="total">{{fileTotal}}首歌曲</p>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop} from "vue-property-decorator";
  import DropdownList from "@/components/Common/DropdownList.vue";
  import {dropDownMenu, editPlayListModal, fadeInFileContent, getAddFileToContextMenuItems} from "../utils/utils";
  import {namespace} from "vuex-class";
  import SelectItem from "../mixins/selectItem";
  import {File} from "../store/modules/file";
  import {PlayList, PlayListContentDataItem} from "../store/modules/playList";

  const playListModule = namespace("playList");

  @Component({
    components: {
      DropdownList
    }
  })
  export default class FileItem extends SelectItem {
    @Prop(Array) selectedItems!: Array<File>;
    @Prop(Object) item !: File;
    @Prop(Array) all !: Array<File>;
    @Prop(Boolean) isAddToRecent !: boolean;
    @playListModule.State playLists !: Array<PlayList>;
    @playListModule.State playingList !: Array<File>;

    showCover(e:Event) {
      const target = e.target as HTMLElement
      target.classList.add('show')
    }

    get isDir():boolean {
      return this.all && !!this.all.length;
    }

    get fileTotal() {
      if (!this.item.content) {
        return 0;
      }
      let total = 0;

      function calcTotal(content: Array<File>) {
        content.forEach(o => {
          if (o.content) {
            calcTotal(o.content);
          } else {
            total++;
          }
        });
      }

      calcTotal(this.item.content);
      return total;
    }

    showCreatePlayListModal() {
      editPlayListModal({isRename: false}).then(name => {
        if (this.item.content) {
          let allFile = this.getAllFileByContent(this.item.content);
          this.$store.dispatch("playList/createPlayList", {
            name, content: allFile.map(o => {
              return new PlayListContentDataItem(o.title, o.p);
            })
          });
        } else {
          // this.$store.dispatch("playList/createPlayList", {name, fileIds: [this.item.id]});
          this.$store.dispatch("playList/createPlayList", {
            name,
            content: [new PlayListContentDataItem(this.item.title, this.item.p)]
          });
        }
      });
    }

    showAddToDropDown(e: MouseEvent) {
      e.stopPropagation();
      e.preventDefault();
      let contextMenu: any = getAddFileToContextMenuItems([this.item]);

      dropDownMenu(e, contextMenu);

    }

    showDropDown(e) {
      e.preventDefault();
      e.stopPropagation();
      const contextMenu: any = [{
        label: "播放", callback: () => {
          this.play(e);
        }
      }, {
        label: "选择", callback: () => {
          this.toggleSelect(e);
        }
      }
        /*        ,{
                label: "添加到", callback: () => {
                  dropDownMenu(e,[{
                    label:'新的播放列表',callback:()=>{}
                  }])
                }
              }*/
      ];
      dropDownMenu(e, contextMenu);
    }

    private getAllFileByContent(content: Array<File>) {
      let tmp: Array<File> = [];

      function pushItem(content: Array<File>) {
        for (let i = 0; i < content.length; i++) {
          if (content[i].content) {
            pushItem(content[i].content);
          } else {
            tmp.push(content[i]);
          }
        }
      }

      pushItem(content);
      return tmp;
    }

    play(e: MouseEvent) {
      e.stopPropagation();

      if (this.item.content) {
        let allFile = this.getAllFileByContent(this.item.content);
        this.$store.dispatch("audio/play", allFile[0]);
        this.$store.commit("playList/setPlayingList", allFile);
        return;
      }

      this.$store.dispatch("audio/play", this.item);
      if (this.all && !this.item.content) {
        this.$store.commit("playList/setPlayingList", this.all);
      }

    }

    handleSelect(e: MouseEvent) {
      if (this.isSelectMode) {
        this.toggleSelect(e);
        return;
      }
      if (this.item.content) {

        const currentPath = this.$route.params["path"];
        const url = currentPath ? `/path/${currentPath}.${this.item.title}` : `/path/${this.item.title}`;
        this.$router.push(url);
        // this.$store.commit("file/setPath", this.item.title);
        fadeInFileContent();
      } else {
        this.play(e);
      }
    }
  }
</script>

<style scoped lang="scss">


  .FileItem {

    position: relative;
    padding: 7px 7px 1rem;

    $fileWidth: 170px;

    &.file {
      width: $fileWidth;
    }

    &.dir {
      /*width: 245px;*/
      /*margin: 0 15px;*/
    }

    &.selected {
      background-color: rgb(0, 90, 158);

      p, h5 {
        color: #fff !important;
      }
    }

    &:hover {

      .cover {
        box-shadow: rgba(0, 0, 0, .2) 0 20px 40px;
      }

      .operation div {
        opacity: 1;
        width: 50px;
        height: 50px;
      }
    }

    .top {
      position: relative;
      background: linear-gradient(rgba(0, 0, 0, .05), rgba(0, 0, 0, .3));
      $coverSize: 10rem;
/*      width: $coverSize;
      height: $coverSize;*/

      &.no-bg{
        background: none;
      }

      .file {
        .cover {
          transition: box-shadow .3s;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #eee;

          img {
            width: 100%;
            height: 100%;
            transition: opacity .2s;
            opacity: 0;
            &.show{
              opacity: 1;
            }
          }

          .dir-icon {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
              width: 30%;
              height: 30%;
            }
          }
        }

      }

      .dir {
        .color-wrap {
          position: relative;
          width: 100%;
          height: 152px;
          display: flex;
          justify-content: center;
          align-items: center;
          /*background-color: #4b5fff;*/
          /*background-color: rgba(255,255,255,.5);*/
          .cover {
            width: 110px;
            transition: box-shadow .3s;

            .small-block, .block {
              height: 4px;
              margin: 0 auto;
            }

            .small-block {
              width: 80%;
              background-color: rgba(0, 0, 0, .2);
            }

            .block {
              width: 90%;
              background-color: rgba(0, 0, 0, .5);
            }

            .cd {
              width: 110px;
              height: 110px;
              background-color: #eee;
              font-size: 70px;
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }

    .bottom {
      width: 10rem;
      h5 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 5px;
        margin-bottom: 0;
        font-size: 16px;

        &.bold {
          font-weight: bold;
        }
      }

      .artist {
        font-size: 12px;
        color: #555;
        margin-top: 5px;
      }

      .total {
        color: #666;
      }
    }

    .checkbox-area {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 20;
      background-color: #fff;
      border: 1px solid #ccc;

      .checkbox {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;

        &.no-select {
          border: 1px solid #fff;
        }

        &:hover {
          &.no-select {
            border: 1px solid #999;
          }
        }
      }
    }

    .operation {
      position: absolute;
      top: 0;
      bottom: 0;
      height: 80px;
      width: 100%;
      margin: auto;
      /*              display: flex;
                    align-items: center;
                    justify-content: center;*/
      .play, .add {
        border-radius: 50%;
        background-color: rgba(0, 0, 0, .8);
        color: #fff;
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 40px;
        height: 40px;
        margin: auto;
        transition: all .3s;
        top: 0;
        bottom: 0;
        opacity: 0;

        &:hover {
          height: 60px;
          width: 60px;
        }
      }

      .play {
        left: 0;
        /*right: 40%;*/
        right: 60px;
      }

      .add {
        /*left: 40%;*/
        left: 60px;
        right: 0;
      }
    }

  }


</style>