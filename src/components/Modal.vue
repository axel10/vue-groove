<template>
  <transition name="g-modal-wrap">
    <div class="CreatePlayListModal g-modal" :style="{transition:'all '+animateTime/1000+'s'}" v-show="show" ref="CreatePlayListModal">
      <transition name="g-modal-main">
        <div class="main" v-show="show">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"

  @Component({
    name: "Modal",
    props:{
      show:{
        require:true
      },
      animateTime:{
        default:200,
      }
    }
  })
  export default class Modal extends Vue {

  }
</script>

<style lang="scss">
  .g-modal-wrap-enter, .g-modal-wrap-leave-to {
    opacity: 0;
  }
  .g-modal-main-enter, .g-modal-main-leave-to {
    transform: scale(1.05, 1.05);
  }
  .g-modal {
    /*transition: all .2s;*/
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(255, 255, 255, .6);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    .main {
      transition: all .2s;
      width: 440px;
      position: absolute;
      left: 0;
      right: 0;
      /*top: 0;*/
      /*bottom: 0;*/
      margin: auto;
      border: 1px solid rgb(0, 120, 215);
      background-color: #fff;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding:3rem 2rem 3rem;
    }
  }
</style>
