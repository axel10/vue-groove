<template>
  <div class="PlayLists">
    <div class="title">
      <div class="main-title">
        <h4>播放列表</h4>
      </div>
      <div class="tools">
        <span class="new-list" @click="showCreatePlayListModal">
          <Icon style="font-size: 24px;margin-right: 10px" type="ios-add"/>
          新的播放列表
        </span>
      </div>

      <div class="content">
        <ul>
          <li v-for="(item,i) in distAllPlayList">
            <PlayListItem
                    :item="item"
                    :selectedItems="selectedItems"
                    @select="val=>selectedItems = val"
            ></PlayListItem>
          </li>
        </ul>
      </div>
    </div>


    <SelectBottomTools v-if="isSelectMode">
      <li @click="cancelSelect">
        <p>
          <Icon type="ios-list-box-outline"/>
        </p>
        <p>取消</p>
      </li>
      <li @click="playAll">
        <p>
          <!--<Icon type="ios-list-box-outline"/>-->
          <Icon type="ios-play-outline" />
        </p>
        <p>播放全部</p>
      </li>
      <li @click="removeItems">
        <p>
          <Icon type="ios-trash-outline"/>
        </p>
        <p>删除</p>
      </li>
      <li @click="selectAll">
        <p>
          <Icon type="ios-checkmark-circle-outline"/>
        </p>
        <p>全选</p>
      </li>
    </SelectBottomTools>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import PlayListItem from "../components/PlayList/PlayListItem.vue";
  import {editPlayListModal, confirm, mapIdsToFiles} from "../utils/utils";
  import SelectBottomTools from "../components/Operation/SelectBottomTools.vue";
  import {PlayList} from '../store/modules/playList';
  import {File} from "../store/modules/file";


  const playListModule = namespace("playList");
  const fileModule = namespace("file");

  @Component({
    components: {SelectBottomTools, PlayListItem}
  })
  export default class PlayLists extends Vue {
    @playListModule.State playLists!:Array<PlayList>;
    @fileModule.State allFile!:Array<File>;

    @Watch("selectedItems")
    onSelectedItemsChanged(val:Array<PlayList>) {
      if (val.length > 0) {
        this.$store.commit("home/setIsHideBottom", true);
      } else {
        this.$store.commit("home/setIsHideBottom", false);
      }
    }

    get distAllPlayList() {
      return this.playLists.map(o => {
        const firstFileId = o.content[0];
        if (!firstFileId) {
          return {...o,imgUrl:'',total:0}
        }
        let firstFile!:File
        if (firstFileId) {
          firstFile = this.allFile.find(file => file.id === firstFileId)||new File()
        }
        // const firstFile!:File = firstFileId === undefined ? new File() : this.allFile.find(file => file.id === firstFileId);
        const imgUrl = firstFile.imgUrl ? firstFile.imgUrl : "";
        return {...o, imgUrl, total: o.content.length};
      });
    }

    get isSelectMode() {
      return this.selectedItems.length > 0;
    }

    selectedItems:Array<PlayList> = [];

    showCreatePlayListModal() {
      editPlayListModal().then(name => {
        this.$store.dispatch("playList/createPlayList", {name, fileIds: []});
      });
    }

    cancelSelect() {
      this.selectedItems = [];
    }

    selectAll() {
      this.selectedItems = this.playLists;
    }

    removeItems() {
      confirm({title: "确定要删除这些播放列表？", info: "播放列表下的所有歌曲都将被删除"}).then(() => {
        this.$store.dispatch("playList/removePlayLists", this.selectedItems.map(o => o.id));
        this.cancelSelect()
      });
    }

    playAll() {
      const fileIds = this.selectedItems.reduce((res:Array<number>, item:PlayList) => {
        return res.concat(item.content);
      }, []);
      console.log(fileIds);
      const files = mapIdsToFiles(fileIds)
      this.$store.dispatch('audio/play',files[0])
      this.$store.dispatch("playList/addToPlayingList",files);
      this.cancelSelect()
    }
  }
</script>

<style scoped lang="scss">
  .PlayLists {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    box-sizing: border-box;
    padding-left: 18px;
    padding-top: 40px;
    .title {
      text-align: left;
      .main-title {
        display: flex;
        align-items: flex-end;
        h4 {
          font-size: 34px;
          font-weight: lighter;
          display: inline-block;
        }
        .new-list {
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          margin-bottom: 5px;
          margin-left: 10px;
          &:hover {
            color: #666;
          }
        }
      }
      .tools {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
      }
    }

    .content {
      flex: 1;
      overflow: auto;
      ul {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        li {
          box-sizing: border-box;
          text-align: left;
          margin-bottom: 25px;
          display: inline-block;
          margin-right: 20px;

        }
      }
    }
  }
</style>