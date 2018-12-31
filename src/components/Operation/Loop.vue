<template>
  <div class="Loop" @click="switchLoopMode" :class="{'active':loopMode===LoopMode.loopAll||loopMode===LoopMode.loopSingle}">
    <img src="/res/vcplayer/loop.svg" alt="" v-if="loopMode===LoopMode.close||loopMode===LoopMode.loopAll">
    <img src="/res/vcplayer/loopSingle.svg" alt="" v-if="loopMode===LoopMode.loopSingle">
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";
  import {LoopMode} from '@/utils/enum/LoopMode';

  const audioModule = namespace('audio')

  @Component({})
  export default class Loop extends Vue {
    @audioModule.State loopMode!:number
    @audioModule.Mutation switchLoopMode!:any

    LoopMode = LoopMode
  }
</script>

<style lang="scss">

</style>
