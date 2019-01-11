<template>
  <PlayListItemBase>
    <div class="PlayingListContentItem" @contextmenu="showDropDown" :class="{'playing':isPlaying,'select':selected}" @click="handleClick">
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
        this.$store.dispatch("playList/createPlayList", {name, content:new PlayListContentDataItem(this.item.title,this.item.p)});
      });
    }

  }
</script>

<style scoped lang="scss">
  .PlayingListContentItem {
    border-bottom: 1px solid rgba(255, 255, 255, .2);

    &.select{
      &:hover{
        background-color: rgb(0, 75, 133);
        color: #fff;
      }
    }
  }
</style>
