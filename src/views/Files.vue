<template>
  <div class="Files">
    <div class="title">
      <div class="main-title">
        <h4>{{title}}</h4>
      </div>
      <div class="tools">
        <span class="new-list" @click="$store.dispatch('file/randomPlayAll')">
          <Icon style="font-size: 24px;margin-right: 10px" type="ios-shuffle"/>
          随机播放所有音乐
        </span>
        <span style="margin-left: 20px" @click="toPrev">
          返回上一级
        </span>
      </div>
    </div>
    <div class="content fade-in">
      <ul>
        <li v-for="(item) in currentFiles">
          <FileItem
                  :is-add-to-recent="true"
                  :item="item"
                  :selectedItems="selectedItems"
                  @select="val=>selectedItems = val"
                  :all="currentFiles">
          </FileItem>

        </li>
      </ul>
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
          <Icon type="ios-play-outline"/>
        </p>
        <p>播放全部</p>
      </li>
      <li @click="showAddToPlayListMenu">
        <p>
          <!--<Icon type="ios-list-box-outline"/>-->
          <Icon type="ios-add"/>
        </p>
        <p>添加到</p>
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
  import {Component, Watch} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import {File} from "../store/modules/file";
  import FileItem from "../components/FileItem.vue";
  import {
    dropDownMenu,
    fadeInFileContent,
    getAddFileToContextMenuItems,
    playAllSelectFile
  } from "../utils/utils";
  import SelectBottomTools from "../components/Operation/SelectBottomTools.vue";
  import SelectContainer from "../mixins/selectContainer";

  const fileModule = namespace("file");

  @Component({
    components: {SelectBottomTools, FileItem}
  })
  export default class Files extends SelectContainer {
    @fileModule.State("files") files!: Array<File>;
    @fileModule.State path!: Array<string>;
    @fileModule.Getter currentFiles!: Array<File>;

    selectedItems: Array<File> = [];
    title: string = "浏览作品";

    public created() {
      // this.init();
      this.$store.dispatch("file/init");
      this.$store.commit("home/setCurrentTitle", this.title);

      if (this.$route.params["path"]) {
        this.$store.commit('file/setPath',this.$route.params["path"].split('.'))
      }
    }

    @Watch('$route')
    onRouteChanged(){
      const pathStr = this.$route.params['path']
      const paths = pathStr?pathStr.split('.'):[]
      this.$store.commit('file/setPath',paths)
      fadeInFileContent();
    }

    get isSelectMode() {
      return this.selectedItems.length > 0;
    }

    toPrev() {
      if (this.path.length === 0) {
        this.$Message.info("已经是根目录了");
        return;
      }

      // this.$store.commit("file/toPrev");
      fadeInFileContent();

      const pathArr = this.$route.params['path'].split('.')
      pathArr.pop()
      this.$router.push(pathArr.length?`/path/${pathArr.join('.')}`:'/')
    }

    playAll() {
      playAllSelectFile(this);
    }

    selectAll() {
      this.selectedItems = this.currentFiles;
    }

    cancelSelect() {
      this.selectedItems = [];
    }

    showAddToPlayListMenu(e: MouseEvent) {
      const contextMenu = getAddFileToContextMenuItems(this.selectedItems, this);
      dropDownMenu(e, contextMenu);
    }
  }
</script>

<style scoped lang="scss">
  .Files {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
    box-sizing: border-box;
    padding: 40px 20px 0;
    min-height: 0;
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
        .new-list, .paths {
          font-size: 12px;
          display: inline-flex;
          align-items: center;
          &:hover {
            color: #666;
          }
        }
        .paths {
          color: #333;
          margin-left: 5px;
          margin-top: 10px;
          margin-bottom: 10px;
          vertical-align: center;
          .path-item {
            margin-right: 10px;
            font-size: 14px;
          }
          .split {
            margin-right: 10px;
            color: #999;
          }
        }
      }
    }
    .content {
      flex: 1;
      /*overflow: auto;*/
      min-height: 0;
      width: 100%;
      &.fade-in {
        /*animation: fadeIn .5s forwards ease-out;*/
        animation: fadeIn .5s forwards cubic-bezier(0, 1, 0, 1);
      }
      ul {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        li {
          text-align: left;
          margin-bottom: 10px;
          display: inline-block;
          margin-right: 8px;
        }
      }
    }

  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(200px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
</style>


<!--                  <Dropdown trigger="hover" placement="right" style="text-align: center;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;">
                    <div>
                      <Icon type="ios-add"/>
                    </div>
                    <DropdownMenu slot="list" style="text-align: left;overflow: hidden;">
                      <DropdownItem style="margin-right: 0;width: 100%;">驴打滚</DropdownItem>
                      <DropdownItem style="margin-right: 0;width: 100%;">炸酱面</DropdownItem>
                      <DropdownItem style="margin-right: 0;width: 100%;">豆汁儿</DropdownItem>
                      <DropdownItem style="margin-right: 0;width: 100%;">冰糖葫芦</DropdownItem>
                      <DropdownItem style="margin-right: 0;width: 100%;">北京烤鸭</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>-->