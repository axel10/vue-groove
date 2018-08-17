<template>
  <div class="SelectBottomTools">
    <ul>
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component({})
  export default class SelectBottomTools extends Vue {
  }
</script>

<style scoped lang="scss">
  .SelectBottomTools {
  }
</style>

<style lang="scss">
  .SelectBottomTools {
    /*      position: absolute;
          left: 0;
          bottom: 0;*/
    width: 100%;
    height: 70px;

    z-index: 100;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #eee;

    ul{
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      box-sizing: border-box;
      >li {
        /*.item {*/
        width: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #ccc;
        }
        >p:nth-child(1) {
          font-size: 28px;
        }
      }

    }

    .split {
      width: 1px;
      margin: 5px 10px;
      background-color: #aaa;
    }

  }
</style>