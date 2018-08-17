<template>
  <div @click="toggleRandom" class="Random" :class="{'active':isRandom}">
    <Icon type="ios-shuffle"/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {State, Mutation, Action, namespace} from "vuex-class";
  const audioModule = namespace('audio')

  @Component({})
  export default class Random extends Vue {
    @audioModule.State isRandom!:boolean
    @audioModule.Mutation toggleRandom!:any
  }
</script>

<style scoped lang="scss">
  .Random {
    &.active{
      background-color: rgba(0,0,0,.3);
    }
  }
</style>