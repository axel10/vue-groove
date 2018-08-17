<template>
  <div class="Loop" @click="switchLoopMode" :class="{'active':loopMode===1||loopMode===2}">
    <img src="/res/vcplayer/loop.svg" alt="" v-if="loopMode===1||loopMode===0">
    <img src="/res/vcplayer/loopSingle.svg" alt="" v-if="loopMode===2">
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";

  const audioModule = namespace('audio')

  @Component({})
  export default class Loop extends Vue {
    @audioModule.State loopMode!:number
    @audioModule.Mutation switchLoopMode!:any
  }
</script>

<style scoped lang="scss">
  .Loop {
    &.active{
      background-color: rgba(0,0,0,.3);
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>