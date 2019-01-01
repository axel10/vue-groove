<template>
  <transition name="home">
    <div class="home">
      <div class="top">

        <div class="mobile-top">
          <div class="fold" @click="ShowSide">
            <Icon type="ios-menu"/>
          </div>
          <div class="title">
            <h2>{{currentTitle}}</h2>
          </div>
        </div>

        <div class="side" :class="{'fold':isFold,'show':isSideShow}">
          <div class="title">
            <h2 v-if="!isFold">V player</h2>
          </div>
          <div class="fold" @click="toggleFold">
            <Icon type="ios-menu"/>
          </div>
          <ul>
            <li v-for="item in commonMenu">
              <div class="content"
                   :class="{'select':$route.name===item.name}"
                   @click="$router.push({name:item.name,params:item.params})"
              >
                            <span class="icon">
                              <Icon :type="item.icon"/>
                            </span>
                <span class="text" v-if="!isFold">{{item.title}}</span>
              </div>
            </li>

            <li class="split"></li>

            <li>
              <div class="content"
                   @click="$router.push('/allPlayList')"
                   :class="{'select':$route.name==='allPlayList'}"
              >
                <span class="icon">
                   <Icon type="ios-list"/>
                </span>
                <span class="text" v-if="!isFold">播放列表</span>

              </div>
              <span class="icon add" @click="showCreatePlayListModal">
                   <Icon type="ios-add"/>
              </span>
            </li>

            <li v-for="item in  playLists"
                @contextmenu="showPlayListMenu($event,item)">
              <div class="content"
                   :class="{'select':$route.params['id']===item.id}"
                   @click="toPlayList(item)">
                <span class="icon">
                  <Icon type="ios-disc-outline"/>
                </span>
                <span class="text" v-if="!isFold">{{item.title}}</span>
              </div>
            </li>

            <li v-if="isFold" @click="showCreatePlayListModal">
              <div class="content">
                <span class="icon">
                   <Icon type="ios-add"/>
                </span>
              </div>
            </li>
          </ul>
          <div class="github">
            <div class="content"
                 @click="toGithub">
                <span class="icon">
                  <Icon type="logo-github"/>
                </span>
              <span class="text" v-if="!isFold">Github</span>
            </div>
          </div>
        </div>

        <div class="right" id="router-content">
          <router-view/>
        </div>

      </div>

      <div class="bottom">
        <HomeBottom v-if="!isHideBottom"/>
      </div>

    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import Files from "@/views/Files.vue";
  import HomeBottom from "../components/HomeBottom.vue";
  import {PlayList} from "../store/modules/playList";
  import {dropDownMenu, editPlayListModal, isInSelf} from "../utils/utils";
  import {confirm} from "@/utils/utils";

  const homeModule = namespace("home");
  const audioModule = namespace("audio");
  const playListModule = namespace("playList");

  @Component({
    components: {
      HomeBottom,
      Files
    },
  })
  export default class Home extends Vue {
    @homeModule.State isHideBottom!: boolean;
    @homeModule.State currentTitle!: string;
    @audioModule.State playing!: boolean;
    @playListModule.State playLists!: Array<PlayList>;

    commonMenu = [
      {icon: "ios-musical-notes-outline", title: "我的音乐", name: "file"},
      {icon: "ios-time-outline", title: "最近播放的内容", name: "recentPlay"},
      {icon: "ios-pulse-outline", title: "正在播放", name: "playing", params: {light: "dark"}},
    ];

    @Watch('$route')
    onRouteChanged(){
      this.isSideShow = false
    }

    get position() {
      const route = this.$route;
      if (route.params["id"]) {
        return route.params["id"];
      }
      return "";
    }

    isSideShow: boolean = false;
    isFold: boolean = false;

    toggleFold() {
      if (this.isSideShow) {
        this.isSideShow = false;
        document.body.removeEventListener('click',this.hideMobileSide)
        return;
      }
      this.isFold = !this.isFold;
    }

    hideMobileSide(e:MouseEvent){
      e.stopPropagation()
      document.body.removeEventListener('click',this.hideMobileSide)
      if(!isInSelf(e.target as HTMLElement,'side')){
        this.isSideShow = false;
      }
    }

    ShowSide(e:MouseEvent) {
      e.stopPropagation()
      document.body.addEventListener('click',this.hideMobileSide)
      this.isSideShow = true;
      // this.isSideShow = !this.isSideShow;
    }

    showCreatePlayListModal() {
      editPlayListModal().then((name: any) => {
        this.$store.dispatch("playList/createPlayList", {name, content: []});
      });
    }

    toPlayList(item: PlayList) {
      this.$router.push("/playList/" + item.id);
    }

    showPlayListMenu(e: MouseEvent, item: PlayList) {
      e.preventDefault();
      const contextMenu: any = [
        {
          label: "播放", callback: () => {
            this.$store.dispatch("playList/playPlayList", item.id);
          }
        },
        {
          label: "重命名", callback: () => {
            editPlayListModal({isRename: true, oldName: item.title}).then(name => {
              this.$store.dispatch("playList/renamePlayList", {name, id: item.id});
            });
          }
        },
        {
          label: "删除", callback: () => {
            confirm({title: "确定要删除吗?", info: "该播放列表下的所有条目都将被删除"}).then(() => {
              this.$store.dispatch("playList/removePlayList", {id: item.id, context: this});
            });
          }
        }
      ];
      dropDownMenu(e, contextMenu);
    }

     toGithub() {
      window.open("https://github.com/axel10/Groove_online", "_blank");
    }
  }
</script>

<style scoped lang="scss">
  .mobile-top {
    display: none;
  }

  .home-enter-active, .home-leave-active {
    transition: opacity .6s;
  }

  .home-enter, .home-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  .home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top {
      display: flex;
      flex: 1;
      min-height: 0;
      .side {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: rgba(255, 255, 255, .7);
        width: 300px;
        box-sizing: border-box;
        overflow: auto;
        &.fold {
          width: 50px;
        }

        .title {
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          flex-shrink: 0;

          h2 {
            margin: 0;
            font-size: 13px;
            font-weight: lighter;
            color: #333;
          }
        }
        .fold {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;

          &:hover {
            background-color: rgba(255, 255, 255, .5);
          }
        }
        .content {
          flex: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;

          .icon {
            color: #000;
            font-size: 20px;
            font-weight: 700;
            height: 50px;
            width: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          &:hover {
            background-color: rgba(255, 255, 255, .5);
          }
          &.select {
            &:before {
              content: ' ';
              position: absolute;
              width: 5px;
              height: 100%;
              background-color: rgb(0, 90, 158);
              left: 0;
              top: 0;
            }
          }
        }

        .github {
          margin-top: auto;
          height: 50px;
          width: 100%;
          font-size: 16px;
        }

        ul {
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          li {
            a {
              color: #000;
              display: block;
              width: 100%;
            }
            .add {
              color: #000;
              font-size: 20px;
              font-weight: 700;
              height: 50px;
              width: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: auto;
              &:hover {
                background-color: rgba(255, 255, 255, .5);
              }
            }

            &.split {
              height: 1px;
              background-color: #aaa;
              opacity: .8;
              width: 80%;
              margin: 0 auto;
            }
            box-sizing: border-box;
            font-size: 16px;
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
          }
        }
      }
      .right {
        flex: 1;
        overflow-y: auto;
        background-color: #fff;
      }
      .main {
        display: flex;
        flex: 1;
        background-color: #fff;
      }
    }
    .bottom{
      height: 100px;

    }

  }
</style>
