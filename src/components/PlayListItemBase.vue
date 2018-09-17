<template>
  <li class="PlayListItemBase">
    <slot>
    </slot>
  </li>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {State, Mutation, Action} from "vuex-class";

  @Component({})
  export default class PlayListItemBase extends Vue {

  }
</script>

<style lang="scss">
  .PlayListItemBase {
    padding: 0 20px;
    outline: none;
    &:hover {
      color: #fff;
      background-color: rgba(255,255,255,.1);
      & > .operation {
        opacity: 1;
      }
    }
    &>div{
      position: relative;
      outline: none;
      display: flex;
      align-items: center;
      height: 50px;
      font-size: 14px;
      text-align: left;
      color: #ccc;
      box-sizing: border-box;
      padding-left: 20px;


      &.playing {
        color: #4cbafa;
        &:hover {
          color: #3591e2;
        }
      }

      &.select{
        background-color: rgb(0,90,158);
      }

      .operation {
        width: 100px;
        height: 100%;
        display: flex;
        opacity: 0;
        transition: opacity .3s;
        margin-right: 20px;

        .play, .add, .remove {
          width: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 32px;
          &:hover {
            background-color: rgba(255, 255, 255, .2);
          }
        }
      }


      .title {
        font-weight: normal;
        flex: 4;
        box-sizing: border-box;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .artist {
        flex: 3;
      }
      .album {
        flex: 3;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .year {
        flex: 1;
      }
      .time {
        width: 60px;
      }
    }

  }

  .checkbox-area {
    width: 50px;
    .checkbox {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      &.no-select {
        border: 1px solid #fff;
      }
      &:hover {
        &.no-select {
          border: 1px solid #999;
        }
      }
    }
  }

</style>