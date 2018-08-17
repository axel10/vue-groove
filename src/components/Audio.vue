<template>
  <div class="Audio">
    <audio id="player" loop="loop" >
      <source :src="serverPath" type="audio/mpeg">
    </audio>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {namespace} from 'vuex-class'

  const audioModule = namespace('audio')

  @Component({})
  export default class Audio extends Vue {
    @audioModule.State serverPath!:string
    @audioModule.Action init!:any
    @audioModule.Action play!:any

    public mounted(){
      this.init()
    }
  }
</script>

<style scoped lang="scss">
  .Audio {

  }
</style>