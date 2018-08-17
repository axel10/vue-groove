<template>
  <transition name="wrap">
    <div class="Confirm" v-show="show">
      <transition name="main">
        <div class="dialog" v-show="show">
          <p class="title">{{title}}</p>
          <p class="info">{{info}}</p>
          <div class="footer">
            <div @click="cb">确定{{text}}</div>
            <div @click="cancel">取消</div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {State, Mutation, Action} from "vuex-class";

  @Component({
    /*    props:{
          cb:Function,
          cancel:Function,
          title:String,
          info:String
        }*/
  })
  export default class Confirm extends Vue {
    @Prop() cb !: any;
    @Prop() cancel !: any;
    @Prop() title !: string;
    @Prop() info !: string;

    public mounted() {
    }

    text: string = "";
    show: boolean = false;
  }
</script>

<style scoped lang="scss">

  .wrap-enter, .wrap-leave-to {
    opacity: 0;
  }

  .main-enter, .main-leave-to {
    transform: scale(1.05, 1.05);
  }

  .Confirm {
    transition: opacity .2s;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(255, 255, 255, .6);
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;

    .dialog {
      font-size: 16px;
      width: 400px;
      transition: transform .2s;
      border: 1px solid rgb(0, 120, 215);
      background-color: #fff;
      padding: 15px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .footer {
        margin-top: 40px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        div {
          width: 48%;
          background-color: #ccc;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid rgba(0, 0, 0, 0);

          &:hover {
            border: 2px solid #666;
          }
        }
      }
    }

  }
</style>