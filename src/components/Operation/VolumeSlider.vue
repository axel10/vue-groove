<template>
  <div class="VolumeSlider">
    <div class="volume-icon">
      <slot>
      </slot>
    </div>
    <div class="volume" @wheel="scroll">
      <Slider :value="volume" @on-input="handleChangeVolume"></Slider>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {namespace} from "vuex-class";
  import VolumeIcon from "./VolumeIcon.vue";

  const audioModule = namespace("audio");

  @Component({
    components: {VolumeIcon}
  })
  export default class VolumeSlider extends Vue {
    @audioModule.Mutation handleChangeVolume!: any;
    @audioModule.State volume!: number;

    scroll(e:WheelEvent){
      if (e.deltaY>0){
        this.$store.commit('audio/addVolume',-2)
      } else{
        this.$store.commit('audio/addVolume',2)
      }
    }
  }
</script>

<style scoped lang="scss">
  .VolumeSlider {
    width: 100%;
    display: flex;
    align-items: center;
    .volume{
      flex: 1;
    }
  }
</style>