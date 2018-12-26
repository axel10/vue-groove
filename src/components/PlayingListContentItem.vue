<template>
  <PlayListItemBase>
    <div class="PlayListContentItem" @contextmenu="showDropDown" :class="{'playing':isPlaying,'select':selected}" @click="handleClick">
      <div class="checkbox-area" v-if="isSelectMode">
        <div class="checkbox" :class="{'no-select':!selected}" @click="()=>{this.toggleSelect()}">
          <Icon type="ios-checkmark" v-if="selected"/>
        </div>
      </div>
      <div class="title">
        <Icon type="ios-musical-note-outline" v-if="isPlaying"/>
        {{item.title}}
      </div>
      <div class="operation" v-if="!isSelectMode">
        <div class="play">
          <Icon type="ios-play-outline"/>
        </div>
        <div class="add" @click="showAddListMenu">
          <Icon type="ios-add"/>
        </div>
        <!--      <div class="remove" @click="$emit('remove',item)" v-if="!isShowAdd">
                <Icon type="ios-remove"/>
              </div>-->
      </div>
      <div class="artist">{{item.p}}</div>
      <div class="album">{{item.cdTitle}}</div>
      <div class="time">{{item.time}}</div>
    </div>
  </PlayListItemBase>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";
  import {dropDownMenu, editPlayListModal, getAddFileToContextMenuItems} from "../utils/utils";
  import {File} from "../store/modules/file";
  import {PlayList, PlayListContentDataItem} from "../store/modules/playList";
  import SelectItem from '../mixins/selectItem';
  import PlayListItemBase from './PlayListItemBase.vue';

  const homeModule = namespace("home");
  const playingModule = namespace("playing");
  const playListModule = namespace("playList");


  @Component({
    components: {PlayListItemBase}
  })
  export default class PlayingListContentItem extends SelectItem {
    @homeModule.State playingFile!: File;
    @playingModule.Mutation removeSelectedFile !: any;
    @playingModule.Mutation addSelectedFile !: any;
    @playListModule.State playLists !: Array<PlayList>;
    @Prop(Object) item  !: File;
    @Prop(Array) selectedItems  !: Array<File>;

    // @Prop(Number) index  !: number;


    get isPlaying() {
      return this.playingFile.title === this.item.title;
    }

    get isSelectMode() {
      return this.selectedItems.length > 0;
    }

/*    toggleSelect(e: MouseEvent) {
      e.stopPropagation();
      if (this.selected) {
        this.$emit("select", this.selectedItems.filter(o => o.id !== this.item.id));
      } else {
        this.$emit("select", this.selectedItems.concat([this.item]));
      }
    }*/

    showDropDown(e: MouseEvent) {
      e.preventDefault();
      const contextMenu: any = [{
        label: "选择",
        callback: () => {
          this.$emit("select", this.selectedItems.concat([this.item]));
        }
      }, {
        label: "移除",
        callback: () => {
          this.$store.dispatch('playList/removePlayingList',[this.item.id])

        }
      }];
      dropDownMenu(e, contextMenu);
    }

    showAddListMenu(e: MouseEvent) {
      e.stopPropagation();
/*      const contextMenu: any = [{label: "新的播放列表", callback: this.showCreatePlayListModal}];
      if (this.playLists.length > 0) {
        contextMenu.push({split: true});
        this.playLists.forEach(o => {
          contextMenu.push({
            label: o.title,
            callback: () => this.$store.dispatch("playList/addToPlayList", {listId: o.id, ids: [this.item.id]})
          });
        });
      }*/
      let contextMenu:any = getAddFileToContextMenuItems(this.selectedItems)
      dropDownMenu(e, contextMenu);
    }

    handleClick(e:MouseEvent){
      if(this.isSelectMode){
        this.toggleSelect(e)
      }else {
        this.$store.dispatch("audio/play", this.item);
      }
    }

    showCreatePlayListModal() {
      editPlayListModal({isRename: false}).then(name => {
        // this.$store.dispatch("playList/createPlayList", {name, fileIds: [this.item.id]});
        this.$store.dispatch("playList/createPlayList", {name, content:new PlayListContentDataItem(this.item.title,this.item.p)});
      });
    }

  }
</script>

<style scoped lang="scss">
  .PlayListContentItem {
/*    outline: none;
    display: flex;
    align-items: center;
    height: 50px;
    font-size: 14px;
    text-align: left;
    color: #ccc;
    box-sizing: border-box;
    padding-left: 20px;

    &:hover {
      color: #fff;
      background-color: rgba(255,255,255,.1);
      & > .operation {
        opacity: 1;
      }
    }

    &.playing {
      color: #4cbafa;
      &:hover {
        color: #3591e2;
      }
    }

    &.select{
      background-color: rgb(0,90,158);
    }

    .operation {
      width: 100px;
      height: 100%;
      display: flex;
      opacity: 0;
      transition: opacity .3s;
      margin-right: 20px;

      .play, .add, .remove {
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
        &:hover {
          background-color: rgba(255, 255, 255, .2);
        }
      }
    }

    .checkboxArea {
      width: 50px;
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

    .title {
      font-weight: normal;
      flex: 4;
      box-sizing: border-box;
      padding-left: 10px;
    }
    .artist {
      flex: 3;
    }
    .album {
      flex: 3;
    }
    .year {
      flex: 1;
    }
    .time {
      width: 60px;
    }*/
    border-bottom: 1px solid rgba(255, 255, 255, .2);

  }
</style>
