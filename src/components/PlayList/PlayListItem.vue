<!--播放列表管理 列表item-->
<template>
  <div class="PlayListItem" @contextmenu="showContextMenu" :class="{'selected':selected}"  @click="handleSelect">

    <div class="checkbox-area" v-if="isSelectMode">
      <div class="checkbox" :class="{'no-select':!selected}">
        <Icon type="ios-checkmark" v-if="selected"/>
      </div>
    </div>

    <div class="color-wrap" ref="colorWrap">
      <div class="operation">
        <div class="play" @click="playAll">
          <Icon type="ios-play-outline"/>
        </div>
      </div>

      <div class="cover">
        <div class="small-block"></div>
        <div class="block"></div>
        <div class="cd">
          <!--<img :src="item.imgUrl" alt="" v-if="item.imgUrl" ref="cover">-->
          <!--<Icon type="ios-list" v-if="!item.imgUrl"/>-->
          <Icon type="ios-list" />

        </div>
      </div>
    </div>
    <h5 class="title">{{item.title}}</h5>
    <p class="total">{{item.total}}首歌曲</p>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import {confirm, dropDownMenu, editPlayListModal} from "../../utils/utils";
  import {PlayList} from "../../store/modules/playList";
  import {File} from "../../store/modules/file";
  import SelectItem from '../../mixins/selectItem';

  const fileModule = namespace("file");

  @Component({})
  export default class PlayListItem extends SelectItem {
    @Prop(Object) item!: PlayList;
    @Prop(Array) selectedItems!: Array<PlayList>;
    @fileModule.State allFile!: Array<File>;

    remove() {
      const that = this;
      confirm({title: "确定要删除吗?", info: "该播放列表下的所有条目都将被删除"}).then(() => {
        that.$store.commit("playList/removePlayList", this.item.id);
      });
    }

    showRenameModal() {
      // this.renamePlayListModalShow = true
      editPlayListModal({isRename: true, oldName: this.item.title}).then(name => {
        this.$store.commit("playList/renamePlayList", {id: this.item.id, name});
      });
    }

    playAll(e: MouseEvent) {
      e.stopPropagation();
      if (this.item.content.length === 0) {
        this.$Message.info("这个播放列表还没有任何歌曲:(");
        return;
      }
      const ids = this.item.content;
      const files = ids.map(o => {
        return this.allFile.find((file: File) => file.title === o.title && file.p === o.p );
      });

      this.$store.commit("playList/setPlayingList", files);
      this.$store.dispatch("audio/play", files[0]);
    }

    showContextMenu(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      const contextMenu: any = [{
        label: "播放", callback: () => {
          this.playAll(e);
        }
      }, {
        label: "重命名", callback: this.showRenameModal
      }, {
        label: "删除", callback: this.remove
      }, {
        label: "选择", callback: () => {
          this.toggleSelect(e);
        }
      }];
      dropDownMenu(e, contextMenu);
    }

    handleSelect(e: MouseEvent) {

      if (this.isSelectMode) {
        this.toggleSelect(e);
        return;
      }
      this.$router.push('/playList/'+this.item.id)
    }
  }
</script>

<style scoped lang="scss">
  .PlayListItem {
    width: 245px;
    height: 100%;
    padding: 7px 7px 30px;

    position: relative;

    &.selected {
      background-color: rgb(0, 90, 158);
      p, h5 {
        color: #fff;
      }
    }
    .color-wrap {
      background: linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.3));

      position: relative;
      &:hover .operation div {
        opacity: 1;
        width: 50px;
        height: 50px;
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
        .play {
          border-radius: 50%;
          /*background-color: rgba(0, 0, 0, .7);*/
          background-color: rgba(0, 0, 0, .7);
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
          right: 0;
        }
      }

      width: 100%;
      height: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      /*background-color: #4b5fff;*/
      /*background-color: rgba(255,255,255,.5);*/
      .cover {
        width: 110px;
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
    .total {
      color: #666;
    }
    h5 {
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: 5px;
      margin-bottom: 0;
      font-size: 16px;
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

  }


</style>
