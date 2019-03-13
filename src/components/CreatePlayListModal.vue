<template>
  <Modal :show="show">
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
      <!--      <div class="create-btn vp-btn" @click="ok">
              {{isRename?'重命名':'创建播放列表'}}
            </div>-->
      <VPButton @click="ok" class="create-btn">
        {{isRename?'重命名':'创建播放列表'}}
      </VPButton>
      <div class="cancel" @click="onCancel">
        取消
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator"
  import {namespace} from "vuex-class"
  import {PlayList} from "@/store/types/PlayList"
  import Modal from "@/components/Modal.vue"

  const playListModule = namespace("playList")
  @Component({
    components: {
      Modal
    },
    props: {
      animateTime: {
        type: Number,
        default: 200
      }
    }
  })
  export default class CreatePlayListModal extends Vue {
    @Prop(Boolean) isRename!: boolean
    @Prop(Function) onCancel!: any
    @Prop(Function) onOk!: any
    @Prop(String) oldName!: string


    @playListModule.State playLists!: Array<PlayList>

    @Watch("listName")
    onListNameChanged() {
      this.isRepeat = false
    }

    show = false
    listName = this.oldName ? this.oldName : ""

    isRepeat = false

    ok() {
      if (this.isRename && this.playLists.find(o => o.title === this.listName)) {
        this.isRepeat = true
        return
      }
      this.onOk(this.listName)
    }
  }
</script>

<style scoped lang="scss">


  .CreatePlayListModal {
    .icon {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      /*padding-top: 50px;*/
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
      margin-top: 3rem;

      .create-btn {
        padding: .3rem 4rem;
      }


      .cancel {
        color: rgb(0, 90, 158);
        margin-top: .5rem;
        font-size: .8rem;
      }

    }
  }

</style>
