<template>
  <div class="TimeSlider" @mousedown="handleInputTime">
    <Slider :value="timePercent" @on-change="handleSelectTime" :tip-format="formatProgress" :disabled="disabled"></Slider>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {getTimeStr} from "../../store/modules/audio";
  import {namespace} from "vuex-class";

  const audioModule = namespace("audio");

  @Component({})
  export default class TimeSlider extends Vue {
    @audioModule.State duration!: number;
    @audioModule.Mutation handleSelectTime!: any;
    @audioModule.Mutation handleInputTime!: any;
    @audioModule.Getter timePercent!: any;

    get disabled() {
      return this.duration == 0;
    }

    formatProgress(val: number) {
      var sec = this.duration * (val / 100);
      return getTimeStr(sec);
    }
  }
</script>

<style scoped lang="scss">
  .TimeSlider {

  }
</style>