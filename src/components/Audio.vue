<template>
  <div class="Audio">
    <audio id="player" loop="loop">
      <source :src="serverPath" type="audio/mpeg" @error="onError"/>
    </audio>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"
  import {namespace} from "vuex-class"
  import {beginPlay, pausePlay} from "@/utils/utils"

  const audioModule = namespace("audio")

  @Component({})
  export default class Audio extends Vue {
    @audioModule.State serverPath!: string
    @audioModule.Action init!: any

    public mounted() {
      this.init()
    }

    onError() {

      this.$store.commit({type: "audio/onPlayerError", context: this})
    }
  }
</script>

<style scoped lang="scss">
  .Audio {

  }
</style>
