<template>
  <transition name="wrap">
    <div class="CreatePlayListModal" v-show="show" ref="CreatePlayListModal">
      <transition name="main">
        <div class="main" v-show="show">
          <div class="icon">
            <div class="color">
              <Icon type="ios-list"/>
            </div>
          </div>
          <div class="input">
            <div class="wrap">
              <input type="text" v-model="listName" placeholder="命名此播放列表">
              <span><Icon type="ios-create-outline"/></span>
            </div>
            <p class="tip" v-if="!isRename">您创建的</p>
            <p class="tip" v-if="isRename&&isRepeat">该播放列表已存在</p>

          </div>
          <div class="footer">
            <div class="create-btn" @click="handleOk">
              {{isRename?'重命名':'创建播放列表'}}
            </div>
            <div class="cancel" @click="cancel">
              取消
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import {PlayList} from "../store/modules/playList";

  const playListModule = namespace("playList");
  @Component({
  })
  export default class CreatePlayListModal extends Vue {
    @Prop(Boolean) isRename!:boolean
    @Prop(Function) cancel!:any
    @Prop(Function) cb!:any
    @Prop(String) oldName!:string


    @playListModule.State playLists!:Array<PlayList>

    @Watch("listName")
    onListNameChanged() {
      this.isRepeat = false;
    }

    show = false;
    listName = this.oldName ? this.oldName : "";

    isRepeat = false;

    handleOk() {

      if (this.isRename && this.playLists.find(o => o.title === this.listName)) {
        this.isRepeat = true;
        return;
      }
      this.cb(this.listName);
    }
  }
</script>

<style scoped lang="scss">

  .wrap-enter, .wrap-leave-to {
    opacity: 0;
  }

  .main-enter, .main-leave-to {
    transform: scale(1.05,1.05);
  }

  .CreatePlayListModal {
    transition: all .2s;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(255, 255, 255, .6);

    z-index: 1000;
    .main {
      transition: all .2s;
      width: 440px;
      height: 480px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      border: 1px solid rgb(0, 120, 215);
      background-color: #fff;
      display: flex;
      flex-direction: column;

      .icon {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-top: 50px;
        box-sizing: border-box;
        .color {
          width: 150px;
          height: 150px;
          /*background: linear-gradient(rgb(0, 132, 238), rgb(0, 106, 189));*/
          background: linear-gradient(rgb(0, 106, 189), rgb(0, 132, 238));
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 60px;
          color: #fff;
          border-radius: 5px;
        }
      }
      .input {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 20px;
        .wrap {
          background-color: #eee;
          display: flex;
          align-items: center;
          height: 50px;
          width: 80%;

          input {
            height: 90%;
            box-sizing: border-box;
            padding-left: 15px;
            flex: 1;
            background: transparent;
            border: 0;
            outline: none;
            font-size: 20px;
          }
          span {
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 26px;
          }
        }
        .tip {
          font-size: 16px;
          text-align: center;
          margin: 10px;
        }
      }
      .footer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: auto;
        margin-bottom: 30px;
        .create-btn, .cancel {
          width: 60%;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
        }
        .create-btn {
          background-color: rgb(0, 90, 158);
          color: #fff;

        }
        .cancel {
          color: rgb(0, 90, 158);

        }

      }
    }

  }
</style>