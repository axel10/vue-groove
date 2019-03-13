<template>
  <div class="RecentPlay">
    <div class="title">
      <div class="main-title">
        <h4>{{title}}</h4>
      </div>
      <div class="tools">
        <span class="new-list" @click="$store.dispatch('file/randomPlayAll')">
          <Icon style="font-size: 24px;margin-right: 10px" type="ios-shuffle"/>
          随机播放所有音乐
        </span>
      </div>
    </div>
    <div class="content">
      <ul>
        <li v-for="(item,i) in recentPlay">
          <FileItem :item="item"
                    :selectedItems="selectedItems"
                    @select="val=>selectedItems = val"
          >
          </FileItem>
        </li>
      </ul>
    </div>

    <SelectBottomTools v-if="isSelectMode">
      <li @click="()=>{this.cancelSelect()}">
        <p>
          <Icon type="ios-list-box-outline"/>
        </p>
        <p>取消</p>
      </li>
      <li class="split"></li>
      <li @click="playAll">
        <p>
          <!--<Icon type="ios-list-box-outline"/>-->
          <Icon type="ios-play-outline"/>
        </p>
        <p>播放全部</p>
      </li>
      <li @click="remove">
        <p>
          <!--<Icon type="ios-list-box-outline"/>-->
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
  import {Component, Vue} from "vue-property-decorator"
  import {State, Mutation, Action, namespace} from "vuex-class"
  import FileItem from "@/components/FileItem.vue"
  import {File} from "../store/modules/file"
  import SelectBottomTools from "../components/Operation/SelectBottomTools.vue"
  import SelectContainer from "../mixins/selectContainer"
  import {RootState} from "@/store"
  import {getFileId, getInvalidFile} from "@/utils/utils"

  const playListModule = namespace("playList")

  @Component({
    components: {
      SelectBottomTools,
      FileItem
    }
  })
  export default class RecentPlay extends SelectContainer {
    @playListModule.State recentPlay !: Array<File>

    selectedItems: Array<File> = []
    title: string = "最近播放的内容"

    public created() {
      this.$store.commit("home/isInRecentPlay", true)
      this.$store.commit("home/setCurrentTitle", this.title)
      // this.$store.commit({type:'playList/checkRecentPlayValid'})
      // const rootState: RootState = this.$store.state
      // const allFile = rootState.file.allFile
      // 检查并删除无效文件
      const errorFile = getInvalidFile(this.recentPlay) /*this.recentPlay.filter(o => !allFile.some(file => file.id === getFileId(o.p, o.title, o.album)))*/
      this.$store.commit("playList/removeRecentPlay", errorFile.map(o => o.id))
    }

    public destroyed() {
      this.$store.commit("home/isInRecentPlay", false)
    }

    playAll() {
      this.$store.dispatch("audio/play", this.selectedItems[0])
      this.$store.commit("playList/addToPlayingList", this.selectedItems)
      this.cancelSelect()

    }

    remove() {
      this.$store.commit("playList/removeRecentPlay", this.selectedItems.map(o => o.id))
      this.cancelSelect()
    }

    selectAll() {
      this.selectedItems = this.recentPlay
    }

  }
</script>

<!--
<style scoped lang="scss">
  .RecentPlay {
    background-color: #fff;
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
      overflow: auto;
      ul {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        li {
          text-align: left;
          margin-bottom: 45px;
          display: inline-block;
          margin-right: 20px;
        }
      }
    }
  }
</style>-->
