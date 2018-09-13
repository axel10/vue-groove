<template>
  <PlayListItemBase>
    <div class="PlayListContentItem" @contextmenu="showDropDown" :class="{'playing':isPlaying,'select':selected}"
         @click="handleClick">
      <div class="checkbox-area" v-if="isSelectMode">
        <div class="checkbox" :class="{'no-select':!selected}" @click="toggleSelect">
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
      <div class="album">{{item.cd_title}}</div>
      <div class="time">{{item.time}}</div>
    </div>
  </PlayListItemBase>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";
  import {dropDownMenu, editPlayListModal} from "../utils/utils";

  import {File} from "../store/modules/file";
  import {PlayList} from "../store/modules/playList";
  import PlayListItemBase from "./PlayListItemBase.vue";

  const homeModule = namespace("home");
  const playingModule = namespace("playing");
  const playListModule = namespace("playList");

  @Component({
    components: {PlayListItemBase}
  })
  export default class PlayListContentItem extends Vue {

    @Prop(Object) item !: File;
    @Prop(Number) index !: number;
    @Prop(Array) selectedItems !: Array<File>;
    @homeModule.State playingFile !: File;
    @playingModule.Mutation toSelectMode !: any;
    @playListModule.State playLists !: Array<PlayList>;


    get isSelectMode() {
      return this.selectedItems.length > 0;
    }

    get isPlaying() {
      return this.playingFile.title === this.item.title;
    }

    get selected() {
      return this.selectedItems.findIndex(o => o.id === this.item.id) !== -1;
    }

    handleClick(e: MouseEvent) {
      if (this.isSelectMode) {
        this.toggleSelect(e);
      } else {
        this.play();
      }
    }

    toggleSelect(e: MouseEvent) {
      e.stopPropagation();
      if (this.selected) {
        this.$emit("select", this.selectedItems.filter(o => o.id !== this.item.id));
      } else {
        this.$emit("select", this.selectedItems.concat([this.item]));
      }
    }

    showDropDown(e: MouseEvent) {
      e.preventDefault();

      const contextMenu: any = [{
        label: "选择", callback: () => {
          this.$emit("select", this.selectedItems.concat([this.item]));
        }
      }];


      dropDownMenu(e, contextMenu);
    }

    showAddListMenu(e: MouseEvent) {
      e.stopPropagation();
      const contextMenu: any = [];

      contextMenu.push({
        label: "正在播放",
        callback: this.$store.dispatch("playList/addToPlayingList", this.item)
      });
      contextMenu.push({split: true});

      contextMenu.push({label: "新的播放列表", callback: this.showCreatePlayListModal});

      if (this.playLists.length > 0) {
        this.playLists.forEach(o => {
          contextMenu.push({
            label: o.title,
            callback: () => this.$store.dispatch("playList/addToPlayList", {
              listId: o.id,
              ids: [this.item.id]
            })
          });
        });
      }
      dropDownMenu(e, contextMenu);
    }

    play() {
      this.$store.dispatch("audio/play", this.item);
    }

    showCreatePlayListModal() {
      editPlayListModal({isRename: false}).then(name => {
        this.$store.dispatch("playList/createPlayList", {name, fileIds: [this.item.id]});
      });
    }

  }
</script>

<style scoped lang="scss">
  .PlayListContentItem {
    color: #000;
    border-bottom: 1px solid rgba(255, 255, 255, .2);

    &.select {
      color: #fff;
      .checkbox-area{
        .checkbox{
          border: 1px solid #fff;
        }
      }
    }
    .checkbox-area {
      .checkbox{
        border: 1px solid #000;
      }
    }

    &:hover{
      color: #000;
      background-color: #ddd!important;
    }


  }


</style>